import { Input, Select, Textarea } from '@chakra-ui/react';

export function TextAreaElement({
	value,
	onChange,
	isInvalid = false,
	placeholder,
	minHeight = '80px',
}: {
	placeholder: string;
	value: string;
	onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
	isInvalid?: boolean;
	minHeight?: string;
}) {
	return (
		<Textarea
			width={'full'}
			minHeight={minHeight}
			isInvalid={isInvalid}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
		/>
	);
}

export function SelectElement({
	options,
	value,
	onChangeText,
	size = 'md',
}: {
	options: { title: string; value: string }[];
	value: string;
	onChangeText: (text: string) => void;
	size?: string;
}) {
	return (
		<Select value={value} rounded={'md'} size={size} onChange={(e) => onChangeText(e.target.value)}>
			{options.map((option, index) => (
				<option key={index} value={option.value}>
					{option.title}
				</option>
			))}
		</Select>
	);
}

export function NumberInput({
	value,
	onChangeText,
}: {
	value: number;
	onChangeText: (value: number) => void;
}) {
	return (
		<Input
			type='number'
			placeholder='10'
			size={'md'}
			rounded={'md'}
			value={value}
			onChange={(e) => onChangeText(Number(e.target.value))}
		/>
	);
}

export function TextInput({
	value,
	onChangeText,
	placeholder,
}: {
	value: string;
	placeholder: string;
	onChangeText: (value: string) => void;
}) {
	return (
		<Input
			type='text'
			placeholder={placeholder}
			size={'md'}
			rounded={'md'}
			value={value}
			onChange={(e) => onChangeText(e.target.value)}
		/>
	);
}
