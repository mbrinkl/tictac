import { Client, Room } from 'colyseus';
import { isValidMove } from '../../shared/moves';
import { GameState } from '../schema/GameState';
import { Player } from '../schema/Player';

const NUM_PLAYERS = 2;

export class BattleRoom extends Room<GameState> {
	started: boolean;

	onCreate() {
		this.started = false;
		this.setState(new GameState());

		this.onMessage('cell_click', (client, index: number) => {
			if (!this.started || !isValidMove(index, this.state.board)) {
				return;
			}

			const player = this.state.players.get(client.sessionId);
			if (player.id === this.state.activePlayerId) {
				this.state.board[index] = player.mark;
				this.state.activePlayerId = (this.state.activePlayerId + 1) % NUM_PLAYERS;
				const { elapsedTime } = this.clock;
				player.timeRemainingMs -= elapsedTime - this.state.lastElapsed;
				this.state.lastElapsed = elapsedTime;
			}
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
