'use client';

import useBoolean from '@/hooks/useBoolean';

export const LogText = ({ children }: { children: React.ReactNode }) => {
	const { value: expanded, toggle: setExpanded } = useBoolean();

	return (
		<div
			className={`whitespace-pre-wrap cursor-pointer overflow-hidden text-ellipsis transition-[0.5s] ${
				expanded ? 'max-h-none' : 'max-h-10'
			}`}
			onClick={setExpanded}
		>
			{children}
		</div>
	);
};
