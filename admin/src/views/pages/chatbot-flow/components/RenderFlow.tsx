import { Flex, IconButton, useToast } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { BiSave } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ReactFlow, {
	Background,
	BackgroundVariant,
	Connection,
	Controls,
	Node,
	OnNodesDelete,
	Panel,
	addEdge,
	useEdgesState,
	useNodesState,
} from 'reactflow';
import { NAVIGATION } from '../../../../config/const';
import ChatbotFlowService from '../../../../services/chatbot-flow.service';
import { StoreNames, StoreState } from '../../../../store';
import { randomString } from '../../../../utils/templateHelper';
import CreateFlowComponent from './CreateFlowComponent';
import AudioNode from './nodes/AudioNode';
import ButtonNode from './nodes/ButtonNode';
import DocumentNode from './nodes/DocumentNode';
import ImageNode from './nodes/ImageNode';
import ListNode from './nodes/ListNode';
import StartNode from './nodes/StartNode';
import TextNode from './nodes/TextNode';
import VideoNode from './nodes/VideoNode';

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

const nodeTypes = {
	startNode: StartNode,
	textNode: TextNode,
	imageNode: ImageNode,
	audioNode: AudioNode,
	videoNode: VideoNode,
	documentNode: DocumentNode,
	buttonNode: ButtonNode,
	listNode: ListNode,
};

export default function RenderFlow() {
	const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const { id } = useParams();
	const navigate = useNavigate();
	const toast = useToast();
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const handleAddNode = (
		details:
			| StartNodeDetails
			| TextNodeDetails
			| DocumentNodeDetails
			| ButtonNodeDetails
			| ListNodeDetails
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
				return toast({
					title: 'Start flow already exists.',
					status: 'warning',
				});
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
		if (!id) return;
		toast.promise(ChatbotFlowService.getNodesAndEdges(selected_device_id, id), {
			success: ({ nodes, edges }) => {
				setNodes(nodes);
				setEdges(edges);
				return {
					title: 'Flow loaded successfully',
				};
			},
			error: {
				title: 'Failed to load flow',
			},
			loading: {
				title: 'Loading flow',
				description: 'Please wait',
			},
		});
	}, [id, selected_device_id, setEdges, setNodes, toast]);

	const onSave = () => {
		if (!id) return;
		toast.promise(
			ChatbotFlowService.updateNodesAndEdges(selected_device_id, id, { nodes, edges }),
			{
				success: () => {
					navigate(`${NAVIGATION.APP}/${NAVIGATION.CHATBOT_FLOW}`);
					return {
						title: 'Flow saved successfully',
					};
				},
				error: {
					title: 'Failed to save flow',
				},
				loading: {
					title: 'Saving flow',
					description: 'Please wait',
				},
			}
		);
	};

	return (
		<Flex
			direction={'column'}
			gap={'1rem'}
			className='custom-scrollbar'
			justifyContent={'center'}
			p={'1rem'}
			width={'100%'}
			height={'100%'}
		>
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
			>
				<Panel position='top-left'>
					<Flex bgColor={'white'} gap={'1rem'}>
						<IconButton
							aria-label='Save Flow'
							icon={<BiSave />}
							colorScheme='green'
							onClick={onSave}
							cursor={'pointer'}
							fontSize={'1.25rem'}
						/>
					</Flex>
				</Panel>
				<CreateFlowComponent addNode={handleAddNode} />
				<Background color='#000' size={1.25} variant={BackgroundVariant.Dots} />
				<Controls />
			</ReactFlow>
		</Flex>
	);
}
