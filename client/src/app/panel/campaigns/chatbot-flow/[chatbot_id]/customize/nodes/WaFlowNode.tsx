'use client';
import { useWhatsappFlows } from '@/components/context/whatsappFlows';
import { parseToMaxTime } from '@/lib/utils';
import { Handle, Position, useNodeId } from '@xyflow/react';

const dotStyle = { background: '#555', width: '0.75rem', height: '0.75rem', top: 'auto' };

export default function WaFlowNode({
	data: { body, footer, header, button, flow_id, delay },
}: {
	data: {
		header: string;
		body: string;
		footer: string;
		flow_id: string;
		button: {
			id: string;
			text: string;
		};
		delay: number;
	};
}) {
	const nodeId = useNodeId();
	const flows = useWhatsappFlows();
	const flow_name = flows.find((f) => f.id === flow_id)?.name;

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
				<div className='bg-gray-400 text-center text-white rounded-t-2xl h-12 flex justify-center items-center font-medium text-lg'>
					Whatsapp Flow Message
				</div>
				{delay > 0 ? (
					<div className='p-1 text-center text-sm '>Send after {parseToMaxTime(delay)}</div>
				) : (
					<div className='p-1 text-center text-sm '>Send immediately</div>
				)}
				<div className='p-2'>
					<div className='rounded-lg border border-black p-2 max-h-[400px] max-w-[400px]'>
						<div className='font-medium' hidden={!header}>
							{header}
						</div>
						<div hidden={!body}>{body}</div>
						<div className='text-xs' hidden={!footer}>
							{footer}
						</div>
					</div>

					<div className='flex justify-center mt-2'>{flow_name}</div>
					<div className='relative'>
						<div className='bg-gray-50 my-1 rounded-lg border border-gray-400 p-2 relative'>
							{button.text}
						</div>
						<Handle
							type='source'
							position={Position.Right}
							id={button.id}
							style={{ ...dotStyle, right: -8, top: '50%' }}
							isConnectable
						/>
					</div>
				</div>
			</div>
		</>
	);
}
