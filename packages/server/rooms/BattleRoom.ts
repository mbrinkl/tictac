import { Client, Room } from "colyseus";
// import { Player, GameState } from "@tictac/shared/schema/GameState";
import { isValidMove } from "@tictac/shared/moves";
import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";

const NUM_PLAYERS = 2;

export class Player extends Schema {
  @type("number") id: number;
  @type("string") mark: string;
  @type("boolean") isConnected: boolean;
  @type("number") timeRemainingMs: number;

  constructor(id: number) {
    super();
    this.id = id;
    this.mark = id === 0 ? "X" : "O";
    this.isConnected = true;
    this.timeRemainingMs = 10 * 1000;
  }
}

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ array: "string" }) board = new ArraySchema<string>(
    ...Array(9).fill("")
  );
  @type("number") activePlayerId = 0;
  @type("number") lastElapsed = 0;
}

export class BattleRoom extends Room<GameState> {
  onCreate() {
    this.setState(new GameState());

    this.onMessage("cell_click", (client, index: number) => {
      if (!isValidMove(index, this.state.board)) {
        return;
      }

      const player = this.state.players.get(client.sessionId);
      if (player.id === this.state.activePlayerId) {
        this.state.board[index] = player.mark;
        this.state.activePlayerId =
          (this.state.activePlayerId + 1) % NUM_PLAYERS;
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
      this.clock.start();
    }
  }

  onLeave(client: Client) {
    this.state.players.get(client.sessionId).isConnected = false;
  }
}
