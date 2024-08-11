import React from 'react';

export default function Each<T>({
	items,
	render,
	id,
}: {
	items: T[];
	render: (element: T, index: number) => React.ReactElement;
	id?: (data: T, index: number) => string;
}): React.ReactElement {
	return (
		<React.Fragment>
			{items.map((item, index) => (
				<React.Fragment key={id?.(item, index) || index}>{render(item, index)}</React.Fragment>
			))}
		</React.Fragment>
	);
}
