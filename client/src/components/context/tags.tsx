'use client';

import * as React from 'react';

const TagsContext = React.createContext<string[]>([]);
const FieldsContext = React.createContext<
	{
		label: string;
		value: string;
	}[]
>([]);

export function TagsProvider({ children, data }: { children: React.ReactNode; data: string[] }) {
	return <TagsContext.Provider value={data}>{children}</TagsContext.Provider>;
}

export const useTags = () => React.useContext(TagsContext);

export function FieldsContextProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: {
		label: string;
		value: string;
	}[];
}) {
	return <FieldsContext.Provider value={data}>{children}</FieldsContext.Provider>;
}

export const useFields = () => React.useContext(FieldsContext);
