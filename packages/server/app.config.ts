import config from '@colyseus/tools';
import { monitor } from '@colyseus/monitor';
import { playground } from '@colyseus/playground';
import { GameRoom } from './GameRoom';
import { LobbyRoom } from 'colyseus';
import express from 'express';
import path from 'path';
import { GAME_ROOM, LOBBY_ROOM } from '../shared/config';

export default config({
	initializeGameServer: (gameServer) => {
		gameServer.define(LOBBY_ROOM, LobbyRoom);
		gameServer.define(GAME_ROOM, GameRoom).enableRealtimeListing();
	},

	initializeExpress: (app) => {
		/**
		 * Use @colyseus/monitor
		 * It is recommended to protect this route with a password
		 * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
		 */
		app.use('/monitor', monitor());

		if (process.env.NODE_ENV !== 'production') {
			app.use('/', playground);
		} else {
			app.use(express.static(path.join(__dirname, '../../../client/build')));
			app.get('*', (_, response) => {
				response.sendFile(path.resolve(__dirname, '../../../client/build/index.html'));
			});
		}
	},
});
