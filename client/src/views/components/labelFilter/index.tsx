import {
	Box,
	Checkbox,
	Flex,
	IconButton,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverTrigger,
	Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BiFilter } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import PhoneBookService from '../../../services/phonebook.service';
import { StoreNames, StoreState } from '../../../store';
import {
	addFilterLabel,
	removeAllFilterLabels,
	removeFilterLabel,
	setLabels,
} from '../../../store/reducers/PhonebookReducer';
import SearchBar from '../serachBar';
import Each from '../utils/Each';

export default function LabelFilter({ buttonComponent }: { buttonComponent?: React.ReactNode }) {
	const dispatch = useDispatch();
	const [searchText, setSearchText] = useState<string>('');

	const { labels, filterLabels } = useSelector((state: StoreState) => state[StoreNames.PHONEBOOK]);

	useEffect(() => {
		PhoneBookService.allLabels().then((labels) => {
			dispatch(setLabels(labels));
		});
	}, [dispatch]);

	const filtered = labels.filter((label) => label.includes(searchText));

	function handleCheckboxClick(label: string, checked: boolean): void {
		if (checked) {
			dispatch(addFilterLabel(label));
		} else {
			dispatch(removeFilterLabel(label));
		}
	}

	return (
		<Popover>
			<PopoverTrigger>
				{buttonComponent || <IconButton aria-label='filter-button' icon={<BiFilter />} />}
			</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<PopoverCloseButton />
				<PopoverHeader>
					<Flex justifyContent={'space-between'}>
						<Text
							_hover={{
								cursor: 'pointer',
								textDecoration: 'underline',
							}}
							onClick={() => dispatch(removeAllFilterLabels())}
						>
							Clear
						</Text>
						<Text fontWeight={'medium'} fontSize={'lg'} textAlign={'center'} mb={'0.25rem'}>
							Select Tags
						</Text>
						<Box />
					</Flex>
					<Flex alignItems={'center'}>
						<SearchBar timeout={100} onSearchTextChanged={setSearchText} />
					</Flex>
				</PopoverHeader>
				<PopoverBody>
					<Box maxHeight={'300px'} overflow={'scroll'}>
						<Each
							items={filtered}
							render={(label) => (
								<Flex>
									<Checkbox
										size='lg'
										colorScheme='green'
										isChecked={filterLabels.includes(label)}
										onChange={(e) => handleCheckboxClick(label, e.target.checked)}
									>
										<Text fontSize={'lg'}>{label}</Text>
									</Checkbox>
								</Flex>
							)}
						/>
					</Box>
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
}
