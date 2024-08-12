'use client';
import { Handle, Position } from '@xyflow/react';

const dotStyle = { background: '#555', width: '0.75rem', height: '0.75rem' };

export default function StartNode() {
	return (
		<>
			<Handle
				type='source'
				position={Position.Right}
				id={'source'}
				style={dotStyle}
				isConnectable
			/>
			<div className='rounded-full bg-gray-100 min-w-200 min-h-min-content shadow-2xl drop-shadow-2xl'>
				<div className='bg-primary text-center text-white rounded-full h-12 flex justify-center items-center font-medium text-lg'>
					Start
				</div>
			</div>
		</>
	);
}
