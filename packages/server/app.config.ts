import config from '@colyseus/tools';
import { monitor } from '@colyseus/monitor';
import { playground } from '@colyseus/playground';
import { BattleRoom } from './rooms/BattleRoom';
import { LobbyRoom } from 'colyseus';
import express from 'express';
import path from 'path';

export default config({
	initializeGameServer: (gameServer) => {
		gameServer.define('lobby', LobbyRoom);
		gameServer.define('battle', BattleRoom).enableRealtimeListing();
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
			app.get('*', function (request, response) {
				console.log('in it', path.resolve(__dirname, '../../../client/build/index.html'));
				response.sendFile(path.resolve(__dirname, '../../../client/build/index.html'));
			});
		}
	},
});
