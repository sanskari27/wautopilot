'use client';

import { Media } from '@/types/media';
import * as React from 'react';

const MediaContext = React.createContext<Media[]>([]);

export function MediaProvider({ children, data }: { children: React.ReactNode; data: Media[] }) {
	return <MediaContext.Provider value={data}>{children}</MediaContext.Provider>;
}

export const useMedia = () => React.useContext(MediaContext);
