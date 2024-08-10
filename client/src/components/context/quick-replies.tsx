'use client';

import { QuickReply } from '@/types/recipient';
import * as React from 'react';

const QuickReplyContext = React.createContext<QuickReply[]>([]);

export function QuickReplyProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: QuickReply[];
}) {
	return <QuickReplyContext.Provider value={data}>{children}</QuickReplyContext.Provider>;
}

export const useQuickReplies = () => React.useContext(QuickReplyContext);
