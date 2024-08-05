'use client';

import { TemplateWithID } from '@/schema/template';
import * as React from 'react';

const TemplatesContext = React.createContext<TemplateWithID[]>([]);

export function TemplatesProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: TemplateWithID[];
}) {
	return <TemplatesContext.Provider value={data}>{children}</TemplatesContext.Provider>;
}

export const useTemplates = () => React.useContext(TemplatesContext);
