'use client';

import { QuickReply } from '@/types/recipient';
import * as React from 'react';

const QuickReplyContext = React.createContext<{
	textTemplates: {
		id: string;
		type: 'text';
		data: {
			message: string;
		};
	}[];
	buttonTemplates: {
		id: string;
		type: 'button';
		data: {
			body: string;
			buttons: string[];
		};
	}[];
	listTemplates: {
		id: string;
		type: 'list';
		data: {
			header: string;
			body: string;
			footer: string;
			sections: {
				title: string;
				buttons: string[];
			}[];
		};
	}[];
	flowTemplates: {
		id: string;
		type: 'flow';
		data: {
			header: string;
			body: string;
			footer: string;
			flow_id: string;
			button_text: string;
		};
	}[];
	locationTemplates: {
		id: string;
		type: 'location';
		data: {
			body: string;
		};
	}[];
	addQuickReply: (quickReply: QuickReply) => void;
	removeQuickReply: (id: string) => void;
	updateQuickReply: (id: string, quickReply: QuickReply) => void;
}>({
	textTemplates: [],
	buttonTemplates: [],
	listTemplates: [],
	flowTemplates: [],
	locationTemplates: [],
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
	const [items, setItems] = React.useState<QuickReply[]>(data);

	const addQuickReply = (quickReply: QuickReply) => {
		setItems([...items, quickReply]);
	};

	const removeQuickReply = (id: string) => {
		setItems(items.filter((item) => item.id !== id));
	};

	const updateQuickReply = (id: string, data: QuickReply) => {
		setItems((prev) => {
			return prev.map((item) => {
				if (item.id === id) {
					return data;
				}
				return item;
			});
		});
	};
	const textTemplates = items.filter((item) => item.type === 'text');
	const buttonTemplates = items.filter((item) => item.type === 'button');
	const listTemplates = items.filter((item) => item.type === 'list');
	const flowTemplates = items.filter((item) => item.type === 'flow');
	const locationTemplates = items.filter((item) => item.type === 'location');

	return (
		<QuickReplyContext.Provider
			value={{
				textTemplates,
				buttonTemplates,
				listTemplates,
				flowTemplates,
				locationTemplates,
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
