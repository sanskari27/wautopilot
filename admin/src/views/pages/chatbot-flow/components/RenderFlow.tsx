import { Flex, IconButton } from '@chakra-ui/react';
import { useCallback } from 'react';
import { BiSave } from 'react-icons/bi';
import ReactFlow, {
	Background,
	BackgroundVariant,
	Connection,
	Controls,
	Panel,
	addEdge,
	useEdgesState,
	useNodesState,
} from 'reactflow';
import CreateFlowComponent from './CreateFlowComponent';
import AudioNode from './nodes/AudioNode';
import ButtonNode from './nodes/ButtonNode';
import DocumentNode from './nodes/DocumentNode';
import ImageNode from './nodes/ImageNode';
import TextNode from './nodes/TextNode';
import VideoNode from './nodes/VideoNode';

// const initialNodes = [
// 	{ id: '1', position: { x: 330, y: 330 }, data: { label: '1' } },
// 	{ id: '2', position: { x: 330, y: 100 }, data: { label: '2' } },
// ];
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export type TextNodeDetails = {
	type: 'TEXT';
	data: string;
};
export type DocumentNodeDetails = {
	type: 'IMAGE' | 'AUDIO' | 'VIDEO' | 'DOCUMENT';
	data: {
		id: string;
		caption: string;
		buttons: string[];
	};
};
export type ButtonNodeDetails = {
	type: 'BUTTON';
	data: {
		text: string;
		buttons: string[];
	};
};

const nodeTypes = {
	textNode: TextNode,
	imageNode: ImageNode,
	audioNode: AudioNode,
	videoNode: VideoNode,
	documentNode: DocumentNode,
	buttonNode: ButtonNode,
};

export default function RenderFlow() {
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);

	const handleAddNode = (details: TextNodeDetails | DocumentNodeDetails | ButtonNodeDetails) => {
		const node = {
			id: String(nodes.length + 1),
			position: { x: 0, y: 0 },
			data: { label: String(nodes.length + 1) } as {
				[key: string]: string | string[];
			},
			type: 'input',
		};

		if (details.type === 'TEXT') {
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

	const onSave = () => {};

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
				onEdgesChange={onEdgesChange}
				connectionLineStyle={{
					strokeDasharray: '5, 5',
					stroke: '#000',
				}}
				snapToGrid={true}
				snapGrid={[20, 20]}
			>
				<Panel position='top-left'>
					<IconButton
						aria-label='Save Flow'
						icon={<BiSave />}
						colorScheme='green'
						onClick={onSave}
						cursor={'pointer'}
						fontSize={'1.25rem'}
					/>
				</Panel>
				<CreateFlowComponent addNode={handleAddNode} />
				<Background color='#000' size={1.25} variant={BackgroundVariant.Dots} />
				<Controls />
			</ReactFlow>
		</Flex>
	);
}
