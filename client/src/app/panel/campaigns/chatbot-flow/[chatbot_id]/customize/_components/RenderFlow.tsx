'use client';
import { QuickTemplateMessageProps } from '@/app/panel/conversations/_components/message-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { randomString } from '@/lib/utils';
import { Contact } from '@/schema/phonebook';
import {
	Background,
	BackgroundVariant,
	Connection,
	Controls,
	Edge,
	Node,
	OnNodesDelete,
	Panel,
	ReactFlow,
	addEdge,
	useEdgesState,
	useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Info, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { updateNodesAndEdges } from '../../../action';
import {
	AssignLabelNode,
	AudioNode,
	ButtonNode,
	ContactNode,
	DocumentNode,
	EndNode,
	ImageNode,
	ListNode,
	LocationRequestNode,
	StartNode,
	TextNode,
	VideoNode,
	WaFlowNode,
} from '../nodes';
import TemplateNode from '../nodes/TemplateMessageNode';
import CreateNodeDrawer from './CreateNodeDrawer';

export type StartNodeDetails = {
	type: 'START';
};
export type EndNodeDetails = {
	type: 'END';
};
export type TextNodeDetails = {
	type: 'TEXT';
	data: {
		reply_to_message: boolean;
		label: string;
		delay: number;
	};
};
export type ContactNodeDetails = {
	type: 'CONTACT';
	data: {
		reply_to_message: boolean;
		contact: Contact;
		delay: number;
	};
};
export type DocumentNodeDetails = {
	type: 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT';
	data: {
		reply_to_message: boolean;
		id: string;
		caption: string;
		delay: number;
	};
};
export type ButtonNodeDetails = {
	type: 'BUTTON';
	data: {
		reply_to_message: boolean;
		text: string;
		buttons: {
			id: string;
			text: string;
		}[];
		delay: number;
	};
};
export type ListNodeDetails = {
	type: 'LIST';
	data: {
		reply_to_message: boolean;
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
	};
};
export type FlowNodeDetails = {
	type: 'WHATSAPP_FLOW';
	data: {
		reply_to_message: boolean;
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
};
export type LocationRequestNodeDetails = {
	type: 'LOCATION_REQUEST';
	data: {
		reply_to_message: boolean;
		label: string;
		delay: number;
		button: {
			id: string;
		};
	};
};

export type TemplateNodeDetails = {
	type: 'TEMPLATE_MESSAGE';
	data: {
		reply_to_message: boolean;
		delay: number;
	} & QuickTemplateMessageProps;
};

export type AssignLabelDetails = {
	type: 'ASSIGN_LABEL';
	data: {
		labels: string[];
	};
};

const nodeTypes = {
	startNode: StartNode,
	textNode: TextNode,
	imageNode: ImageNode,
	audioNode: AudioNode,
	videoNode: VideoNode,
	documentNode: DocumentNode,
	buttonNode: ButtonNode,
	listNode: ListNode,
	flowNode: WaFlowNode,
	contactNode: ContactNode,
	locationRequestNode: LocationRequestNode,
	templateNode: TemplateNode,
	assignLabelNode: AssignLabelNode,
	endNode: EndNode,
};

export default function RenderFlow({
	id,
	nodes: initialNodes,
	edges: initialEdges,
}: {
	id: string;
	nodes: Node[];
	edges: Edge[];
}) {
	const router = useRouter();
	const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

	const handleAddNode = (
		details:
			| StartNodeDetails
			| TextNodeDetails
			| DocumentNodeDetails
			| ButtonNodeDetails
			| ListNodeDetails
			| FlowNodeDetails
			| ContactNodeDetails
			| LocationRequestNodeDetails
			| TemplateNodeDetails
			| AssignLabelDetails
			| EndNodeDetails
	) => {
		const node: Node = {
			id: randomString(),
			position: { x: 50, y: 50 },
			data: { label: String(nodes.length + 1) } as {
				[key: string]:
					| string
					| string[]
					| { id: string; caption: string; buttons: string[] }
					| { title: string; buttons: string[] }[];
			},
			type: 'input',
		};

		if (details.type === 'START') {
			node.type = 'startNode';
			const startNodeExists = nodes.some((n) => n.type === 'startNode');
			if (startNodeExists) {
				return toast.error('Start node already exists');
			}
		} else if (details.type === 'TEXT') {
			node.type = 'textNode';
			node.data = details.data;
		} else if (details.type === 'IMAGE') {
			node.type = 'imageNode';
			node.data = details.data;
		} else if (details.type === 'AUDIO') {
			node.type = 'audioNode';
			node.data = details.data;
		} else if (details.type === 'VIDEO') {
			node.type = 'videoNode';
			node.data = details.data;
		} else if (details.type === 'DOCUMENT') {
			node.type = 'documentNode';
			node.data = details.data;
		} else if (details.type === 'BUTTON') {
			node.type = 'buttonNode';
			node.data = details.data;
		} else if (details.type === 'LIST') {
			node.type = 'listNode';
			node.data = details.data;
		} else if (details.type === 'WHATSAPP_FLOW') {
			node.type = 'flowNode';
			node.data = details.data;
		} else if (details.type === 'CONTACT') {
			node.type = 'contactNode';
			node.data = details.data;
		} else if (details.type === 'LOCATION_REQUEST') {
			node.type = 'locationRequestNode';
			node.data = details.data;
		} else if (details.type === 'TEMPLATE_MESSAGE') {
			node.type = 'templateNode';
			node.data = details.data;
		} else if (details.type === 'ASSIGN_LABEL') {
			node.type = 'assignLabelNode';
			node.data = details.data;
		} else if (details.type === 'END') {
			node.type = 'endNode';
			const endNodeExists = nodes.some((n) => n.type === 'endNode');
			if (endNodeExists) {
				return toast.error('End node already exists');
			}
		}
		setNodes((prev) => {
			return [...prev, node];
		});
	};

	const onConnect = useCallback(
		(params: Connection) => {
			setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#000' } }, eds));
		},
		[setEdges]
	);

	const onNodesDelete: OnNodesDelete = useCallback(
		(deleted) => {
			const deletedIds = deleted.map((node) => node.id);
			setNodes((prev) => prev.filter((node) => !deletedIds.includes(node.id)));
		},
		[setNodes]
	);

	useEffect(() => {
		setNodes(initialNodes);
		setEdges(initialEdges);
	}, [initialEdges, initialNodes, setEdges, setNodes]);

	const onSave = () => {
		if (!id) return;
		toast.promise(updateNodesAndEdges(id, { nodes, edges }), {
			success: () => {
				router.push(`/panel/campaigns/chatbot-flow`);
				return 'Flow saved successfully';
			},
			error: 'Failed to save flow',
			loading: 'Saving flow...',
		});
	};

	return (
		<div className='flex flex-col gap-4 justify-center p-4 w-full h-full'>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				onConnect={onConnect}
				onNodesChange={onNodesChange}
				onNodesDelete={onNodesDelete}
				onEdgesChange={onEdgesChange}
				connectionLineStyle={{
					strokeDasharray: '5, 5',
					stroke: '#000',
				}}
				snapToGrid={true}
				snapGrid={[20, 20]}
				className='!h-[calc(100vh-60px)]'
			>
				<Panel position='top-left'>
					<div className='bg-white gap-4'>
						<Button size={'icon'} onClick={onSave}>
							<Save className='w-4 h-4' />
						</Button>
					</div>
				</Panel>
				<Panel position='bottom-right'>
					<Label className='pb-4'>
						<Info className='inline-block w-4 h-4 mr-2' />
						To delete elements, select them and press the BACKSPACE key
					</Label>
				</Panel>
				<CreateNodeDrawer addNode={handleAddNode} />
				<Background color='#000' size={1.25} variant={BackgroundVariant.Dots} />
				<Controls />
			</ReactFlow>
		</div>
	);
}
