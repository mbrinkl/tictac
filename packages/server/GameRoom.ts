import { Dispatcher } from '@colyseus/command';
import { Client, Room } from 'colyseus';
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
	dispatcher = new Dispatcher(this);

	onCreate(options: IGameRoomCreateOptions) {
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

	onJoin(client: Client, options: IGameRoomJoinOptions) {
		const playerId = this.state.players.size;
		if (playerId === NUM_PLAYERS) {
			return;
		}
		this.state.players.set(client.sessionId, new Player(playerId, options.name));

		if (this.state.players.size === NUM_PLAYERS) {
			this.state.status = GameStatus.InProgress;
			this.clock.start();
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

	forfeit(sessionId: string) {
		if (this.state.status !== GameStatus.InProgress) return;
		const player = this.state.players.get(sessionId);
		this.state.status = GameStatus.Forfeited;
		this.state.winnerId = (player.id + 1) % 2;
	}

	canMakeMove(sessionId: string): boolean {
		return (
			this.state.status === GameStatus.InProgress &&
			this.state.players.has(sessionId) &&
			this.state.players.get(sessionId).id === this.state.activePlayerId
		);
	}
}
