import { Button, FormControl, FormLabel, Input, Stack, Text, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NAVIGATION } from '../../../config/const';
import { useGeoLocation } from '../../../hooks/useGeolocation';
import AuthService from '../../../services/auth.service';
import { StoreNames, StoreState } from '../../../store';
import {
	setEmail,
	setError,
	setPassword,
	startUserAuthenticating,
	stopUserAuthenticating,
} from '../../../store/reducers/UserReducers';
import PasswordInput from './Password-input';

function LoginTab() {
	const { location, isLocating } = useGeoLocation();
	const navigate = useNavigate();
	const toast = useToast();
	const dispatch = useDispatch();

	const { isAuthenticating, email, password, error } = useSelector(
		(state: StoreState) => state[StoreNames.USER]
	);

	const forgotPassword = async () => {
		if (!email) {
			return dispatch(setError({ message: 'Email is required', type: 'email' }));
		}
		const valid = await AuthService.forgotPassword(email, 'http://localhost:5173/');
		if (valid) {
			toast({
				title: 'Password reset link sent to your email',
				status: 'success',
				duration: 4000,
				isClosable: true,
			});
		}
		dispatch(setError({ message: 'No User with this email', type: 'email' }));
		setTimeout(() => {
			dispatch(setError({ message: '', type: '' }));
		}, 5000);
	};

	const handleLogin = async () => {
		if (!email) {
			return dispatch(setError({ message: 'Email is required', type: 'email' }));
		}
		if (!password) {
			return dispatch(setError({ message: 'Password is required', type: 'password' }));
		}
		dispatch(startUserAuthenticating());
		const valid = await AuthService.login(email, password, location.latitude, location.longitude);
		if (valid) {
			return navigate(NAVIGATION.LOGIN);
		}
		dispatch(setError({ message: 'Invalid credentials', type: 'server' }));
		dispatch(stopUserAuthenticating());
		setTimeout(() => {
			dispatch(setError({ message: '', type: '' }));
		}, 2000);
	};

	return (
		<>
			<Stack width={'full'} spacing='6'>
				<Stack spacing='3'>
					<FormControl isInvalid={error.type === 'email' || error.type === 'server'}>
						<FormLabel htmlFor='email' color={'#0b826f'}>
							Username
						</FormLabel>
						<Input
							type='email'
							name='username'
							value={email}
							variant='unstyled'
							bgColor={'white'}
							onChange={(e) => dispatch(setEmail(e.target.value))}
							placeholder='username'
							_placeholder={{
								color: error.type === 'email' || error.type === 'server' ? 'red.400' : 'green',
								opacity: 0.7,
							}}
							borderColor={error.type === 'email' || error.type === 'server' ? 'red' : 'green'}
							borderWidth={'1px'}
							padding={'0.5rem'}
							marginTop={'-0.5rem'}
						/>
					</FormControl>
					<PasswordInput
						isInvalid={error.type === 'password' || error.type === 'server'}
						name='password'
						value={password}
						onChange={(e) => dispatch(setPassword(e.target.value))}
						placeholder='********'
					/>
				</Stack>

				<Stack>
					<Text color={'red'} textAlign={'center'}>
						{error.message}
					</Text>
					<Button
						onClick={handleLogin}
						colorScheme={error.type ? 'red' : 'green'}
						isLoading={isAuthenticating}
					>
						Sign in
					</Button>
					<Text textAlign={'center'} cursor={'pointer'} onClick={forgotPassword}>
						forgot password?
					</Text>
				</Stack>
			</Stack>
		</>
	);
}

export default LoginTab;
