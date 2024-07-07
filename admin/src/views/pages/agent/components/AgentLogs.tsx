import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useBoolean,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NAVIGATION } from '../../../../config/const';
import AgentService from '../../../../services/agent.service';
import Each from '../../../components/utils/Each';

const AgentLogs = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const [isLoaded, setLoaded] = useBoolean();
	const [logs, setLogs] = useState<
		{
			agent_name: string;
			text: string;
			data: object;
			createdAt: string;
		}[]
	>([]);

	const handleClose = useCallback(() => {
		navigate(`${NAVIGATION.APP}/${NAVIGATION.AGENT}`);
	}, [navigate]);

	useEffect(() => {
		if (!id) {
			handleClose();
			return;
		}
		if (isLoaded) return;
		setLoaded.off();
		AgentService.getAgentLogs(id).then(setLogs).finally(setLoaded.on);
	}, [handleClose, id, isLoaded, setLoaded]);

	return (
		<Modal isOpen={true} onClose={handleClose} size={'6xl'}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Agent Logs</ModalHeader>
				<ModalBody maxH={'70vh'} overflowY={'scroll'}>
					{!isLoaded && (
						<Text textAlign={'center'} fontWeight={'medium'} className='animate-pulse'>
							Loading...
						</Text>
					)}

					<Table variant={'striped'} size='sm'>
						<Thead>
							<Tr>
								<Th width={'12%'} textAlign={'center'}>
									Time
								</Th>
								<Th>Agent</Th>
								<Th>Log</Th>
							</Tr>
						</Thead>
						<Tbody>
							<Each
								items={logs}
								render={(item) => (
									<Tr key={item.createdAt}>
										<Td width={'12%'} textAlign={'center'} verticalAlign={'text-top'}>
											<Text>{item.createdAt.split(' ')[0]}</Text>
											<Text>{item.createdAt.split(' ')[1]}</Text>
										</Td>
										<Td verticalAlign={'text-top'}>{item.agent_name}</Td>
										<Td whiteSpace={'pre-wrap'}>
											<LogText>{item.text}</LogText>
										</Td>
									</Tr>
								)}
							/>
						</Tbody>
					</Table>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme='red' variant={'outline'} mr={3} onClick={handleClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

const LogText = ({ children }: { children: React.ReactNode }) => {
	const [expanded, setExpanded] = useBoolean();

	return (
		<Text
			whiteSpace={'pre-wrap'}
			onClick={setExpanded.toggle}
			cursor={'pointer'}
			overflow={'hidden'}
			textOverflow={'ellipsis'}
			transition={'max-height 0.5s'}
			{...(expanded ? { maxH: 'none' } : { maxH: '2.4rem' })}
		>
			{children}
		</Text>
	);
};

export default AgentLogs;
