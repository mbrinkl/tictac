import { Client, Room } from 'colyseus.js';
import { create } from 'zustand';
import { GameState } from '../../shared/src/schema/GameState';

interface IUserStore {
  client: Client;
  room: Room<GameState> | null;
  state: GameState | null;
  setRoom: (room: Room<GameState>) => void;
  setState: (state: GameState) => void;
}

export const useUserStore = create<IUserStore>()((set) => ({
  client: new Client('ws://localhost:2567'),
  room: null,
  state: null,
  setRoom: (room) => set({ room }),
  setState: (state) => set({ state }),
}));
