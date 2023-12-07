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

  onLeave(client: Client) {
    this.state.players.get(client.sessionId).isConnected = false;
  }
}
