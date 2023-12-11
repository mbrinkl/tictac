export enum GameStatus {
	None,
	InProgress,
	WinP0,
	WinP1,
	Draw,
}

export interface IBattleRoomJoinOptions {
	name?: string;
}

export interface IBattleRoomCreateOptions extends IBattleRoomJoinOptions {
	isPrivate?: boolean;
}

export interface IPlayer {
	id: number;
	name: string;
	mark: string;
	isConnected: boolean;
	timeRemainingMs: number;
}

export interface IGameState {
	players: Map<string, IPlayer>;
	board: string[];
	activePlayerId: number;
	lastElapsed: number;
	status: GameStatus;
}
