'use client';

import * as React from 'react';

type BroadcastList = {
	broadcast_id: string;
	name: string;
	description: string;
	template_name: string;
	status: 'ACTIVE' | 'PAUSED';
	sent: number;
	failed: number;
	pending: number;
	isPaused: boolean;
	createdAt: string;
}[];

const BroadcastListContext = React.createContext<{
	list: BroadcastList;
	search: string;
	setSearchText: (text: string) => void;
}>({
	list: [],
	search: '',
	setSearchText: (text) => {},
});

export function BroadcastProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: BroadcastList;
}) {
	const [search, setSearch] = React.useState('');
	const [broadcastList, setAdmins] = React.useState<BroadcastList>(data);

	const list = broadcastList.filter(
		(admin) =>
			admin.name.toLowerCase().includes(search.toLowerCase()) ||
			admin.description.toLowerCase().includes(search.toLowerCase())
	);
	return (
		<BroadcastListContext.Provider
			value={{
				list: list,
				search: '',
				setSearchText: (text) => {
					setSearch(text);
				},
			}}
		>
			{children}
		</BroadcastListContext.Provider>
	);
}

export const useBroadcast = () => React.useContext(BroadcastListContext);
export const useBroadcastSearch = () => React.useContext(BroadcastListContext).setSearchText;
