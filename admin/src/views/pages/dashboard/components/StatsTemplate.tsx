import { Stat, StatLabel, StatNumber } from '@chakra-ui/react';

export default function StatsTemplate({
	label,
	value,
	bgColor,
}: {
	label: string;
	value: string;
	bgColor: string;
}) {
	return (
		<Stat
			shadow={'lg'}
			rounded={'3xl'}
			height={'200px'}
			textAlign={'center'}
			bgColor={bgColor}
			pt={'12%'}
			flex={1}
			width={'200px'}
			maxWidth={'200px'}
		>
			<StatLabel>
				{label}
			</StatLabel>
			<StatNumber>
				{value}
			</StatNumber>
		</Stat>
	);
}
