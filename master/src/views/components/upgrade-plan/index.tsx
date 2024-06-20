import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PLANS } from '../../../config/const';
import AdminsService from '../../../services/admin.service';
import { setAdminExpiry } from '../../../store/reducers/AdminReducer';
import { Admin } from '../../../store/types/AdminState';
import Each from '../utils/Each';

export type UpgradePlanDialogHandle = {
	open: (admin: Admin) => void;
	close: () => void;
};

const initialState: Admin = {
	id: '',
	name: '',
	email: '',
	isSubscribed: false,
	phone: '',
	subscription_expiry: '',
};

const UpgradePlanDialog = forwardRef<UpgradePlanDialogHandle>((_, ref) => {
	const dispatch = useDispatch();
	const toast = useToast();
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [plan, setPlan] = useState('remove');
	const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
	const [admin, setAdmin] = useState(initialState);

	useImperativeHandle(ref, () => ({
		open: (admin) => {
			setAdmin(admin);
			onOpen();
		},
		close: () => {
			handleClose();
		},
	}));

	const handleClose = () => {
		setPlan('remove');
		setDate(new Date().toISOString().split('T')[0]);

		onClose();
	};

	const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setPlan(e.target.value);
		const plan = PLANS.find((p) => p._id === e.target.value);
		if (plan) {
			setDate(
				new Date(new Date().getTime() + plan.plan_duration * 24 * 60 * 60 * 1000)
					.toISOString()
					.split('T')[0]
			);
		}
	};

	const handleUpgradePlan = () => {
		AdminsService.upgradePlan(admin.id, { plan_id: plan, date }).then((res) => {
			if (res) {
				toast({
					title: 'Plan upgraded successfully',
					status: 'success',
				});
				handleClose();
				dispatch(setAdminExpiry({ id: admin.id, date }));
				return;
			}
			toast({
				title: 'Failed to upgrade plan',
				status: 'error',
			});
		});
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Upgrade Plan</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl>
						<FormLabel>Upgrade Plan</FormLabel>
						<Select value={plan} onChange={handlePlanChange}>
							<option value={'remove'}>Remove plan</option>
							<Each
								items={PLANS}
								render={(plan) => <option value={plan._id}>{plan.plan_name}</option>}
							/>
						</Select>
					</FormControl>
					{plan !== 'remove' && (
						<FormControl mt={'1rem'}>
							<FormLabel>Plan Expiry</FormLabel>
							<Input
								type='date'
								min={new Date().toISOString().split('T')[0]}
								value={date}
								onChange={(e) => setDate(e.target.value)}
							/>
						</FormControl>
					)}
				</ModalBody>
				<ModalFooter>
					<Button colorScheme='red' variant={'outline'} mr={3} onClick={onClose}>
						Close
					</Button>
					<Button colorScheme='green' onClick={handleUpgradePlan}>
						Upgrade
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

export default UpgradePlanDialog;
