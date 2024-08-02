import {
	Button,
	FormControl,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NAVIGATION } from '../../../../config/const';
import AgentService from '../../../../services/agent.service';
import PasswordInput from '../../../components/password-input';

const AgentPasswordDialog = () => {
	const toast = useToast();
	const navigate = useNavigate();
	const { id } = useParams();
	const [password, setPassword] = useState('');

	const handleClose = () => {
		navigate(`${NAVIGATION.APP}/${NAVIGATION.AGENT}`);
	};

	const handleSave = () => {
		if (!id || typeof id !== 'string') {
			return navigate(`${NAVIGATION.APP}/${NAVIGATION.AGENT}`);
		}
		if (!password) {
			toast({
				title: 'All fields are required',
				status: 'error',
			});
			return;
		} else if (password.length < 6) {
			toast({
				title: 'Password length should be grater than 6.',
				status: 'error',
			});
		}

		toast.promise(AgentService.updateAgentPassword(id, password), {
			loading: { title: 'Saving...' },
			success: () => {
				handleClose();
				return {
					title: 'Agent password updated.',
				};
			},
			error: (err) => {
				return {
					title: err.message,
				};
			},
		});
	};

	return (
		<Modal isOpen={true} onClose={handleClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{id ? 'Edit' : 'Create'} Agent</ModalHeader>
				<ModalBody>
					<FormControl mb={'1rem'}>
						<PasswordInput
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='*********'
						/>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button colorScheme='red' variant={'outline'} mr={3} onClick={handleClose}>
						Close
					</Button>
					<Button colorScheme={'green'} onClick={handleSave}>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default AgentPasswordDialog;
