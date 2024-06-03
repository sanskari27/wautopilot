import { Button, FormControl, FormLabel, Input, Stack, Text, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useGeoLocation } from '../../../hooks/useGeolocation';
import AuthService from '../../../services/auth.service';
import { StoreNames, StoreState } from '../../../store';
import {
	reset,
	setConfirmPassword,
	setEmail,
	setError,
	setPassword,
	startUserAuthenticating,
	stopUserAuthenticating,
} from '../../../store/reducers/UserReducers';
import PasswordInput from './Password-input';

export default function SignupTab() {
	const { location } = useGeoLocation();
	const toast = useToast();
	const dispatch = useDispatch();

	const { isAuthenticating, email, password, confirmPassword, error } = useSelector(
		(state: StoreState) => state[StoreNames.USER]
	);

	const handleSignup = async () => {
		if (!email) {
			return dispatch(setError({ message: 'Email is required', type: 'email' }));
		}
		if (!password) {
			return dispatch(setError({ message: 'Password is required', type: 'password' }));
		}
		if (!confirmPassword) {
			return dispatch(setError({ message: 'Confirm Password', type: 'confirm password' }));
		}

		if (password !== confirmPassword) {
			return dispatch(setError({ message: 'Passwords do not match', type: 'confirm password' }));
		}

		dispatch(startUserAuthenticating());

		const success = await AuthService.registerUser(
			email,
			password,
			'client',
			location.latitude,
			location.longitude
		);
		if (!success) {
			toast({
				title: 'Account creation failed.',
				description: "Email already exists or couldn't send email.",
				status: 'error',
				duration: 5000,
			});
			dispatch(setError({ message: 'Account creation failed.', type: 'server' }));
			dispatch(stopUserAuthenticating());
			return;
		}

		dispatch(reset());

		toast({
			title: 'Account created.',
			description: 'Login credentials sent to your email.',
			status: 'success',
			duration: 5000,
		});
	};
	return (
		<>
			<Stack width={'full'} spacing='6'>
				<Stack spacing='2'>
					<FormControl isInvalid={error.type === 'email'}>
						<FormLabel htmlFor='email' color={'#0b826f'}>
							Email
						</FormLabel>
						<Input
							type='email'
							variant='unstyled'
							bgColor={'white'}
							placeholder='email'
							_placeholder={{
								color: '#0b826f',
								opacity: 0.7,
							}}
							borderColor={'#0b826f'}
							borderWidth={'1px'}
							padding={'0.5rem'}
							name='email'
							value={email}
							onChange={(e) => dispatch(setEmail(e.target.value))}
						/>
					</FormControl>
					<PasswordInput
						isInvalid={error.type === 'password' || error.type === 'confirm password'}
						name='password'
						value={password}
						onChange={(e) => dispatch(setPassword(e.target.value))}
						placeholder='********'
					/>
					<PasswordInput
						isInvalid={error.type === 'confirm password'}
						name='password'
						value={confirmPassword}
						onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
						placeholder='********'
					/>
				</Stack>

				<Stack spacing='0'>
					<Text color={'red'} textAlign={'center'}>
						{error.message}
					</Text>
					<Button
						onClick={handleSignup}
						colorScheme={error.type ? 'red' : 'green'}
						isLoading={isAuthenticating}
					>
						Sign Up
					</Button>
				</Stack>
			</Stack>
		</>
	);
}
