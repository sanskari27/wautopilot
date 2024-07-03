import { Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';

export default function PhonebookContact() {
	const {
		details: { phoneRecords },
	} = useSelector((state: StoreState) => state[StoreNames.DASHBOARD]);

	const { list: contactList } = useSelector((state: StoreState) => state[StoreNames.CONTACT]);

	return (
		<Stat
			shadow={'lg'}
			rounded={'3xl'}
			height={'200px'}
			textAlign={'center'}
			bgColor={'thistle'}
			pt={'8%'}
			width={'200px'}
		>
			<StatLabel>Total PhoneBook</StatLabel>
			<StatNumber>{phoneRecords}</StatNumber>
			<StatLabel>Total Contacts</StatLabel>
			<StatNumber>{contactList.length}</StatNumber>
		</Stat>
	);
}
