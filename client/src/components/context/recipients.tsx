'use client';

import useBoolean from '@/hooks/useBoolean';
import { socket } from '@/socket';
import { Recipient } from '@/types/recipient';
import * as React from 'react';

const RecipientsContext = React.createContext<{
	list: Recipient[];
	pinnedConversations: Recipient[];
	unpinnedConversations: Recipient[];
	selectedConversations: string[];
	selected_recipient: Recipient | null;
	showArchived: boolean;
	markRead: (id: string) => void;
	toggleSelected: (id: string) => void;
	setLabelFilter: (labels: string[]) => void;
	setSearchText: (text: string) => void;
	setSelectedRecipient: (recipient: Recipient) => void;
	toggleShowArchived: () => void;
}>({
	list: [],
	pinnedConversations: [],
	unpinnedConversations: [],
	selectedConversations: [],
	selected_recipient: null,
	showArchived: false,
	toggleShowArchived: () => {},
	markRead: () => {},
	toggleSelected: () => {},
	setLabelFilter: () => {},
	setSearchText: () => {},
	setSelectedRecipient: () => {},
});

export function RecipientProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: Recipient[];
}) {
	const [searchText, setSearchText] = React.useState('');
	const [label_filter, setLabelFilter] = React.useState<string[]>([]);
	const [list, setList] = React.useState<Recipient[]>(data);
	const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
	const [selected_recipient, setSelectedRecipient] = React.useState<Recipient | null>(null);
	const { value: showArchived, toggle: toggleShowArchived } = useBoolean(false);

	const filtered = React.useMemo(() => {
		return list.filter((item) => {
			const cond1 =
				item.profile_name.toLowerCase().includes(searchText.toLowerCase()) ||
				item.recipient.includes(searchText);
			const cond2 = (showArchived && item.archived) || (!showArchived && !item.archived);
			const cond3 = label_filter.every((label) => item.labels.includes(label));
			return cond1 && cond2 && cond3;
		});
	}, [list, label_filter, searchText, showArchived]);

	const { pinnedConversations, unpinnedConversations } = React.useMemo(
		() =>
			filtered.reduce(
				(acc, item) => {
					if (item.pinned) {
						acc.pinnedConversations.push(item);
					} else {
						acc.unpinnedConversations.push(item);
					}
					return acc;
				},
				{
					pinnedConversations: [] as Recipient[],
					unpinnedConversations: [] as Recipient[],
				}
			),
		[filtered]
	);

	const setTags = React.useCallback((phone_number: string, tags: string[]) => {
		setList((list) =>
			list.map((item) => {
				if (item.recipient === phone_number) {
					return { ...item, labels: tags };
				}
				return item;
			})
		);
	}, []);

	const togglePin = React.useCallback((id: string, pinned: boolean) => {
		setList((prev) =>
			prev.map((item) => {
				if (item.id === id) {
					return { ...item, pinned };
				}
				return item;
			})
		);
	}, []);

	const toggleArchived = React.useCallback((id: string, archived: boolean) => {
		setList((prev) =>
			prev.map((item) => {
				if (item.id === id) {
					return { ...item, archived };
				}
				return item;
			})
		);
	}, []);

	const markUnread = React.useCallback(
		(id: string) => {
			const unModified = list.filter((item) => item.id !== id);
			const modified = list.find((item) => item.id === id);
			if (modified) {
				modified.unreadCount++;
				setList([modified, ...unModified]);
			}
		},
		[list]
	);

	const markRead = React.useCallback((id: string) => {
		setList((prev) =>
			prev.map((item) => {
				if (item.id === id) {
					return { ...item, unreadCount: 0 };
				}
				return item;
			})
		);
	}, []);

	function toggleSelected(id: string) {
		if (selectedIds.includes(id)) {
			setSelectedIds(selectedIds.filter((item) => item !== id));
		} else {
			setSelectedIds([...selectedIds, id]);
		}
	}

	React.useEffect(() => {
		socket.on('new_message_notification', (conversation_id) => {
			markUnread(conversation_id);
		});

		socket.on('conversation_read', (conversation_id) => {
			markRead(conversation_id);
		});

		socket.on('conversation_pinned', (details) => {
			togglePin(details.conversation_id, details.pinned);
		});

		socket.on('conversation_archived', (details) => {
			toggleArchived(details.conversation_id, details.archived);
		});

		socket.on('labels_updated', (details) => {
			setTags(details.phone_number, details.labels);
		});
	}, [markRead, markUnread, setTags, toggleArchived, togglePin]);

	return (
		<RecipientsContext.Provider
			value={{
				list: list,
				pinnedConversations,
				unpinnedConversations,
				selectedConversations: selectedIds,
				selected_recipient,
				showArchived,
				toggleShowArchived,
				markRead,
				toggleSelected,
				setLabelFilter,
				setSearchText,
				setSelectedRecipient,
			}}
		>
			{children}
		</RecipientsContext.Provider>
	);
}

export const useRecipient = () => React.useContext(RecipientsContext);
