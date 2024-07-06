import { Box } from '@chakra-ui/react';
import { Handle, Position } from 'reactflow';

const dotStyle = { background: '#555', width: '0.75rem', height: '0.75rem' };

export default function StartNode() {
	return (
		<>
			<Handle
				type='source'
				position={Position.Right}
				id={'source'}
				style={dotStyle}
				isConnectable
			/>
			<Box
				rounded={'full'}
				bgColor={'whitesmoke'}
				minWidth={'200px'}
				minHeight={'min-content'}
				shadow={'2xl'}
				dropShadow={'2xl'}
			>
				<Box
					bgColor={'green.400'}
					textAlign={'center'}
					color={'white'}
					rounded={'full'}
					height={'50px'}
					display={'flex'}
					justifyContent={'center'}
					alignItems={'center'}
					fontWeight={'medium'}
					fontSize={'1.25rem'}
				>
					Start
				</Box>
			</Box>
		</>
	);
}
