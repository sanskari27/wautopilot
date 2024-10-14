import { useAgents } from '@/components/context/agents';
import ComboboxMultiselect from '@/components/ui/combobox-multiselect';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React, { useRef } from 'react';

export default function AgentFilter({
	children,
	selected,
	onConfirm,
}: {
	children: React.ReactNode;
	selected: string[];
	onConfirm: (labels: string[]) => void;
}) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const {list:agents} = useAgents();

	const onClose = () => {
		buttonRef.current?.click();
	};

	return (
		<Popover
			onOpenChange={(open) => {
				if (!open) {
					onClose();
				}
			}}
		>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent className='p-0'>
				<ComboboxMultiselect
					items={agents.map((tag) => {
						return {
							value: tag.name,
							label: tag.name,
						};
					})}
					onChange={onConfirm}
					value={selected}
					placeholder='Select Agent'
				/>
			</PopoverContent>
		</Popover>
	);
}
