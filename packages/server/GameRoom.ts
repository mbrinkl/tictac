import { Dispatcher } from '@colyseus/command';
import { Client, Room } from 'colyseus';
import { GameState } from './schema/GameState';
import { Player } from './schema/Player';
import { ClickCellCommand } from './commands/ClickCellCommand';
import { NUM_PLAYERS } from '../shared/config';
import { GameStatus, IGameRoomCreateOptions, IGameRoomJoinOptions } from '../shared/models';

export class GameRoom extends Room<GameState> {
	dispatcher = new Dispatcher(this);

	onCreate(options: IGameRoomCreateOptions) {
		if (options.isPrivate) {
			this.setPrivate(true);
		}
		this.setState(new GameState());

		this.onMessage('cell_click', (client, index: number) => {
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
		console.log('in leave', client.sessionId);
		// handle spectators
		if (!this.state.players.has(client.sessionId)) return;

		this.state.players.get(client.sessionId).isConnected = false;

		if (consented) {
			// end game by forfeit
			return;
		}

		try {
			await this.allowReconnection(client, 20);
			this.state.players.get(client.sessionId).isConnected = true;
		} catch (e) {
			// end game by forfeit
			console.log('on leave error', e);
		}
	}
}
