'use client';

import { Template } from '@/types/template';
import * as React from 'react';

const TemplatesContext = React.createContext<Template[]>([]);

export function TemplatesProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: Template[];
}) {
	return <TemplatesContext.Provider value={data}>{children}</TemplatesContext.Provider>;
}

export const useTemplates = () => React.useContext(TemplatesContext);
