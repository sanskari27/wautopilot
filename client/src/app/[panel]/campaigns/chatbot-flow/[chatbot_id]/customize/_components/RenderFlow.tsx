'use client';
import { Button } from '@/components/ui/button';
import { randomString } from '@/lib/utils';
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
import { Save } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { updateNodesAndEdges } from '../../../action';
import {
	AudioNode,
	ButtonNode,
	DocumentNode,
	ImageNode,
	ListNode,
	StartNode,
	TextNode,
	VideoNode,
	WaFlowNode,
} from '../nodes';
import CreateNodeDrawer from './CreateNodeDrawer';

export type StartNodeDetails = {
	type: 'START';
};
export type TextNodeDetails = {
	type: 'TEXT';
	data: string;
};
export type DocumentNodeDetails = {
	type: 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT';
	data: {
		id: string;
		caption: string;
		buttons: {
			id: string;
			text: string;
		}[];
	};
};
export type ButtonNodeDetails = {
	type: 'BUTTON';
	data: {
		text: string;
		buttons: {
			id: string;
			text: string;
		}[];
	};
};
export type ListNodeDetails = {
	type: 'LIST';
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
	};
};
export type FlowNodeDetails = {
	type: 'WHATSAPP_FLOW';
	data: {
		header: string;
		body: string;
		footer: string;
		flow_id: string;
		button_text: string;
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
	const params = useParams();
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
			node.data = { label: details.data };
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
				router.push(`/${params.panel}/campaigns/chatbot-flow`);
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
				<CreateNodeDrawer addNode={handleAddNode} />
				<Background color='#000' size={1.25} variant={BackgroundVariant.Dots} />
				<Controls />
			</ReactFlow>
		</div>
	);
}
