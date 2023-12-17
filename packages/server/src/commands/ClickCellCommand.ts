import { Command } from '@colyseus/command';
import { isValidMove, GameStatus } from '@tictac/shared';
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

const isDraw = (board: string[]) => board.every((cell) => cell !== '');

interface IClickCellCommandArgs {
	sessionId: string;
	index: number;
}

export class ClickCellCommand extends Command<GameRoom, IClickCellCommandArgs> {
	execute({ sessionId, index }: IClickCellCommandArgs) {
		if (!this.room.canMakeMove(sessionId) || !isValidMove(index, this.state.board)) return;

		this.room.cancelEndGameTimer();
		const player = this.state.players.get(sessionId);

		const start = player.turnStartDate;
		const now = Date.now();
		const elapsed = now - start;
		player.timeRemainingMs -= elapsed;

		this.state.board[index] = player.mark;

		if (isVictory(this.state.board, player.mark)) {
			return this.room.endGame(GameStatus.Finished, player.id);
		}

		if (isDraw(this.state.board)) {
			return this.room.endGame(GameStatus.Finished);
		}

		this.room.startNextPlayerTurn(sessionId);
	}
}
