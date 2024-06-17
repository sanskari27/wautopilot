import { SearchIcon } from '@chakra-ui/icons';
import { Icon, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdClear } from 'react-icons/md';

export default function SearchBar({
	onSearchTextChanged,
	timeout = 1000,
}: {
	onSearchTextChanged: (text: string) => void;
	timeout?: number;
}) {
	const [searchText, _setSearchText] = useState<string>('');

	useEffect(() => {
		const timer = setTimeout(() => {
			onSearchTextChanged(searchText);
		}, timeout);
		return () => clearTimeout(timer);
	}, [searchText, onSearchTextChanged, timeout]);

	return (
		<InputGroup variant={'outline'} width={'full'}>
			<InputLeftElement pointerEvents='none'>
				<SearchIcon color='gray.300' />
			</InputLeftElement>
			<InputRightElement>
				<Icon
					height={'1.25rem'}
					width={'1.25rem'}
					as={MdClear}
					background={'red.400'}
					cursor={'pointer'}
					_hover={{ background: 'red.600' }}
					rounded={'full'}
					color={'white'}
					p={'0.25rem'}
					onClick={() => _setSearchText('')}
				/>
			</InputRightElement>
			<Input
				placeholder='Search here...'
				value={searchText}
				onChange={(e) => _setSearchText(e.target.value)}
				borderRadius={'5px'}
				focusBorderColor='gray.300'
				color={'black'}
			/>
		</InputGroup>
	);
}
