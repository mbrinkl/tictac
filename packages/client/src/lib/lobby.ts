import type { RoomAvailable, Client } from 'colyseus.js';
import { readonly, writable } from 'svelte/store';

const store = writable<RoomAvailable[]>([]);

export const joinLobby = async (client: Client) => {
	const lobby = await client.joinOrCreate('lobby');

	lobby.onMessage('rooms', (rooms) => {
		store.set(rooms);
	});

	lobby.onMessage('+', ([roomId, room]) => {
		store.update((prev) => {
			const updatedStore = [...prev];
			const roomIndex = updatedStore.findIndex((room) => room.roomId === roomId);
			if (roomIndex !== -1) {
				updatedStore[roomIndex] = room;
			} else {
				updatedStore.push(room);
			}
			return updatedStore;
		});
	});

	lobby.onMessage('-', (roomId) => {
		store.update((prev) => prev.filter((room) => room.roomId !== roomId));
	});
};

export const lobbyRooms = readonly(store);
