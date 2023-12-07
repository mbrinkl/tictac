export interface IPlayer {
  id: number;
  mark: string;
  isConnected: boolean;
  timeRemainingMs: number;
}

export interface IGameState {
  players: Map<string, IPlayer>;
  board: string[];
  activePlayerId: number;
  lastElapsed: number;
}
