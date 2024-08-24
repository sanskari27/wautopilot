'use client';
import { Handle, Position, useNodeId } from '@xyflow/react';

const dotStyle = { background: '#555', top: 80, width: '0.75rem', height: '0.75rem' };

export default function TextNode({ data: { label } }: { data: { label: string } }) {
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
				<div className='p-2'>
					<div className='rounded-lg border border-black p-2 max-h-[400px] max-w-[400px]'>
						{label}
					</div>
				</div>
			</div>
		</>
	);
}
