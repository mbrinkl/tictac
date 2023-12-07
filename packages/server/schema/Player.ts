import { Schema, type } from '@colyseus/schema';
import { IPlayer } from '../../shared';

export class Player extends Schema implements IPlayer {
  @type('number') id;
  @type('string') mark;
  @type('boolean') isConnected;
  @type('number') timeRemainingMs;

  constructor(id: number) {
    super();
    this.id = id;
    this.mark = id === 0 ? 'X' : 'O';
    this.isConnected = true;
    this.timeRemainingMs = 10 * 1000;
  }
}
