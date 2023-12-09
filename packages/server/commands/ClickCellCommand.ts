import { Command } from '@colyseus/command';
import { BattleRoom } from '../rooms/BattleRoom';
import { isValidMove } from '../../shared/moves';
import { NUM_PLAYERS } from '../../shared/config';

const winConditions = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

const isVictory = (board: string[], playerMark: string): boolean => {
	const indices = board.reduce((a, e, i) => (e === playerMark ? a.concat(i) : a), []);
	return winConditions.some((winCondition) => winCondition.every((index) => indices.includes(index)));
};

interface IClickCellCommandArgs {
	sessionId: string;
	index: number;
}

export class ClickCellCommand extends Command<BattleRoom, IClickCellCommandArgs> {
	execute({ sessionId, index }: IClickCellCommandArgs) {
		if (!this.room.started || !isValidMove(index, this.state.board)) {
			return;
		}

		const player = this.state.players.get(sessionId);
		if (player.id! == this.state.activePlayerId) {
			return;
		}

		this.state.board[index] = player.mark;

		if (isVictory(this.state.board, player.mark)) {
			console.log('winner: ', player.id);
		} else if (this.state.board.every((cell) => cell !== '')) {
			console.log('draw');
		}

		// continue on...
		this.state.activePlayerId = (this.state.activePlayerId + 1) % NUM_PLAYERS;
		const { elapsedTime } = this.clock;
		player.timeRemainingMs -= elapsedTime - this.state.lastElapsed;
		this.state.lastElapsed = elapsedTime;
	}
}
