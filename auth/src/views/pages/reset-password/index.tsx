import {
	Button,
	Flex,
	Image,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
	Text,
	useBoolean,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Color, LOGO_PRIMARY, NAVIGATION } from '../../../config/const';
import AuthService from '../../../services/auth.service';
import { StoreNames, StoreState } from '../../../store';
import {
	reset,
	setConfirmPassword,
	setError,
	setPassword,
	startResettingPassword,
	stopResettingPassword,
} from '../../../store/reducers/UserReducers';
import PasswordInput from '../login-page/password-input';

const ResetPassword = () => {
	const [isOpen, setIsOpen] = useBoolean(true);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const searchParams = useSearchParams();
	const code = searchParams[0].get('code');

	const {
		password,
		confirmPassword,
		error,
		uiDetails: { resettingPassword },
	} = useSelector((state: StoreState) => state[StoreNames.USER]);

	useEffect(() => {
		dispatch(reset());
	}, [dispatch]);

	const handleResetPassword = async () => {
		if (!password) {
			return dispatch(setError({ message: 'Password is required', type: 'password' }));
		}

		if (!confirmPassword) {
			return dispatch(setError({ message: 'Confirm Password is required', type: 'password' }));
		}

		if (password !== confirmPassword) {
			return dispatch(setError({ message: 'Passwords do not match', type: 'password' }));
		}

		dispatch(startResettingPassword());

		const valid = await AuthService.resetPassword(password, code as string);

		dispatch(stopResettingPassword());

		if (valid) {
			navigate(`${NAVIGATION.AUTH}/${NAVIGATION.LOGIN}`);
			return;
		}

		dispatch(setError({ message: 'Password reset failed', type: 'server' }));
	};

	const onClose = () => {
		navigate(NAVIGATION.HOME);
		setIsOpen.off();
	};

	if (!code) {
		// return <Navigate to={NAVIGATION.HOME} replace={true} />;
	}

	return (
		<Modal onClose={onClose} isOpen={isOpen} isCentered>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<Flex alignItems={'center'} gap={'0.5rem'} justifyContent={'center'}>
						<Image src={LOGO_PRIMARY} height={'2.5rem'} />
						<Text color={Color.ACCENT_DARK} fontWeight={'bold'} fontSize={'3xl'}>
							Wautopilot
						</Text>
					</Flex>
				</ModalHeader>
				<ModalBody>
					<Text
						color={Color.PRIMARY_DARK}
						fontWeight={'medium'}
						fontSize={'xl'}
						textAlign={'center'}
					>
						Confirm new password
					</Text>
					<Stack width={'full'} spacing='3'>
						<Stack spacing='3'>
							<PasswordInput
								isInvalid={error.type === 'password' || error.type === 'server'}
								name='password'
								value={password}
								onChange={(e) => dispatch(setPassword(e.target.value))}
								placeholder='********'
							/>
						</Stack>
						<Stack spacing='3'>
							<PasswordInput
								label='Confirm Password'
								isInvalid={error.type === 'password' || error.type === 'server'}
								name='password'
								value={confirmPassword}
								onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
								placeholder='********'
							/>
						</Stack>
						<Stack>{error.type && <Text color={'orange.700'}>{error.message}</Text>}</Stack>
						<Stack pb={'1rem'}>
							<Button
								colorScheme={error.type ? 'red' : 'green'}
								onClick={handleResetPassword}
								isLoading={resettingPassword}
							>
								Reset Password
							</Button>
						</Stack>
					</Stack>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};

export default ResetPassword;
