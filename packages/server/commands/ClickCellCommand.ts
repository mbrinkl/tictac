import { Command } from '@colyseus/command';
import { BattleRoom } from '../rooms/BattleRoom';
import { isValidMove } from '../../shared/moves';
import { NUM_PLAYERS } from '../../shared/config';

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
		if (player.id === this.state.activePlayerId) {
			this.state.board[index] = player.mark;
			this.state.activePlayerId = (this.state.activePlayerId + 1) % NUM_PLAYERS;
			const { elapsedTime } = this.clock;
			player.timeRemainingMs -= elapsedTime - this.state.lastElapsed;
			this.state.lastElapsed = elapsedTime;
		}
	}
}
