import MessagesService from '@/services/messages.service';
import { Message } from '@/types/recipient';
import { create } from 'zustand';

interface MessagesState {
	replyMessageId: string;
	messages: Message[];
	loading: boolean;
	expiry: number | 'EXPIRED';
	messageLabels: string[];
	pagination: {
		page: number;
		loadMore: boolean;
		loading: boolean;
		lastFetched: {
			page: number;
			recipient_id: string;
		};
		current_id: string;
	};
	setReplyMessageId: (id: string) => void;
	fetchMessages: (id: string) => void;
	loadMoreMessages: (id: string) => void;
	addMessage: (msg: Message) => void;
	updateMessage: (msg: Message) => void;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
	replyMessageId: '',
	messages: [],
	loading: true,
	expiry: 'EXPIRED',
	messageLabels: [],
	pagination: {
		page: 1,
		loadMore: true,
		loading: false,
		lastFetched: {
			page: 1,
			recipient_id: '',
		},
		current_id: '',
	},

	fetchMessages: async (id: string) => {
		const { pagination } = get();
		const shouldAbort =
			!id ||
			pagination.loading ||
			(pagination.lastFetched.recipient_id === id && pagination.lastFetched.page === 1);

		if (shouldAbort) return;

		set({ loading: true, messages: [] });

		const data = await MessagesService.fetchConversationMessages(id, {
			page: 1,
		});

		set((state) => ({
			messages: data.messages,
			expiry: data.expiry,
			messageLabels: data.messageLabels,
			loading: false,
			pagination: {
				...state.pagination,
				loadMore: data.messages.length >= 50,
				lastFetched: { page: 1, recipient_id: id },
			},
		}));
	},

	loadMoreMessages: async (id: string) => {
		const { pagination, messages } = get();
		const shouldAbort =
			!id ||
			pagination.loading ||
			!pagination.loadMore ||
			(pagination.lastFetched.recipient_id === id &&
				pagination.lastFetched.page === pagination.page + 1);

		if (shouldAbort) return;

		set((state) => ({
			pagination: {
				...state.pagination,
				page: state.pagination.page + 1,
				loading: true,
			},
			loading: true,
		}));

		const data = await MessagesService.fetchConversationMessages(id, {
			page: pagination.page + 1,
		});

		set((state) => ({
			messages: [...state.messages, ...data.messages],
			pagination: {
				...state.pagination,
				loadMore: data.messages.length >= 50,
				lastFetched: { page: state.pagination.page, recipient_id: id },
				loading: false,
			},
			loading: false,
		}));
	},

	addMessage: (msg: Message) => {
		set((state) => ({
			messages: [msg, ...state.messages],
		}));
	},

	updateMessage: (msg: Message) => {
		set((state) => ({
			messages: state.messages.map((m) => (m._id === msg._id ? msg : m)),
		}));
	},
	setReplyMessageId: (id: string) => {
		set({ replyMessageId: id });
	},
}));
