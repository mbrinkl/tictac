import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

interface IReconnectionStore {
	roomId: string;
	token: string;
}

export const playerName: Writable<string | null> = localStorageStore('player-name', null);
export const reconnectionStore: Writable<IReconnectionStore | null> = localStorageStore('reconnect-token', null);
