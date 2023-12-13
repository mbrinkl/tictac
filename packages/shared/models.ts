export enum GameStatus {
	None,
	InProgress,
	WinP0,
	WinP1,
	Draw,
}

export interface IGameRoomJoinOptions {
	name?: string;
}

export interface IGameRoomCreateOptions extends IGameRoomJoinOptions {
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
