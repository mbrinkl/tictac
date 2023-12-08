import { getContext } from 'svelte';
import type { Client } from 'colyseus.js';

export const getClient = () => {
	return getContext<Client>('client');
};
