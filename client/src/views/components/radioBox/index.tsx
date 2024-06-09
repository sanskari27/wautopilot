import { Box, HStack, UseRadioProps, useRadio, useRadioGroup } from '@chakra-ui/react';

export default function RadioBox(
	props: UseRadioProps & {
		children: React.ReactNode;
	}
) {
	const { getInputProps, getRadioProps } = useRadio(props);

	const input = getInputProps();
	const checkbox = getRadioProps();

	return (
		<Box as='label'>
			<input {...input} />
			<Box
				{...checkbox}
				cursor='pointer'
				borderWidth='1px'
				boxShadow='md'
				rounded={'2xl'}
				_checked={{
					bg: 'green.400',
					color: 'white',
					borderColor: 'green.400',
				}}
				_focus={{
					boxShadow: 'outline',
				}}
				px={4}
				py={0.5}
			>
				{props.children}
			</Box>
		</Box>
	);
}

export function RadioBoxGroup({
	defaultValue,
	options,
	selectedValue,
	onChange,
}: {
	defaultValue: string;
	selectedValue: string;
	options: {
		key: string;
		value: string;
	}[];
	onChange: (value: string) => void;
}) {
	const { getRootProps, getRadioProps } = useRadioGroup({
		name: 'radio-group',
		defaultValue: defaultValue,
		onChange: console.log,
	});
	const group = getRootProps();

	return (
		<HStack {...group} gap={4}>
			{options.map((el) => {
				const radio = getRadioProps({ value: el });
				return (
					<RadioBox
						key={el.key}
						{...radio}
						isChecked={selectedValue === el.key}
						onChange={(e) => e.target.checked && onChange(el.key)}
					>
						{el.value}
					</RadioBox>
				);
			})}
		</HStack>
	);
}
