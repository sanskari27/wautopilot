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
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NAVIGATION } from '../../../../config/const';
import AgentService from '../../../../services/agent.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	addAgent,
	setAgentDetails,
	setAgentEmail,
	setAgentName,
	setAgentPassword,
	setAgentPhone,
	updateAgent,
} from '../../../../store/reducers/AgentReducer';
import PasswordInput from '../../../components/password-input';

const AgentDetailsDialog = () => {
	const dispatch = useDispatch();
	const toast = useToast();
	const navigate = useNavigate();
	const { id } = useParams();

	const {
		details: { email, name, phone, password },
	} = useSelector((state: StoreState) => state[StoreNames.AGENT]);

	const handleClose = () => {
		navigate(`${NAVIGATION.APP}/${NAVIGATION.AGENT}`);
	};

	const handleSave = () => {
		if (!name || !email || !phone) {
			toast({
				title: 'All fields are required',
				status: 'error',
			});
			return;
		}

		let promise;
		if (id) {
			promise = AgentService.updateAgent({ id, name, email, phone, password: '000000' });
		} else {
			if (!password || password.length < 6) {
				toast({
					title: 'Password must be at least 6 characters',
					status: 'error',
				});
				return;
			}
			promise = AgentService.createAgent({ name, email, phone, password });
		}

		toast.promise(promise, {
			loading: { title: 'Saving...' },
			success: (data) => {
				if (!id) {
					dispatch(addAgent(data));
				} else {
					dispatch(updateAgent({ id, ...data }));
				}
				handleClose();
				return {
					title: 'Agent saved successfully',
				};
			},
			error: (err) => {
				return {
					title: err.message,
				};
			},
		});
	};

	useEffect(() => {
		if (id) {
			dispatch(setAgentDetails(id));
		} else {
			dispatch(setAgentName(''));
			dispatch(setAgentEmail(''));
			dispatch(setAgentPhone(''));
			dispatch(setAgentPassword(''));
		}
	}, [dispatch, id]);

	return (
		<Modal isOpen={true} onClose={handleClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{id ? 'Edit' : 'Create'} Agent</ModalHeader>
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
					{!id && (
						<FormControl mb={'1rem'}>
							<PasswordInput
								value={password}
								onChange={(e) => dispatch(setAgentPassword(e.target.value))}
								placeholder='*********'
							/>
						</FormControl>
					)}
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

export default AgentDetailsDialog;
