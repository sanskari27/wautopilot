import { Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import { getFileSize } from '../../../../utils/file-utils';

export default function MediaStorage() {
	const {
		details: { mediaSize },
	} = useSelector((state: StoreState) => state[StoreNames.DASHBOARD]);

	return (
		<Stat
			shadow={'lg'}
			rounded={'3xl'}
			height={'200px'}
			textAlign={'center'}
			bgColor={'thistle'}
			pt={'12%'}
			width={'200px'}
		>
			<StatLabel>Media Storage</StatLabel>
			<StatNumber>{getFileSize(mediaSize)}</StatNumber>
		</Stat>
	);
}
