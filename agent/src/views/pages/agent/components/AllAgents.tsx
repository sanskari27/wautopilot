import { Skeleton, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import Each from '../../../components/utils/Each';

export default function AllAgents() {
	const {
		list,
		ui: { loading },
	} = useSelector((state: StoreState) => state[StoreNames.AGENT]);

	return (
		<>
			<TableContainer border={'1px dashed gray'} rounded={'2xl'}>
				<Table variant='striped' colorScheme='gray'>
					<Thead>
						<Tr>
							<Th width={'5%'}>S.No.</Th>
							<Th width={'30%'}>Name</Th>
							<Th width={'25%'}>Phone</Th>
							<Th width={'40%'}>Email</Th>
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
										<Td>{index + 1}.</Td>
										<Td>{agent.name}</Td>
										<Td>+{agent.phone}</Td>
										<Td>{agent.email}</Td>
									</Tr>
								)}
							/>
						)}
					</Tbody>
				</Table>
			</TableContainer>
		</>
	);
}
