import { Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';

export default function TemplateStats() {
	const { list } = useSelector((state: StoreState) => state[StoreNames.TEMPLATES]);
	const approvedTemplates = list.map((template) => template.status === 'approved');
	return (
		<Stat
			shadow={'lg'}
			rounded={'3xl'}
			height={'200px'}
			textAlign={'center'}
			bgColor={'blue.200'}
			pt={'8%'}
			flex={1}
		>
			<StatLabel>Total Templates</StatLabel>
			<StatNumber>{list.length}</StatNumber>
			<StatLabel>Approved</StatLabel>
			<StatNumber>{approvedTemplates.length}</StatNumber>
		</Stat>
	);
}
