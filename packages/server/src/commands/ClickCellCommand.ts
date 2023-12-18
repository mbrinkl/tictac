import { Command } from '@colyseus/command';
import { isValidMove, GameStatus, isVictory, isDraw } from '@tictac/shared';
import { GameRoom } from '../GameRoom';

interface IClickCellCommandArgs {
	sessionId: string;
	index: number;
}

export class ClickCellCommand extends Command<GameRoom, IClickCellCommandArgs> {
	execute({ sessionId, index }: IClickCellCommandArgs) {
		if (!this.room.isClientActivePlayer(sessionId) || !isValidMove(index, this.state.board)) return;

		const player = this.state.players.get(sessionId);

		this.room.clearEndGameTimer();
		this.room.updateTimeRemaining(player);

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
