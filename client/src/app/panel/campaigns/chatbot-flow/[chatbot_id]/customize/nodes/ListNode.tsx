'use client';
import Each from '@/components/containers/each';
import AbsoluteCenter from '@/components/ui/absolute-center';
import { parseToMaxTime } from '@/lib/utils';
import { Handle, Position, useNodeId } from '@xyflow/react';

const dotStyle = { background: '#555', width: '0.75rem', height: '0.75rem', top: 'auto' };

export default function ListNode({
	data: { body, footer, header, sections, delay, reply_to_message },
}: {
	data: {
		header: string;
		body: string;
		footer: string;
		sections: {
			title: string;
			buttons: {
				id: string;
				text: string;
			}[];
		}[];
		delay: number;
		reply_to_message: boolean;
	};
}) {
	const nodeId = useNodeId();

	function RenderButtons({
		buttons,
	}: {
		sectionIndex: number;
		buttons: {
			id: string;
			text: string;
		}[];
	}) {
		return (
			<>
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
			</>
		);
	}

	function RenderSections() {
		return (
			<Each
				items={sections}
				render={(section, sectionIndex) => (
					<>
						<AbsoluteCenter>Section : {section.title}</AbsoluteCenter>

						<RenderButtons sectionIndex={sectionIndex} buttons={section.buttons} />
					</>
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
				<div className='bg-gray-400 text-center text-white rounded-t-2xl h-12 flex justify-center items-center font-medium text-lg'>
					List Message
				</div>
				{delay > 0 ? (
					<div className='p-1 text-center text-sm '>Send after {parseToMaxTime(delay)}</div>
				) : (
					<div className='p-1 text-center text-sm '>Send immediately</div>
				)}
				{reply_to_message && <div className='p-1 text-center text-sm '>Reply to the message</div>}
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
					<AbsoluteCenter>Reply Back Buttons</AbsoluteCenter>
					<RenderSections />
				</div>
			</div>
		</>
	);
}
