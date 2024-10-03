'use client';
import { parseToMaxTime } from '@/lib/utils';
import { Handle, Position, useNodeId } from '@xyflow/react';

const dotStyle = { background: '#555', top: 80, width: '0.75rem', height: '0.75rem' };

export default function TextNode({
	data: { label, delay, reply_to_message },
}: {
	data: { label: string; delay: number; reply_to_message: boolean };
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
				<div className='bg-red-400 text-center text-white rounded-t-2xl h-12 flex justify-center items-center font-medium text-lg'>
					Text Message
				</div>
				{delay > 0 ? (
					<div className='p-1 text-center text-sm '>Send after {parseToMaxTime(delay)}</div>
				) : (
					<div className='p-1 text-center text-sm '>Send immediately</div>
				)}
				{reply_to_message && <div className='p-1 text-center text-sm '>Reply to message</div>}
				<div className='p-2'>
					<div className='rounded-lg border border-black p-2 max-h-[400px] max-w-[400px]'>
						{label}
					</div>
				</div>
			</div>
		</>
	);
}
