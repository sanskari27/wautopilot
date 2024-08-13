'use client';

import { io } from 'socket.io-client';
import { SERVER_URL } from './lib/consts';
import AuthService from './services/auth.service';

export const socket = io(SERVER_URL + 'conversation');

socket.on('connect', () => {
	AuthService.generateConversationMessageKey().then((key) => {
		socket.emit('listen_new_messages', key);
	});
});
