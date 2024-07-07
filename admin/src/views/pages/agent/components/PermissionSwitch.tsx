import { FormControl, FormLabel, HStack, Switch } from '@chakra-ui/react';

export default function PermissionSwitch({
	isChecked,
	onChange,
	label,
}: {
	isChecked: boolean;
	onChange: (value: boolean) => void;
	label: string;
}) {
	return (
		<FormControl mb={'0.25rem'}>
			<HStack justifyContent={'space-between'}>
				<FormLabel m={0}>{label}</FormLabel>
				<Switch
					onChange={(e) => onChange(e.target.checked)}
					colorScheme={'green'}
					size='sm'
					isChecked={isChecked}
				/>
			</HStack>
		</FormControl>
	);
}
