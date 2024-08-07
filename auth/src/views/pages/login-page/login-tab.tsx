import { Button, FormControl, FormLabel, Input, Stack, Text, useToast } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_URL, CAPTCHA_KEY } from '../../../config/const';
import { useGeoLocation } from '../../../hooks/useGeolocation';
import AuthService from '../../../services/auth.service';
import { StoreNames, StoreState } from '../../../store';
import {
	reset,
	setEmail,
	setError,
	setIsAuthenticated,
	setPassword,
	startUserAuthenticating,
	stopUserAuthenticating,
} from '../../../store/reducers/UserReducers';
import PasswordInput from '../../components/password-input';

function LoginTab() {
	const recaptchaRef = useRef<ReCAPTCHA>(null);
	const validUser = useRef(false);
	const { location } = useGeoLocation();
	const toast = useToast();
	const dispatch = useDispatch();

	const {
		uiDetails: { isAuthenticating },
		email,
		password,
		error,
		accessLevel,
	} = useSelector((state: StoreState) => state[StoreNames.USER]);

	const forgotPassword = async () => {
		if (!email) {
			return dispatch(setError({ message: 'Email is required', type: 'email' }));
		}
		if (!validUser.current) {
			const token = await recaptchaRef.current?.executeAsync();
			if (!token) {
				return toast({
					title: 'Please verify you are not a robot',
					description:
						'If you are not a robot, please try again. If the issue persists, please refresh the page.',
					status: 'error',
					duration: 4000,
					isClosable: true,
				});
			}
			validUser.current = true;
		}
		const valid = await AuthService.forgotPassword(email, `${AUTH_URL}auth/reset-password`);
		if (valid) {
			return toast({
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
		if (!validUser.current) {
			const token = await recaptchaRef.current?.executeAsync();
			if (!token) {
				return toast({
					title: 'Please verify you are not a robot',
					description:
						'If you are not a robot, please try again. If the issue persists, please refresh the page.',
					status: 'error',
					duration: 4000,
					isClosable: true,
				});
			}
			validUser.current = true;
		}

		dispatch(startUserAuthenticating());
		const valid = await AuthService.login(
			email,
			password,
			accessLevel,
			location.latitude,
			location.longitude
		);
		dispatch(stopUserAuthenticating());
		if (valid) {
			dispatch(setIsAuthenticated(true));
		}
		dispatch(setError({ message: 'Invalid credentials', type: 'server' }));
		setTimeout(() => {
			dispatch(setError({ message: '', type: '' }));
		}, 2000);
	};

	useEffect(() => {
		dispatch(reset());
	}, [dispatch]);

	return (
		<>
			<Stack width={'full'} spacing='6'>
				<Stack spacing='3'>
					<FormControl isInvalid={error.type === 'email' || error.type === 'server'}>
						<FormLabel htmlFor='email' color={'#0b826f'}>
							Email
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
					<Text
						textAlign={'center'}
						cursor={'pointer'}
						onClick={forgotPassword}
						_hover={{ textDecoration: 'underline' }}
					>
						forgot password?
					</Text>
				</Stack>
				<ReCAPTCHA ref={recaptchaRef} size='invisible' sitekey={CAPTCHA_KEY} badge='inline' />
			</Stack>
		</>
	);
}

export default LoginTab;
