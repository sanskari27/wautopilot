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
import { useEffect, useReducer, useState } from 'react';
import { BiFilter } from 'react-icons/bi';
import PhoneBookService from '../../../services/phonebook.service';
import SearchBar from '../searchBar';
import Each from '../utils/Each';

export default function LabelFilter({
	buttonComponent,
	onChange = () => {},
	onClose = () => {},
	clearOnClose = false,
}: {
	buttonComponent?: React.ReactNode;
	onChange?: (labels: string[]) => void;
	onClose?: (labels: string[]) => void;
	clearOnClose?: boolean;
}) {
	const [searchText, setSearchText] = useState<string>('');
	const [labels, setLabels] = useState<string[]>( []);
	const [filterLabels, dispatch] = useReducer(
		(
			state: string[],
			action: { type: 'add'; label: string } | { type: 'remove'; label: string } | { type: 'clear' }
		) => {
			switch (action.type) {
				case 'add':
					return [...state, action.label];
				case 'remove':
					return state.filter((label) => label !== action.label);
				case 'clear':
					return [];
				default:
					return state;
			}
		},
		[]
	);

	useEffect(() => {
		PhoneBookService.allLabels().then(setLabels);
	}, [setLabels]);

	useEffect(() => {
		onChange(filterLabels);
	}, [filterLabels, onChange]);

	const filtered = labels.filter((label) => label.includes(searchText));

	function handleCheckboxClick(label: string, checked: boolean): void {
		if (checked) {
			dispatch({ type: 'add', label });
		} else {
			dispatch({ type: 'remove', label });
		}
	}

	useEffect(()=>{
		
	},[])

	return (
		<Popover
			onClose={() => {
				onClose(filterLabels);
				clearOnClose && dispatch({ type: 'clear' });
			}}
			isLazy={true}
			lazyBehavior='keepMounted'
		>
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
							onClick={() => dispatch({ type: 'clear' })}
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
					<Box maxHeight={'300px'} overflowY={'scroll'} overflowX={'hidden'}>
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
