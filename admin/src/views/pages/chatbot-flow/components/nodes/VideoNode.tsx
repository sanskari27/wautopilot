import { AbsoluteCenter, Box, Divider } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Handle, Position } from 'reactflow';
import { SERVER_URL } from '../../../../../config/const';
import { StoreNames, StoreState } from '../../../../../store';
import Each from '../../../../components/utils/Each';
import Preview from '../../../media/preview.component';

const dotStyle = { background: '#555', width: '0.75rem', height: '0.75rem', top: 'auto' };

export default function VideoNode({
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
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	function RenderButtons() {
		return (
			<Each
				items={buttons}
				render={(button) => (
					<>
						<Box
							bgColor={'gray.50'}
							my={'0.25rem'}
							py={'0.25rem'}
							px={'0.5rem'}
							rounded={'lg'}
							position={'relative'}
							border={'1px solid gray'}
						>
							{button.text}
						</Box>
					</>
				)}
			/>
		);
	}
	function RenderButtonHandles() {
		return (
			<Each
				items={buttons}
				render={(button, index) => (
					<Handle
						type='source'
						position={Position.Right}
						id={button.id}
						style={{ ...dotStyle, bottom: 20 + index * 40 }}
						isConnectable
					/>
				)}
			/>
		);
	}

	return (
		<>
			<Handle
				type='target'
				position={Position.Left}
				style={{ ...dotStyle, top: 80 }}
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
					bgColor={'purple.400'}
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
					Video Message
				</Box>
				<Box padding={'0.5rem'}>
					<Box
						border={'1px solid black'}
						rounded={'lg'}
						padding={'0.5rem'}
						maxH={'400px'}
						maxWidth={'400px'}
					>
						<Preview
							data={{
								type: 'video',
								url: `${SERVER_URL}${selected_device_id}/media/${id}/download`,
							}}
							progress={-1}
						/>
					</Box>
					<Box
						border={'1px solid black'}
						rounded={'lg'}
						padding={'0.5rem'}
						mt={'0.5rem'}
						hidden={!caption}
					>
						{caption}
					</Box>
					<Box position={'relative'} my={'1rem'} hidden={buttons.length === 0}>
						<Divider />
						<AbsoluteCenter py='1' px={'4'} bgColor={'whitesmoke'} color='gray.600'>
							Reply Back Buttons
						</AbsoluteCenter>
					</Box>
					<RenderButtons />
				</Box>
			</Box>

			<RenderButtonHandles />
		</>
	);
}
