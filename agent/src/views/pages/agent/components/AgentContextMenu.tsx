import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList, useToast } from '@chakra-ui/react';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AGENT_URL, NAVIGATION } from '../../../../config/const';
import AgentService from '../../../../services/agent.service';
import AuthService from '../../../../services/auth.service';
import { removeAgent } from '../../../../store/reducers/AgentReducer';
import { Agent } from '../../../../store/types/Agent';
import DeleteAlert, { DeleteAlertHandle } from '../../../components/delete-alert';

export default function AgentContextMenu({ agent }: { agent: Agent }) {
	const navigate = useNavigate();
	const toast = useToast();
	const dispatch = useDispatch();

	const deleteAlertRef = useRef<DeleteAlertHandle>(null);

	const handleEditAgent = () => {
		navigate(`${NAVIGATION.APP}/${NAVIGATION.AGENT}/${agent.id}`);
	};

	const openServiceAccount = async (id: string) => {
		const status = await AuthService.serviceAccount(id);
		if (status) {
			window.location.href = AGENT_URL;
		} else {
			toast({
				title: 'Unable to switch account.',
				description: 'Please try again later.',
				status: 'error',
			});
		}
	};

	const handleDeleteAgent = (id: string) => {
		const promise = AgentService.deleteAgent(id);

		toast.promise(promise, {
			loading: { title: 'Deleting...' },
			success: () => {
				dispatch(removeAgent(id));
				return { title: 'Agent deleted successfully' };
			},
			error: { title: 'Failed to delete agent' },
		});
	};
	return (
		<>
			<Menu>
				<MenuButton as={Button} rightIcon={<ChevronDownIcon />} size='sm'>
					Actions
				</MenuButton>
				<MenuList>
					<MenuItem onClick={() => handleEditAgent()}>Edit</MenuItem>
					<MenuItem onClick={() => deleteAlertRef.current?.open(agent.id)}>Delete</MenuItem>
					<MenuItem onClick={() => openServiceAccount(agent.id)}>Service account</MenuItem>
				</MenuList>
			</Menu>
			<DeleteAlert type={'Agent'} ref={deleteAlertRef} onConfirm={handleDeleteAgent} />
		</>
	);
}