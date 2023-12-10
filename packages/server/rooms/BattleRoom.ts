import { Dispatcher } from '@colyseus/command';
import { Client, Room } from 'colyseus';
import { GameState } from '../schema/GameState';
import { Player } from '../schema/Player';
import { ClickCellCommand } from '../commands/ClickCellCommand';
import { NUM_PLAYERS } from '../../shared/config';
import { GameStatus } from '../../shared/models';

interface IBattleRoomOptions {
	isPrivate?: boolean;
}

export class BattleRoom extends Room<GameState> {
	dispatcher = new Dispatcher(this);

	onCreate(options: IBattleRoomOptions) {
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

	onJoin(client: Client) {
		console.log('in join', client.sessionId);
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
			this.state.status = GameStatus.InProgress;
			this.clock.start();
		}
	}

	async onLeave(client: Client, consented: boolean) {
		this.state.players.get(client.sessionId).isConnected = false;

		try {
			if (consented) {
				throw new Error('consented leave');
			}
			await this.allowReconnection(client, 20);
			this.state.players.get(client.sessionId).isConnected = true;
		} catch (e) {
			console.log('on leave error', e);
		}
	}
}
