import { Dispatcher } from '@colyseus/command';
import { Client, Delayed, Room, updateLobby } from 'colyseus';
import {
	CELL_CLICK_COMMAND,
	NUM_PLAYERS,
	GameStatus,
	IGameRoomCreateOptions,
	IGameRoomJoinOptions,
	IGameMetadata,
	IPlayer,
} from '@tictac/shared';
import { GameState } from './schema/GameState';
import { Player } from './schema/Player';
import { ClickCellCommand } from './commands/ClickCellCommand';

export class GameRoom extends Room<GameState, IGameMetadata> {
	endGameTimer: Delayed;
	dispatcher = new Dispatcher(this);

	async onCreate(options: IGameRoomCreateOptions) {
		if (options.isPrivate) {
			this.setPrivate(true);
		}
		this.setState(new GameState());

		this.onMessage(CELL_CLICK_COMMAND, (client, index: number) => {
			this.dispatcher.dispatch(new ClickCellCommand(), {
				sessionId: client.sessionId,
				index,
			});
		});
	}

	async onJoin(client: Client, options: IGameRoomJoinOptions) {
		const playerId = this.state.players.size;
		if (playerId === NUM_PLAYERS) {
			// joining as spectator
			const playerIds = Array.from(this.state.players.keys());
			const numSpectators = this.clients.filter((c) => !playerIds.includes(c.sessionId)).length;
			await this.setMetadata({ numSpectators });
			// todo update on leaving dont feel like doing rn
			return;
		}

		this.state.players.set(client.sessionId, new Player(playerId, options.name));
		await this.setMetadata({
			playerNames:
				this.metadata?.playerNames?.length === 1
					? [...(this.metadata.playerNames ?? []), options.name ?? 'NO_NAME']
					: [options.name ?? 'NO_NAME'],
		});
		updateLobby(this);

		if (this.state.players.size === NUM_PLAYERS) {
			this.state.status = GameStatus.InProgress;
			this.state.players.forEach((player) => {
				if (player.id === 0) {
					player.turnStartDate = Date.now();
					this.startEndGameTimer(player);
				}
			});
		}
	}

	async onLeave(client: Client, consented: boolean) {
		if (!this.state.players.has(client.sessionId)) return;

		const player = this.state.players.get(client.sessionId);
		player.isConnected = false;

		try {
			if (consented) {
				throw new Error('Consented Leave');
			}
			await this.allowReconnection(client, 10);
			player.isConnected = true;
		} catch {
			this.forfeit(player);
		}
	}

	getNextPlayerId(sessionId: string) {
		const playerIds = Array.from(this.state.players.keys());
		return playerIds[0] === sessionId ? playerIds[1] : playerIds[0];
	}

	startNextPlayerTurn(sessionId: string) {
		const nextPlayerId = this.getNextPlayerId(sessionId);
		const nextPlayer = this.state.players.get(nextPlayerId);
		this.state.activePlayerId = nextPlayer.id;
		nextPlayer.turnStartDate = Date.now();
		this.startEndGameTimer(nextPlayer);
	}

	canMakeMove(sessionId: string): boolean {
		return (
			this.state.status === GameStatus.InProgress &&
			this.state.players.has(sessionId) &&
			this.state.players.get(sessionId).id === this.state.activePlayerId
		);
	}

	startEndGameTimer(player: IPlayer) {
		this.endGameTimer = this.clock.setTimeout(() => {
			player.timeRemainingMs = 0;
			this.endGame(GameStatus.TimedOut, (player.id + 1) % 2);
		}, player.timeRemainingMs);
	}

	clearEndGameTimer() {
		this.endGameTimer.clear();
	}

	forfeit(player: IPlayer) {
		this.endGame(GameStatus.Forfeited, (player.id + 1) % 2);
	}

	endGame(status: GameStatus, winnerId?: number) {
		if (this.state.status !== GameStatus.InProgress) return;

		this.clearEndGameTimer();

		// end game
		this.state.status = status;
		if (winnerId !== undefined) this.state.winnerId = winnerId;

		// update active player time remaining
		this.state.players.forEach((player) => {
			if (player.id === this.state.activePlayerId) {
				this.updateTimeRemaining(player);
			}
		});

		this.state.activePlayerId = -1;
	}

	updateTimeRemaining(player: IPlayer) {
		const start = player.turnStartDate;
		const now = Date.now();
		const elapsed = now - start;
		player.timeRemainingMs -= elapsed;
	}
}
