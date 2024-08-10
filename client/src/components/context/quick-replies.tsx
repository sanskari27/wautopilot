'use client';

import { QuickReply } from '@/types/recipient';
import * as React from 'react';

const QuickReplyContext = React.createContext<{
	list: QuickReply[];
	addQuickReply: (quickReply: QuickReply) => void;
	removeQuickReply: (id: string) => void;
	updateQuickReply: (id: string, message: string) => void;
}>({
	list: [],
	addQuickReply: () => {},
	removeQuickReply: () => {},
	updateQuickReply: () => {},
});

export function QuickReplyProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: QuickReply[];
}) {
	const [value, setValue] = React.useState<QuickReply[]>(data);

	const addQuickReply = (quickReply: QuickReply) => {
		setValue([...value, quickReply]);
	};

	const removeQuickReply = (id: string) => {
		setValue(value.filter((item) => item.id !== id));
	};

	const updateQuickReply = (id: string, message: string) => {
		setValue(
			value.map((item) => {
				if (item.id === id) {
					return {
						...item,
						message,
					};
				}
				return item;
			})
		);
	};
	return (
		<QuickReplyContext.Provider
			value={{
				list: value,
				addQuickReply,
				removeQuickReply,
				updateQuickReply,
			}}
		>
			{children}
		</QuickReplyContext.Provider>
	);
}

export const useQuickReplies = () => React.useContext(QuickReplyContext);
