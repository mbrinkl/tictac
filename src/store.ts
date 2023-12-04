import { Client, Room } from "colyseus.js";
import { create } from "zustand";

interface IUserStore {
  client: Client | null;
  room: Room<any> | null;
  setClient: (client: Client) => void;
  setRoom: (room: Room<any>) => void;
}

export const useUserStore = create<IUserStore>()((set) => ({
  client: null,
  room: null,
  setClient: (client) => set({ client }),
  setRoom: (room) => set({ room }),
}));
