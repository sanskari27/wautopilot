'use client';
import { useTemplates } from '@/components/context/templates';
import TemplatePreview from '@/components/elements/template-preview';
import { parseToMaxTime } from '@/lib/utils';
import { Handle, Position, useNodeId } from '@xyflow/react';

const dotStyle = { background: '#555', width: '0.75rem', height: '0.75rem', top: 'auto' };

export default function TemplateNode({
	data: { template_id, delay, reply_to_message },
}: {
	data: {
		template_id: string;
		delay: number;
		reply_to_message: boolean;
	};
}) {
	const nodeId = useNodeId();
	const templates = useTemplates();

	const template = templates.find((t) => t.id === template_id);

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
					Template Message
				</div>
				{delay > 0 ? (
					<div className='p-1 text-center text-sm '>Send after {parseToMaxTime(delay)}</div>
				) : (
					<div className='p-1 text-center text-sm '>Send immediately</div>
				)}
				{reply_to_message && <div className='p-1 text-center text-sm '>Reply to the message</div>}
				<TemplatePreview template={template} />
			</div>
		</>
	);
}
