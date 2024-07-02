import { Box } from '@chakra-ui/react';
import { Handle, Position } from 'reactflow';

const dotStyle = { background: '#555', top: 80, width: '0.5rem', height: '0.5rem' };

export default function TextNode({ data: { label } }: { data: { label: string } }) {
	return (
		<>
			<Handle
				type='target'
				position={Position.Left}
				style={dotStyle}
				onConnect={(params) => console.log('handle onConnect', params)}
				isConnectable
			/>
			<Box
				rounded={'2xl'}
				bgColor={'whitesmoke'}
				minWidth={'400px'}
				minHeight={'min-content'}
				shadow={'2xl'}
				dropShadow={'2xl'}
			>
				<Box
					bgColor={'red.400'}
					textAlign={'center'}
					color={'white'}
					roundedTop={'2xl'}
					height={'50px'}
					display={'flex'}
					justifyContent={'center'}
					alignItems={'center'}
					fontWeight={'medium'}
					fontSize={'1.25rem'}
				>
					Text Message
				</Box>
				<Box padding={'0.5rem'}>
					<Box border={'1px solid black'} rounded={'lg'} padding={'0.5rem'}>
						{label}
					</Box>
				</Box>
			</Box>
		</>
	);
}
