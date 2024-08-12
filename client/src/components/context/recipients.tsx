'use client';

import { Recipient } from '@/types/recipient';
import * as React from 'react';

const RecipientsContext = React.createContext<{
	list: Recipient[];
	pinnedConversations: Recipient[];
	unpinnedConversations: Recipient[];
	selectedConversations: string[];
	selected_recipient: Recipient | null;
	setRecipientTags: (id: string, tags: string[]) => void;
	togglePin: (id: string) => void;
	markUnread: (id: string) => void;
	markRead: (id: string) => void;
	toggleSelected: (id: string) => void;
	setLabelFilter: (labels: string[]) => void;
	setSearchText: (text: string) => void;
	setSelectedRecipient: (recipient: Recipient) => void;
}>({
	list: [],
	pinnedConversations: [],
	unpinnedConversations: [],
	selectedConversations: [],
	selected_recipient: null,
	setRecipientTags: () => {},
	togglePin: () => {},
	markUnread: () => {},
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
	const [value, setValue] = React.useState<Recipient[]>(data);
	const [pinnedIds, setPinnedIds] = React.useState<string[]>([]);
	const [unReadConversations, setUnReadConversations] = React.useState<string[]>([]);
	const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
	const [selected_recipient, setSelectedRecipient] = React.useState<Recipient | null>(null);

	const filtered = React.useMemo(() => {
		return value.filter((item) => {
			return (
				(item.profile_name.toLowerCase().includes(searchText.toLowerCase()) ||
					item.recipient.includes(searchText)) &&
				label_filter.every((label) => item.labels.includes(label))
			);
		});
	}, [value, label_filter, searchText]);

	const pinnedConversations = React.useMemo(
		() => filtered.filter((item) => pinnedIds.includes(item._id)),
		[filtered, pinnedIds]
	);

	const unpinnedConversations = React.useMemo(
		() => filtered.filter((item) => !pinnedIds.includes(item._id)),
		[filtered, pinnedIds]
	);

	React.useEffect(() => {
		try {
			const pinned = JSON.parse(localStorage.getItem('pinned') ?? '[]');
			setPinnedIds(pinned || []);
		} catch (err) {}
	}, []);

	function setRecipientTags(id: string, tags: string[]) {
		const newValue = value.map((item) => {
			if (item._id === id) {
				return { ...item, tags };
			}
			return item;
		});
		setValue(newValue);
	}

	function togglePin(id: string) {
		const newPinnedIds = pinnedIds.includes(id)
			? pinnedIds.filter((item) => item !== id)
			: [id, ...pinnedIds];

		localStorage.setItem('pinned', JSON.stringify(newPinnedIds));
		setPinnedIds(newPinnedIds);
	}

	function markUnread(id: string) {
		if (!unReadConversations.includes(id)) {
			setUnReadConversations([id, ...unReadConversations]);
		} else {
			setUnReadConversations([id, ...unReadConversations.filter((item) => item !== id)]);
		}
	}

	function markRead(id: string) {
		setUnReadConversations(unReadConversations.filter((item) => item !== id));
	}

	function toggleSelected(id: string) {
		if (selectedIds.includes(id)) {
			setSelectedIds(selectedIds.filter((item) => item !== id));
		} else {
			setSelectedIds([...selectedIds, id]);
		}
	}

	return (
		<RecipientsContext.Provider
			value={{
				list: value,
				pinnedConversations,
				unpinnedConversations,
				selectedConversations: selectedIds,
				selected_recipient,
				setRecipientTags,
				togglePin,
				markUnread,
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
