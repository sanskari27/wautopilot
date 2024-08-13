'use client';
import { useRecipient } from '@/components/context/recipients';
import MessagesService from '@/services/messages.service';
import { Message } from '@/types/recipient';
import { useEffect, useRef, useState } from 'react';

export default function useMessages(id: string) {
	const { markRead } = useRecipient();
	const [loading, setLoading] = useState(true);
	const [messages, setMessages] = useState<Message[]>([]);
	const [expiry, setExpiry] = useState<number | 'EXPIRED'>('EXPIRED');
	const [messageLabels, setMessageLabels] = useState<string[]>([]);

	const pagination = useRef({
		page: 1,
		loadMore: true,
		loading: false,
		lastFetched: {
			page: 1,
			recipient_id: '',
		},
		current_id: '',
	});

	useEffect(() => {
		const _pagination = pagination.current;
		const _lastFetched = _pagination.lastFetched;
		const shouldAbort =
			!id || _pagination.loading || (_lastFetched.recipient_id === id && _lastFetched.page === 1);

		if (shouldAbort) {
			return;
		}

		const abortController = new AbortController();
		pagination.current.loadMore = true;
		pagination.current.page = 1;
		pagination.current.loading = true;
		setMessages([]);
		setLoading(true);
		MessagesService.fetchConversationMessages(id, {
			page: 1,
			signal: abortController.signal,
		}).then((data) => {
			setMessages(data.messages);
			setExpiry(data.expiry);
			setMessageLabels(data.messageLabels);
			setLoading(false);
			if (data.messages.length < 50) {
				pagination.current.loadMore = false;
			}
			pagination.current.loading = false;
			pagination.current.lastFetched.page = pagination.current.page;
			pagination.current.lastFetched.recipient_id = id;
		});

		return () => {
			abortController.abort();
		};
	}, [id]);

	useEffect(() => {
		if (id && pagination.current.current_id !== id) {
			pagination.current.current_id = id;
			MessagesService.markConversationRead(id);
		}
	}, [id, markRead]);

	const loadMore = () => {
		const _pagination = pagination.current;
		const _lastFetched = _pagination.lastFetched;
		const shouldAbort =
			!id ||
			_pagination.loading ||
			!_pagination.loadMore ||
			(_lastFetched.recipient_id === id && _lastFetched.page === _pagination.page + 1);

		if (shouldAbort) {
			return;
		}

		pagination.current.page++;
		pagination.current.loading = true;
		setLoading(true);
		MessagesService.fetchConversationMessages(id, {
			page: pagination.current.page,
		}).then((data) => {
			setLoading(false);
			setMessages([...messages, ...data.messages]);
			if (data.messages.length < 50) {
				pagination.current.loadMore = false;
			}
			pagination.current.lastFetched.page = pagination.current.page;
			pagination.current.lastFetched.recipient_id = id;
			pagination.current.loading = false;
		});
	};

	return {
		loading,
		messages,
		expiry,
		messageLabels,
		loadMore,
	};
}
