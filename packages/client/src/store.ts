import { Client, Room } from 'colyseus.js';
import { create } from 'zustand';
import { IGameState } from '@shared';

interface IUserStore {
  client: Client;
  room: Room<IGameState> | null;
  state: IGameState | null;
  setRoom: (room: Room<IGameState>) => void;
  setState: (state: IGameState) => void;
}

export const useUserStore = create<IUserStore>()((set) => ({
  client: new Client('ws://localhost:2567'),
  room: null,
  state: null,
  setRoom: (room) => set({ room }),
  setState: (state) => set({ state }),
}));
