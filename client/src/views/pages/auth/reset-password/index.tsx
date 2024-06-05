import { Button, Modal, ModalBody, ModalContent, ModalHeader, Stack, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { NAVIGATION } from '../../../../config/const';
import AuthService from '../../../../services/auth.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	reset,
	setConfirmPassword,
	setError,
	setPassword,
	startResettingPassword,
	stopResettingPassword,
} from '../../../../store/reducers/UserReducers';
import PasswordInput from '../../../components/user-login/password-input';

const ResetPassword = () => {
	// const { isLocating } = useGeoLocation();
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

	if (!code) {
		navigate(`${NAVIGATION.AUTH}/${NAVIGATION.LOGIN}`);
	}

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

	return (
		<Modal
			onClose={() => {
				navigate(-1);
			}}
			closeOnOverlayClick={false}
			isOpen={true}
			isCentered
			size={'2xl'}
		>
			<ModalContent>
				<ModalHeader>Reset your password</ModalHeader>
				<ModalBody>
					<Stack width={'full'} spacing='6'>
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
						<Stack>{error.type && <Text color={'red.400'}>{error.message}</Text>}</Stack>
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
