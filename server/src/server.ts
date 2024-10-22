import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import configServer from './server-config';

import Logger from 'n23-logger';
import connectDB from '../mongo';
import { DATABASE_URL, PORT } from './config/const';
import SocketServer from './socket';

//  ------------------------- Setup Variables
const app = express();

configServer(app);
connectDB(DATABASE_URL)
	.then(async () => {
		Logger.info('Running Status', 'Database connected');
	})
	.catch((err) => {
		Logger.critical('Database Connection Failed', err);
		process.exit();
	});

const server = app.listen(PORT, async () => {
	SocketServer.getInstance(server);
	Logger.info('Running Status', `Server started on port ${PORT}`);
});

process.setMaxListeners(0);
process.on('unhandledRejection', (err: Error) => {
	Logger.critical('Unhandled rejection', err);
	server.close(() => process.exit(1));
});
