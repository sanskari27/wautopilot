import {
	FormControl,
	FormLabel,
	IconButton,
	Input,
	InputGroup,
	InputProps,
	InputRightElement,
	useDisclosure,
	useMergeRefs,
} from '@chakra-ui/react';
import { forwardRef, useRef } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

const PasswordInput = forwardRef<
	HTMLInputElement,
	InputProps & {
		label?: string;
	}
>((props, ref) => {
	const { isOpen, onToggle } = useDisclosure();
	const inputRef = useRef<HTMLInputElement>(null);

	const mergeRef = useMergeRefs(inputRef, ref);
	const onClickReveal = () => {
		onToggle();
		if (inputRef.current) {
			inputRef.current.focus({ preventScroll: true });
		}
	};

	return (
		<FormControl>
			<FormLabel htmlFor='password'>{props.label || 'Password'}</FormLabel>
			<InputGroup>
				<InputRightElement>
					<IconButton
						marginTop={'-0.75rem'}
						variant='text'
						aria-label={isOpen ? 'Mask password' : 'Reveal password'}
						icon={isOpen ? <HiEyeOff /> : <HiEye />}
						onClick={onClickReveal}
					/>
				</InputRightElement>
				<Input
					ref={mergeRef}
					name='password'
					type={isOpen ? 'text' : 'password'}
					autoComplete='current-password'
					required
					color={'black'}
					variant='unstyled'
					bgColor={'white'}
					borderWidth={'1px'}
					padding={'0.5rem'}
					marginTop={'-0.5rem'}
					{...props}
				/>
			</InputGroup>
		</FormControl>
	);
});

PasswordInput.displayName = 'PasswordField';

export default PasswordInput;
