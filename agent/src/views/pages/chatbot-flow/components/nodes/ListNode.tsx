import { AbsoluteCenter, Box, Divider } from '@chakra-ui/react';
import { Handle, Position } from 'reactflow';
import Each from '../../../../components/utils/Each';

const dotStyle = { background: '#555', width: '0.75rem', height: '0.75rem', top: 'auto' };

export default function ListNode({
	data: { body, footer, header, sections },
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
	};
}) {
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
			</>
		);
	}

	function RenderSections() {
		return (
			<Each
				items={sections}
				render={(section, sectionIndex) => (
					<>
						<Box position={'relative'} my={'2rem'}>
							<Divider />
							<AbsoluteCenter py='1' px={'4'} color='gray.600' bg={'whitesmoke'}>
								Section : {section.title}
							</AbsoluteCenter>
						</Box>

						<RenderButtons sectionIndex={sectionIndex} buttons={section.buttons} />
					</>
				)}
			/>
		);
	}

	function RenderButtonHandles() {
		return (
			<Each
				items={sections}
				render={({ buttons }, sectionIndex) => {
					let distanceFromBottom = 0;
					for (let i = sectionIndex + 1; i < sections.length; i++) {
						distanceFromBottom += sections[i].buttons.length * 40 + 55;
					}
					return (
						<Each
							items={buttons}
							render={(button, index) => (
								<Handle
									type='source'
									position={Position.Right}
									id={button.id}
									// style={{ ...dotStyle, bottom: 20 + index * 40 + distanceFromBottom }}
									style={{
										...dotStyle,
										bottom: -20 + (buttons.length - index) * 40 + distanceFromBottom,
									}}
									isConnectable
								/>
							)}
						/>
					);
				}}
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
					bgColor={'gray.400'}
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
					List Message
				</Box>
				<Box padding={'0.5rem'}>
					<Box rounded={'lg'} border={'1px solid black'} padding={'0.5rem'}>
						<Box fontWeight={'medium'} hidden={!header}>
							{header}
						</Box>
						<Box hidden={!body}>{body}</Box>
						<Box fontSize={'0.75rem'} hidden={!footer}>
							{footer}
						</Box>
					</Box>
					<Box position={'relative'} my={'1rem'} hidden={sections.length === 0}>
						<Divider />
						<AbsoluteCenter py='1' px={'4'} bgColor={'whitesmoke'} color='gray.600'>
							Reply Back Buttons
						</AbsoluteCenter>
					</Box>
					<RenderSections />
				</Box>
			</Box>

			<RenderButtonHandles />
		</>
	);
}
