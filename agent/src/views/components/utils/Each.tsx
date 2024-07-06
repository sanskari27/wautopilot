import React from 'react';

export default function Each<T>({
	items,
	render,
	id,
}: {
	items: T[];
	render: (element: T, index: number) => React.ReactElement;
	id?: keyof T extends string ? keyof T : never;
}): React.ReactElement {
	return (
		<React.Fragment>
			{items.map((item, index) => (
				<React.Fragment key={id ? (item[id] as string) : index}>
					{render(item, index)}
				</React.Fragment>
			))}
		</React.Fragment>
	);
}
