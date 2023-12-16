import { Command } from '@colyseus/command';
import { isValidMove, NUM_PLAYERS, GameStatus } from '@tictac/shared';
import { GameRoom } from '../GameRoom';

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

export class ClickCellCommand extends Command<GameRoom, IClickCellCommandArgs> {
	execute({ sessionId, index }: IClickCellCommandArgs) {
		if (!this.room.canMakeMove(sessionId) || !isValidMove(index, this.state.board)) return;

		const player = this.state.players.get(sessionId);

		const { elapsedTime } = this.clock;
		player.timeRemainingMs -= elapsedTime - this.state.lastElapsed;
		this.state.lastElapsed = elapsedTime;

		this.state.board[index] = player.mark;

		if (isVictory(this.state.board, player.mark)) {
			this.state.status = GameStatus.Finished;
			this.state.winnerId = player.id;
			this.clock.stop();
			return;
		} else if (this.state.board.every((cell) => cell !== '')) {
			this.state.status = GameStatus.Finished;
			this.clock.stop();
			return;
		}

		this.state.activePlayerId = (this.state.activePlayerId + 1) % NUM_PLAYERS;
	}
}
