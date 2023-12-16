export const isValidMove = (index: number, board: string[]) => {
  return index >= 0 && index < board.length && board[index] === '';
};
