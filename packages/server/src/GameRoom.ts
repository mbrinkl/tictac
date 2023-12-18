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

		this.onMessage('send_chat_message', (client, message: string) => {
			const player = this.state.players.get(client.sessionId);
			this.broadcast('chat_message_broadcast', `${player.name}: ${message}`);
		});
	}

	async onJoin(client: Client, options: IGameRoomJoinOptions) {
		const playerId = this.state.players.size;

		// Join as spectator if full
		if (playerId === NUM_PLAYERS) {
			const playerIds = Array.from(this.state.players.keys());
			const numSpectators = this.clients.filter((c) => !playerIds.includes(c.sessionId)).length;
			return await this.setMetadata({ numSpectators });
			// todo update on leaving dont feel like doing rn
		}

		// Create player and update lobby
		const playerName = options.name ?? 'NO_NAME';
		this.state.players.set(client.sessionId, new Player(playerId, playerName));
		await this.setMetadata({
			playerNames: [...(this.metadata?.playerNames ?? []), playerName],
		});
		updateLobby(this);

		// Start the game if full
		if (this.state.players.size === NUM_PLAYERS) {
			this.state.status = GameStatus.InProgress;
			const firstPlayer = Array.from(this.state.players.values())[0];
			firstPlayer.turnStartDate = Date.now();
			this.startEndGameTimer(firstPlayer);
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

	isClientActivePlayer(sessionId: string): boolean {
		return (
			this.state.status === GameStatus.InProgress &&
			this.state.players.has(sessionId) &&
			this.state.players.get(sessionId).id === this.state.activePlayerId
		);
	}

	getNextPlayer(sessionId: string): IPlayer {
		const playerIds = Array.from(this.state.players.keys());
		const nextPlayerId = playerIds[0] === sessionId ? playerIds[1] : playerIds[0];
		return this.state.players.get(nextPlayerId);
	}

	startNextPlayerTurn(sessionId: string) {
		const nextPlayer = this.getNextPlayer(sessionId);
		this.state.activePlayerId = nextPlayer.id;
		nextPlayer.turnStartDate = Date.now();
		this.startEndGameTimer(nextPlayer);
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

	updateTimeRemaining(player: IPlayer) {
		const start = player.turnStartDate;
		const now = Date.now();
		const elapsed = now - start;
		player.timeRemainingMs -= elapsed;
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
}
