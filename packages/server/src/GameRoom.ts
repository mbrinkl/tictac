import { Dispatcher } from '@colyseus/command';
import { Client, Delayed, Room, updateLobby } from 'colyseus';
import {
	CELL_CLICK_COMMAND,
	NUM_PLAYERS,
	GameStatus,
	IGameRoomCreateOptions,
	IGameRoomJoinOptions,
} from '@tictac/shared';
import { GameState } from './schema/GameState';
import { Player } from './schema/Player';
import { ClickCellCommand } from './commands/ClickCellCommand';

export class GameRoom extends Room<GameState> {
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

		await this.setMetadata({ playable: true });
		// updateLobby(this);
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

		if (this.state.players.size === NUM_PLAYERS) {
			this.state.status = GameStatus.InProgress;
			this.state.players.forEach((player, key) => {
				if (player.id === 0) {
					player.turnStartDate = Date.now();
					this.startEndGameTimer(key);
				}
			});
			await this.setMetadata({ playable: false });
			updateLobby(this);
		}
	}

	async onLeave(client: Client, consented: boolean) {
		// handle spectators
		if (!this.state.players.has(client.sessionId)) return;

		this.state.players.get(client.sessionId).isConnected = false;

		if (consented) {
			this.forfeit(client.sessionId);
			return;
		}

		try {
			await this.allowReconnection(client, 20);
			this.state.players.get(client.sessionId).isConnected = true;
		} catch (e) {
			this.forfeit(client.sessionId);
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
		this.startEndGameTimer(nextPlayerId);
	}

	canMakeMove(sessionId: string): boolean {
		return (
			this.state.status === GameStatus.InProgress &&
			this.state.players.has(sessionId) &&
			this.state.players.get(sessionId).id === this.state.activePlayerId
		);
	}

	startEndGameTimer(sessionId: string) {
		const player = this.state.players.get(sessionId);
		this.endGameTimer = this.clock.setTimeout(() => {
			player.timeRemainingMs = 0;
			this.endGame(GameStatus.TimedOut, (player.id + 1) % 2);
		}, player.timeRemainingMs);
	}

	cancelEndGameTimer() {
		this.endGameTimer.clear();
	}

	forfeit(sessionId: string) {
		const player = this.state.players.get(sessionId);
		this.endGame(GameStatus.Forfeited, (player.id + 1) % 2);
	}

	endGame(status: GameStatus, winnerId?: number) {
		if (this.state.status !== GameStatus.InProgress) return;

		this.cancelEndGameTimer();

		// end game
		this.state.status = status;
		if (winnerId !== undefined) this.state.winnerId = winnerId;

		// update active player time remaining
		this.state.players.forEach((player) => {
			if (player.id === this.state.activePlayerId) {
				const start = player.turnStartDate;
				const now = Date.now();
				const elapsed = now - start;
				player.timeRemainingMs -= elapsed;
			}
		});

		this.state.activePlayerId = -1;
	}
}
