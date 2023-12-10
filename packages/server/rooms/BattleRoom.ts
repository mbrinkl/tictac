import { Dispatcher } from '@colyseus/command';
import { Client, Room } from 'colyseus';
import { GameState } from '../schema/GameState';
import { Player } from '../schema/Player';
import { ClickCellCommand } from '../commands/ClickCellCommand';
import { NUM_PLAYERS } from '../../shared/config';

interface IBattleRoomOptions {
	isPrivate?: boolean;
}

export class BattleRoom extends Room<GameState> {
	dispatcher = new Dispatcher(this);
	started: boolean;

	onCreate(options: IBattleRoomOptions) {
		if (options.isPrivate) {
			this.setPrivate(true);
		}
		this.started = false;
		this.setState(new GameState());

		this.onMessage('cell_click', (client, index: number) => {
			this.dispatcher.dispatch(new ClickCellCommand(), {
				sessionId: client.sessionId,
				index,
			});
		});
	}

	onJoin(client: Client) {
		if (this.state.players.has(client.sessionId)) {
			this.state.players.get(client.sessionId).isConnected = true;
			return;
		}
		const playerId = this.state.players.size;
		if (playerId === NUM_PLAYERS) {
			return;
		}
		this.state.players.set(client.sessionId, new Player(playerId));
		if (this.state.players.size === NUM_PLAYERS) {
			this.lock();
			this.started = true;
			this.clock.start();
		}
	}

	// async onLeave(client: Client, consented: boolean) {
	// 	console.log('IN LEAVE', client.sessionId);
	// 	this.state.players.get(client.sessionId).isConnected = false;

	// 	try {
	// 		if (consented) {
	// 			throw new Error('consented leave');
	// 		}

	// 		// allow disconnected client to reconnect into this room until 20 seconds
	// 		await this.allowReconnection(client, 20);

	// 		// client returned! let's re-activate it.
	// 		this.state.players.get(client.sessionId).isConnected = true;
	// 	} catch (e) {
	// 		console.log('in e', e);
	// 		// 20 seconds expired. let's remove the client.
	// 		// this.state.players.delete(client.sessionId);
	// 	}
	// }
}
