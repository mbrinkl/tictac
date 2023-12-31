import { GameStatus, IGameState } from '@tictac/shared';
import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema';
import { Player } from './Player';

export class GameState extends Schema implements IGameState {
	@type({ map: Player }) players = new MapSchema<Player>();
	@type({ array: 'string' }) board = new ArraySchema<string>(...Array(9).fill(''));
	@type('number') activePlayerId = 0;
	@type('number') status = GameStatus.None;
	@type('number') winnerId = -1;
}
