import { Button, FormControl, FormLabel, Input, Stack, Text, useToast } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../../../services/auth.service';
import { StoreNames, StoreState } from '../../../store';
import {
	reset,
	setEmail,
	setError,
	setName,
	setPhone,
	startUserAuthenticating,
	stopUserAuthenticating,
} from '../../../store/reducers/UserReducers';

export default function SignupTab() {
	const toast = useToast();
	const dispatch = useDispatch();

	const {
		uiDetails: { isAuthenticating },
		email,
		phone,
		name,
		error,
	} = useSelector((state: StoreState) => state[StoreNames.USER]);

	const handleSignup = async () => {
		if (!email) {
			return dispatch(setError({ message: 'Email is required', type: 'email' }));
		}
		if (!phone) {
			return dispatch(setError({ message: 'Phone Number is required', type: 'phone' }));
		}
		if (!name) {
			return dispatch(setError({ message: 'Name is required', type: 'name' }));
		}

		dispatch(startUserAuthenticating());

		const success = await AuthService.registerUser(name, phone, email, 20);
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
							onChange={(e) => dispatch(setEmail(e.target.value))}
							marginTop={'-0.5rem'}
						/>
					</FormControl>
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
