'use client';
import Each from '@/components/containers/each';
import PreviewFile from '@/components/elements/preview-file';
import AbsoluteCenter from '@/components/ui/absolute-center';
import { SERVER_URL } from '@/lib/consts';
import { Handle, Position, useNodeId } from '@xyflow/react';

const dotStyle = { background: '#555', width: '0.75rem', height: '0.75rem', top: 'auto' };

export default function ImageNode({
	data: { id, caption, buttons },
}: {
	data: {
		id: string;
		caption: string;
		buttons: {
			id: string;
			text: string;
		}[];
	};
}) {
	const nodeId = useNodeId();
	function RenderButtons() {
		return (
			<Each
				items={buttons}
				render={(button) => (
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
				)}
			/>
		);
	}

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
				<div className='bg-blue-400 text-center text-white rounded-t-2xl h-12 flex justify-center items-center font-medium text-lg'>
					Image Message
				</div>
				<div className='p-2'>
					<div className='rounded-lg border border-black p-2 max-h-[400px] max-w-[400px]'>
						<PreviewFile
							data={{
								type: 'image',
								url: `${SERVER_URL}media/${id}/download`,
							}}
							progress={-1}
						/>
					</div>
					<div className='rounded-lg border border-black p-2 mt-2' hidden={!caption}>
						{caption}
					</div>
					<AbsoluteCenter>Reply Back Buttons</AbsoluteCenter>
					<RenderButtons />
				</div>
			</div>

			{/* <RenderButtonHandles /> */}
		</>
	);
}
