import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

export const reconnectToken: Writable<string | null> = localStorageStore('reconnect-token', null);
