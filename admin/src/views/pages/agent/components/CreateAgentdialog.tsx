import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AgentService from '../../../../services/agent.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	setAgentDetails,
	setAgentEmail,
	setAgentName,
	setAgentPassword,
	setAgentPhone,
} from '../../../../store/reducers/AgentReducer';
import PasswordInput from '../../../components/password-input';

export type AgentDialogHandle = {
	open: (agent?: { id: string; name: string; email: string; phone: string }) => void;
};

const CreateAgentDialog = forwardRef<AgentDialogHandle>((_, ref) => {
	const dispatch = useDispatch();
	const toast = useToast();

	const {
		details: { email, id, name, phone, password },
	} = useSelector((state: StoreState) => state[StoreNames.AGENT]);

	const [isOpen, setIsOpen] = useState(false);

	useImperativeHandle(ref, () => ({
		open: (agent?: { id: string; name: string; email: string; phone: string }) => {
			if (agent) {
				dispatch(setAgentDetails(agent));
			}
			setIsOpen(true);
		},
	}));

	const handleClose = () => {
		setIsOpen(false);
		dispatch(setAgentDetails({ id: '', name: '', email: '', phone: '', password: '' }));
	};

	const handleSave = () => {
		if (!name || !email || !phone || !password) {
			toast({
				title: 'All fields are required',
				status: 'error',
			});
			return;
		}
		if (password.length < 6) {
			toast({
				title: 'Password must be at least 6 characters',
				status: 'error',
			});
			return;
		}
		let promise;
		if (id) {
			promise = AgentService.updateAgent({ id, name, email, phone, password });
		} else {
			promise = AgentService.createAgent({ name, email, phone, password });
		}

		toast.promise(promise, {
			loading: { title: 'Saving...' },
			success: (data) => {
				dispatch(setAgentDetails(data));
				handleClose();
				return {
					title: 'Agent saved successfully',
				};
			},
			error: { title: 'Error saving agent' },
		});
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Create Agent</ModalHeader>
				<ModalBody>
					<FormControl mb={'1rem'}>
						<FormLabel m={0}>Name</FormLabel>
						<Input
							value={name}
							placeholder={'eg. John Doe'}
							onChange={(e) => dispatch(setAgentName(e.target.value))}
						/>
					</FormControl>
					<FormControl mb={'1rem'}>
						<FormLabel m={0}>Email</FormLabel>
						<Input
							value={email}
							placeholder={'eg. johndoe@example.emample'}
							onChange={(e) => dispatch(setAgentEmail(e.target.value))}
						/>
					</FormControl>
					<FormControl mb={'1rem'}>
						<FormLabel m={0}>Phone</FormLabel>
						<Input
							value={phone}
							placeholder={'eg. 918XXXXXXXX2'}
							onChange={(e) => dispatch(setAgentPhone(e.target.value))}
						/>
					</FormControl>
					<FormControl mb={'1rem'}>
						<PasswordInput
							value={password}
							onChange={(e) => dispatch(setAgentPassword(e.target.value))}
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
});

export default CreateAgentDialog;
