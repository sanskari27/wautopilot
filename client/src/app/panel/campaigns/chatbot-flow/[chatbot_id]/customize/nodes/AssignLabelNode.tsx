'use client';
import Each from '@/components/containers/each';
import { Badge } from '@/components/ui/badge';
import { Handle, Position, useNodeId } from '@xyflow/react';

const dotStyle = { background: '#555', top: 80, width: '0.75rem', height: '0.75rem' };

export default function TextNode({ data: { labels } }: { data: { labels: string[] } }) {
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
				<div className='bg-cyan-400 text-center text-white rounded-t-2xl h-12 flex justify-center items-center font-medium text-lg'>
					Assign Labels
				</div>
				<div className='p-2'>
					<div className='flex flex-wrap gap-2 border-dashed border-2 rounded-lg p-2 flex-1 min-h-11 max-w-[400px]'>
						<Each items={labels} render={(label) => <Badge className=''>{label}</Badge>} />
					</div>
				</div>
			</div>
		</>
	);
}
