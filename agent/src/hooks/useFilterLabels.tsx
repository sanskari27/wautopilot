import { useState } from 'react';

export default function useFilterLabels() {
	const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

	const onAddLabel = (label: string) => {
		setSelectedLabels((prev) => {
			if (!prev.includes(label)) {
				return [...prev, label];
			}
			return prev;
		});
	};

	const onRemoveLabel = (label: string) => {
		setSelectedLabels((prev) => prev.filter((l) => l !== label));
	};

	const onClear = () => {
		setSelectedLabels([]);
	};

	return { selectedLabels, onAddLabel, onRemoveLabel, onClear };
}
