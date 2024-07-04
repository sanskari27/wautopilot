import { Button, FormControl, FormLabel, Input, Stack, useToast } from '@chakra-ui/react';
import { useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useDispatch, useSelector } from 'react-redux';
import { CAPTCHA_KEY } from '../../../config/const';
import AuthService from '../../../services/auth.service';
import { StoreNames, StoreState } from '../../../store';
import {
	reset,
	setConfirmPassword,
	setError,
	setName,
	setNewEmail,
	setNewPassword,
	setPhone,
	startUserAuthenticating,
	stopUserAuthenticating,
} from '../../../store/reducers/UserReducers';
import PasswordInput from '../../components/password-input';

export default function SignupTab() {
	const recaptchaRef = useRef<ReCAPTCHA>(null);
	const validUser = useRef(false);
	const toast = useToast();
	const dispatch = useDispatch();

	const {
		uiDetails: { isAuthenticating },
		newEmail: email,
		phone,
		name,
		error,
		newPassword,
		confirmPassword,
	} = useSelector((state: StoreState) => state[StoreNames.USER]);

	const handleSignup = async () => {
		if (!email) {
			toast({
				title: 'Email is required',
				description: 'Please enter your email.',
				status: 'error',
				duration: 4000,
				isClosable: true,
			});
			return dispatch(setError({ message: 'Email is required', type: 'email' }));
		}
		if (!phone) {
			toast({
				title: 'Phone Number is required',
				description: 'Please enter your phone number.',
				status: 'error',
				duration: 4000,
				isClosable: true,
			});
			return dispatch(setError({ message: 'Phone Number is required', type: 'phone' }));
		}
		if (!name) {
			toast({
				title: 'Name is required',
				description: 'Please enter your name.',
				status: 'error',
				duration: 4000,
				isClosable: true,
			});
			return dispatch(setError({ message: 'Name is required', type: 'name' }));
		}
		if (!newPassword) {
			toast({
				title: 'Password is required',
				description: 'Please enter your password.',
				status: 'error',
				duration: 4000,
				isClosable: true,
			});
			return dispatch(setError({ message: 'Password is required', type: 'password' }));
		}
		if (!confirmPassword) {
			toast({
				title: 'Confirm Password is required',
				description: 'Please confirm your password.',
				status: 'error',
				duration: 4000,
				isClosable: true,
			});
			return dispatch(
				setError({ message: 'Confirm Password is required', type: 'confirm password' })
			);
		}
		if (newPassword !== confirmPassword) {
			toast({
				title: 'Passwords do not match',
				description: 'Please make sure both passwords match.',
				status: 'error',
				duration: 4000,
				isClosable: true,
			});
			return dispatch(setError({ message: 'Passwords do not match', type: 'confirm password' }));
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

		const success = await AuthService.registerUser(name, phone, email, newPassword, 20);
		dispatch(stopUserAuthenticating());
		if (!success) {
			toast({
				title: 'Account creation failed.',
				description: "Email already exists or couldn't send email.",
				status: 'error',
				duration: 5000,
			});
			dispatch(setError({ message: 'Account creation failed.', type: 'server' }));
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
					<FormControl isInvalid={error.type === 'name'}>
						<FormLabel htmlFor='email' color={'#0b826f'}>
							Name
						</FormLabel>
						<Input
							type='text'
							variant='unstyled'
							bgColor={'white'}
							placeholder='eg. John Doe'
							_placeholder={{
								color: '#0b826f',
								opacity: 0.7,
							}}
							borderColor={'#0b826f'}
							borderWidth={'1px'}
							padding={'0.5rem'}
							name='name'
							value={name}
							onChange={(e) => dispatch(setName(e.target.value))}
							marginTop={'-0.5rem'}
						/>
					</FormControl>
					<FormControl isInvalid={error.type === 'email'}>
						<FormLabel htmlFor='email' color={'#0b826f'}>
							Phone (with country code)
						</FormLabel>
						<Input
							type='number'
							variant='unstyled'
							bgColor={'white'}
							placeholder='eg. 9189XXXXXXX'
							_placeholder={{
								color: '#0b826f',
								opacity: 0.7,
							}}
							borderColor={'#0b826f'}
							borderWidth={'1px'}
							padding={'0.5rem'}
							name='email'
							value={phone}
							onChange={(e) => dispatch(setPhone(e.target.value))}
							marginTop={'-0.5rem'}
						/>
					</FormControl>
					<FormControl isInvalid={error.type === 'email'}>
						<FormLabel htmlFor='email' color={'#0b826f'}>
							Email
						</FormLabel>
						<Input
							type='email'
							variant='unstyled'
							bgColor={'white'}
							placeholder='eg. jhon@example.com'
							_placeholder={{
								color: '#0b826f',
								opacity: 0.7,
							}}
							borderColor={'#0b826f'}
							borderWidth={'1px'}
							padding={'0.5rem'}
							name='email'
							value={email}
							onChange={(e) => dispatch(setNewEmail(e.target.value))}
							marginTop={'-0.5rem'}
						/>
					</FormControl>
					<PasswordInput
						isInvalid={error.type === 'password'}
						name='password'
						value={newPassword}
						onChange={(e) => dispatch(setNewPassword(e.target.value))}
						placeholder='********'
					/>
					<PasswordInput
						isInvalid={error.type === 'confirm password'}
						name='confirmPassword'
						label='Confirm Password'
						value={confirmPassword}
						onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
						placeholder='********'
					/>
				</Stack>

				<Stack spacing='0'>
					<Button
						onClick={handleSignup}
						colorScheme={error.type ? 'red' : 'green'}
						isLoading={isAuthenticating}
					>
						Sign Up
					</Button>
				</Stack>

				<ReCAPTCHA ref={recaptchaRef} size='invisible' sitekey={CAPTCHA_KEY} badge='inline' />
			</Stack>
		</>
	);
}
