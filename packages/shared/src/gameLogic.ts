const winConditions: number[][] = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

export const isValidMove = (index: number, board: string[]) => {
	return index >= 0 && index < board.length && board[index] === '';
};

export const isVictory = (board: string[], playerMark: string): boolean => {
	const indices = board.map((value, i) => (value === playerMark ? i : -1)).filter((index) => index !== -1);
	return winConditions.some((winCondition) => winCondition.every((index) => indices.includes(index)));
};

export const isDraw = (board: string[]) => board.every((cell) => cell !== '');
