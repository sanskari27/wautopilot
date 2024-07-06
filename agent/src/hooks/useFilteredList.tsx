import { useMemo, useState } from 'react';

export default function useFilteredList<T extends object>(
	list: T[],
	opts: { [K in keyof T]?: number }
): {
	filtered: T[];
	setSearchText: (text: string) => void;
} {
	const [searchText, setSearchText] = useState('');

	const filtered = useMemo(
		() =>
			list.filter((obj) => {
				for (const key in opts) {
					if (key in obj && opts[key] === 1) {
						if ((obj[key] as string).toLowerCase().includes(searchText.toLowerCase())) {
							return true;
						}
					}
				}
				return false;
			}),
		[list, searchText, opts]
	);
	return { filtered, setSearchText };
}
