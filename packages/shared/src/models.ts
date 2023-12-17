export enum GameStatus {
	None,
	InProgress,
	Finished,
	Forfeited,
	TimedOut,
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
	turnStartDate: number;
}

export interface IGameState {
	players: Map<string, IPlayer>;
	board: string[];
	activePlayerId: number;
	status: GameStatus;
	winnerId: number;
}
