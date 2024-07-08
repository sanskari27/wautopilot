import { AddIcon } from '@chakra-ui/icons';
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Avatar,
	Box,
	Button,
	Input,
	Tag,
	TagLabel,
	Text,
	Textarea,
	Wrap,
	WrapItem,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import AgentService from '../../../../services/agent.service';
import { StoreNames, StoreState } from '../../../../store';
import Each from '../../../components/utils/Each';

export default function AssignTask() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef(null);
	const toast = useToast();
	const [selectedAgent, setSelectedAgent] = useState('me');
	const [text, setText] = useState('');
	const [due_date, setDueDate] = useState(new Date().toISOString());

	const { list: agents } = useSelector((state: StoreState) => state[StoreNames.AGENT]);

	const handleSave = () => {
		toast.promise(
			AgentService.assignTask(text, due_date, selectedAgent !== 'me' ? selectedAgent : undefined),
			{
				loading: { title: 'Assigning Task' },
				success: () => {
					onClose();
					return { title: 'Task Assigned Successfully' };
				},
				error: { title: 'Failed to Assign Task' },
			}
		);
	};

	return (
		<>
			<Button
				variant='outline'
				size={'sm'}
				colorScheme='green'
				leftIcon={<AddIcon />}
				onClick={onOpen}
			>
				Assign Task
			</Button>

			<AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} size={'3xl'}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							Assign Task
						</AlertDialogHeader>

						<AlertDialogBody>
							<Box>
								<Wrap spacing='1rem'>
									<Each
										items={agents}
										render={(item) => (
											<WrapItem>
												<Tag
													size='lg'
													borderRadius='full'
													cursor={'pointer'}
													bgColor={selectedAgent === item.id ? 'green.500' : 'gray.300'}
													color={selectedAgent === item.id ? 'white' : 'black'}
													onClick={() => setSelectedAgent(item.id)}
												>
													<Avatar size='xs' name={item.name} ml={-1} mr={2} />
													<TagLabel>{item.name}</TagLabel>
												</Tag>
											</WrapItem>
										)}
									/>
								</Wrap>
							</Box>
							<Box width={'full'} mt={'1rem'}>
								<Text>Due Date</Text>
								<Input
									placeholder='Due Date'
									size='md'
									type='datetime-local'
									value={due_date}
									onChange={(e) => setDueDate(e.target.value)}
								/>
								<Textarea
									width={'full'}
									minHeight={'300px'}
									size={'sm'}
									mt={'1rem'}
									rounded={'md'}
									placeholder={
										'Write a message to the agent. You can also add instructions, links, or any other information here.'
									}
									// border={'none'}
									_placeholder={{
										opacity: 0.4,
										color: 'inherit',
									}}
									_focus={{ border: 'none', outline: 'none' }}
									value={text}
									onChange={(e) => setText(e.target.value)}
									resize={'vertical'}
								/>
							</Box>
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button colorScheme='green' variant='solid' width='full' onClick={handleSave}>
								Save
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
}
