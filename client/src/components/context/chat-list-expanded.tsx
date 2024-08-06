'use client';

import * as React from 'react';

const ChatListExpandedContext = React.createContext<{
	isExpanded: boolean;
	expand: () => void;
	collapse: () => void;
}>({
	isExpanded: true,
	expand: () => {},
	collapse: () => {},
});

export function ChatListExpandedProvider({ children }: { children: React.ReactNode }) {
	const [isExpanded, setIsExpanded] = React.useState(true);

	const expand = () => {
		setIsExpanded(true);
	};

	const collapse = () => {
		setIsExpanded(false);
	};

	return (
		<ChatListExpandedContext.Provider
			value={{
				isExpanded,
				expand,
				collapse,
			}}
		>
			{children}
		</ChatListExpandedContext.Provider>
	);
}

export const useChatListExpanded = () => React.useContext(ChatListExpandedContext);
