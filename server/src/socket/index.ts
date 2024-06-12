import * as http from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

export default class SocketServer {
	private static instance: SocketServer;
	private io: SocketIOServer;

	private conversationSockets: Map<string, Socket> = new Map();

	private constructor(server: http.Server) {
		this.io = new SocketIOServer(server);
		this.attachListeners();
	}

	public static getInstance(server?: http.Server): SocketServer {
		if (!SocketServer.instance) {
			if (!server) {
				throw new Error('SocketServer not initialized');
			}
			SocketServer.instance = new SocketServer(server);
		}

		return SocketServer.instance;
	}

	private attachListeners() {
		this.io.of('/conversation').on('connection', (socket) => {
			this.conversationSockets.set(socket.id, socket);

			socket.on('join_conversation', (conversation_id) => {
				socket.join(conversation_id);
			});

			socket.on('disconnect', () => {
				this.conversationSockets.delete(socket.id);
			});
		});
	}

	public sendMessage(conversation_id: string, message: any) {
		this.io.of('/conversation').to(conversation_id).emit('new_message', message);
	}
}
