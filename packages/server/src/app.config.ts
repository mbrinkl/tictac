import { LobbyRoom } from 'colyseus';
import config from '@colyseus/tools';
import { monitor } from '@colyseus/monitor';
import { playground } from '@colyseus/playground';
import { GAME_ROOM, LOBBY_ROOM } from '@tictac/shared';
import { GameRoom } from './GameRoom';
import express from 'express';
import path from 'path';

export default config({
	initializeGameServer: (gameServer) => {
		gameServer.define(LOBBY_ROOM, LobbyRoom);
		gameServer.define(GAME_ROOM, GameRoom).enableRealtimeListing();
	},

	initializeExpress: (app) => {
		// todo: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
		app.use('/monitor', monitor());

		if (process.env.NODE_ENV !== 'production') {
			app.use('/', playground);
		} else {
			app.use(express.static(path.join(__dirname, '../../client/dist')));
			app.get('*', (_, response) => {
				response.sendFile(path.resolve(__dirname, '../../client/dist/index.html'));
			});
		}
	},
});
