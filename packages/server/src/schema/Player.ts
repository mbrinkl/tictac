import { Schema, type } from '@colyseus/schema';
import { IPlayer } from '@tictac/shared';

export class Player extends Schema implements IPlayer {
	@type('number') id;
	@type('string') name;
	@type('string') mark;
	@type('boolean') isConnected;
	@type('number') timeRemainingMs;
	@type('number') turnStartDate;

	constructor(id: number, name: string) {
		super();
		this.id = id;
		this.name = name;
		this.mark = id === 0 ? 'X' : 'O';
		this.isConnected = true;
		this.timeRemainingMs = 30 * 1000;
		this.turnStartDate = 0;
	}
}
