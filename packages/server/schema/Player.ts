import { Schema, type } from '@colyseus/schema';
import { IPlayer } from '../../shared';

export class Player extends Schema implements IPlayer {
	@type('number') id;
	@type('string') name;
	@type('string') mark;
	@type('boolean') isConnected;
	@type('number') timeRemainingMs;

	constructor(id: number, name: string = 'No Name') {
		super();
		this.id = id;
		this.name = name;
		this.mark = id === 0 ? 'X' : 'O';
		this.isConnected = true;
		this.timeRemainingMs = 300 * 1000;
	}
}
