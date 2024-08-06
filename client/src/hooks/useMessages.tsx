'use client';
import { useRecipient } from '@/components/context/recipients';
import MessagesService from '@/services/messages.service';
import { Message } from '@/types/recipient';
import { useEffect, useRef, useState } from 'react';
import useBoolean from './useBoolean';

export default function useMessages(id: string) {
	const { markRead } = useRecipient();
	const { value: loading, off: stopLoading, on: startLoading } = useBoolean(true);
	const [messages, setMessages] = useState<Message[]>([]);
	const [expiry, setExpiry] = useState<number | 'EXPIRED'>('EXPIRED');
	const [messageLabels, setMessageLabels] = useState<string[]>([]);

	const pagination = useRef({
		page: 1,
		loadMore: true,
		lastFetched: {
			page: 1,
			recipient_id: '',
		},
	});

	useEffect(() => {
		if (
			!id ||
			(pagination.current.lastFetched.recipient_id === id &&
				pagination.current.lastFetched.page === 1)
		) {
			return;
		}
		const abortController = new AbortController();
		pagination.current.loadMore = true;
		pagination.current.page = 1;
		MessagesService.fetchConversationMessages(id, {
			page: 1,
			signal: abortController.signal,
		}).then((data) => {
			markRead(id);
			setMessages(data.messages);
			setExpiry(data.expiry);
			setMessageLabels(data.messageLabels);
			stopLoading();
			if (data.messages.length < 50) {
				pagination.current.loadMore = false;
			}
			pagination.current.lastFetched.page = 1;
			pagination.current.lastFetched.recipient_id = id;
		});

		return () => {
			abortController.abort();
		};
	}, [id, markRead, stopLoading]);

	const loadMore = () => {
		if (!id) {
			return;
		} else if (!pagination.current.loadMore) {
			return;
		} else if (
			pagination.current.lastFetched.recipient_id === id &&
			pagination.current.lastFetched.page === pagination.current.page
		) {
			return;
		}

		pagination.current.page++;
		startLoading();
		MessagesService.fetchConversationMessages(id, {
			page: pagination.current.page,
		}).then((data) => {
			setMessages([...messages, ...data.messages]);
			stopLoading();
			if (data.messages.length < 50) {
				pagination.current.loadMore = false;
			}
			pagination.current.lastFetched.page = 1;
			pagination.current.lastFetched.recipient_id = id;
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
