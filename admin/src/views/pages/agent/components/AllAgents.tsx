import {
	Checkbox,
	Skeleton,
	Table,
	TableContainer,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import {
	addSelectedAgent,
	clearSelectedAgent,
	removeSelectedAgent,
	selectAll,
} from '../../../../store/reducers/AgentReducer';
import Each from '../../../components/utils/Each';
import CreateAgentDialog, { AgentDialogHandle } from './CreateAgentdialog';

export default function AllAgents() {
	const dispatch = useDispatch();

	const CreateAgentDialogRef = useRef<AgentDialogHandle>(null);

	const {
		list,
		selectedAgent,
		ui: { loading },
	} = useSelector((state: StoreState) => state[StoreNames.AGENT]);

	const toggleAllSelected = (checked: boolean) => {
		if (checked) {
			dispatch(selectAll());
		} else {
			dispatch(clearSelectedAgent());
		}
	};

	return (
		<>
			<TableContainer>
				<Table>
					<Thead>
						<Tr>
							<Th width={'5%'}>
								<Checkbox
									colorScheme='green'
									isChecked={list.length === selectedAgent.length && list.length !== 0}
									isIndeterminate={list.length > selectedAgent.length && selectedAgent.length !== 0}
									onChange={(e) => {
										toggleAllSelected(e.target.checked);
									}}
								/>{' '}
								S.No.
							</Th>
							<Th width={'40%'}>Name</Th>
							<Th width={'40%'}>Phone</Th>
							<Th>Actions</Th>
						</Tr>
					</Thead>
					<Tbody>
						{loading ? (
							<Tr>
								<Td colSpan={6}>
									<Skeleton height={'50px'} width={'100%'} />
								</Td>
							</Tr>
						) : (
							<Each
								items={list}
								render={(agent, index) => (
									<Tr key={index}>
										<Td>
											<Checkbox
												colorScheme='green'
												mr={2}
												isChecked={selectedAgent.includes(agent.id)}
												onChange={(e) => {
													if (e.target.checked) {
														dispatch(addSelectedAgent(agent.id));
													} else {
														dispatch(removeSelectedAgent(agent.id));
													}
												}}
											/>
											{index + 1}
										</Td>
										<Td>{agent.name}</Td>
										<Td>{agent.phone}</Td>
										<Td></Td>
									</Tr>
								)}
							/>
						)}
					</Tbody>
				</Table>
			</TableContainer>
			<CreateAgentDialog ref={CreateAgentDialogRef} />
		</>
	);
}
