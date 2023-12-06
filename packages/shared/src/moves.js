"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidMove = void 0;
var isValidMove = function (index, board) {
    return index >= 0 && index < board.length && board[index] === '';
};
exports.isValidMove = isValidMove;
