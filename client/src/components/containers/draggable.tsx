'use client';

import * as React from 'react';

const DroppableContainer = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		onDrop: (data: unknown) => void;
	}
>(({ className, onDrop, ...props }, ref) => {
	return (
		<div
			ref={ref}
			className={className}
			onDragOver={(e) => e.preventDefault()}
			onDrop={(e) => {
				e.preventDefault();
				const data = e.dataTransfer.getData('shared-data');
				try {
					onDrop(JSON.parse(data));
				} catch (e) {}
			}}
			{...props}
		/>
	);
});

DroppableContainer.displayName = 'DroppableContainer';

const DraggableContainer = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		draggableData: unknown;
		onDraggingStart?: () => void;
		onDraggingEnd?: () => void;
	}
>(({ className, draggableData, onDraggingStart,onDraggingEnd, ...props }, ref) => (
	<div
		ref={ref}
		className={className}
		draggable
		onDragStart={(e) => {
			e.dataTransfer.setData('shared-data', JSON.stringify(draggableData));
			onDraggingStart?.(); //TODO
		}}
		onDragEnd={()=>onDraggingEnd?.()}
		{...props}
	/>
));

DraggableContainer.displayName = 'DraggableContainer';

export { DraggableContainer, DroppableContainer };
