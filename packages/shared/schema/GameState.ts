import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";

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
