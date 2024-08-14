import * as http from 'http';
import { Socket, Server as SocketIOServer } from 'socket.io';

export default class SocketServer {
	private static instance: SocketServer;
	private io: SocketIOServer;

	private conversationSockets: Map<string, Socket> = new Map();
	private conversationKeys: Map<string, string> = new Map();

	private constructor(server: http.Server) {
		this.io = new SocketIOServer(server, {
			cors: {
				origin: '*',
			},
		});
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

			socket.on('leave_conversation', (conversation_id) => {
				socket.leave(conversation_id);
			});

			socket.on('listen_new_messages', (key) => {
				const user_id = this.conversationKeys.get(key);
				if (user_id) {
					socket.join(user_id);
				}
			});

			socket.on('disconnect', () => {
				this.conversationSockets.delete(socket.id);
			});
		});
	}

	public sendMessage(conversation_id: string, message: any) {
		this.io.of('/conversation').to(conversation_id).emit('message_new', message);
	}

	public sendMessageUpdated(conversation_id: string, message: any) {
		this.io.of('/conversation').to(conversation_id).emit('message_updated', message);
	}

	public sendNewMessageNotification(user_id: string, conversation_id: string) {
		this.io.of('/conversation').to(user_id).emit('new_message_notification', conversation_id);
	}

	public markRead(user_id: string, conversation_id: string) {
		this.io.of('/conversation').to(user_id).emit('conversation_read', conversation_id);
	}

	public sendConversationPinned(
		user_id: string,
		details: { conversation_id: string; pinned: boolean }
	) {
		this.io.of('/conversation').to(user_id).emit('conversation_pinned', details);
	}

	public labelsUpdated(user_id: string, details: { phone_number: string; labels: string[] }) {
		this.io.of('/conversation').to(user_id).emit('labels_updated', details);
	}

	public sendConversationArchived(
		user_id: string,
		details: { conversation_id: string; archived: boolean }
	) {
		this.io.of('/conversation').to(user_id).emit('conversation_archived', details);
	}

	public addConversationKey(key: string, user_id: string) {
		this.conversationKeys.set(key, user_id);
	}
}
