'use client';
import { parseToMaxTime } from '@/lib/utils';
import { Contact } from '@/schema/phonebook';
import { Handle, Position, useNodeId } from '@xyflow/react';

const dotStyle = { background: '#555', width: '0.75rem', height: '0.75rem', top: 'auto' };

export default function ContactNode({
	data: { contact, delay },
}: {
	data: {
		contact: Contact;
		delay: number;
	};
}) {
	const nodeId = useNodeId();

	return (
		<>
			<Handle
				type='target'
				position={Position.Left}
				style={{ ...dotStyle, top: 25 }}
				isConnectable
			/>
			<Handle
				type='source'
				id={nodeId!}
				position={Position.Right}
				style={{ ...dotStyle, top: 25 }}
				isConnectable
			/>
			<div className='rounded-2xl bg-gray-200 min-w-[400px] min-h-min-content shadow-2xl drop-shadow-2xl'>
				<div className='bg-lime-400 text-white rounded-t-2xl h-12 flex justify-center items-center font-medium text-lg'>
					Contact Message
				</div>
				{delay > 0 ? (
					<div className='p-1 text-center text-sm '>Send after {parseToMaxTime(delay)}</div>
				) : (
					<div className='p-1 text-center text-sm '>Send immediately</div>
				)}
				<div className='p-2'>
					<div className='p-2 rounded-lg border border-black'>{contact.name.formatted_name}</div>
				</div>
			</div>
		</>
	);
}
