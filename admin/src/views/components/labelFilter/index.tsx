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
import { useState } from 'react';
import { BiFilter } from 'react-icons/bi';
import SearchBar from '../searchBar';
import Each from '../utils/Each';

export default function LabelFilter({
	buttonComponent,
	labels,
	onAddLabel,
	onRemoveLabel,
	onClear,
	selectedLabels,
}: {
	buttonComponent?: React.ReactNode;
	onAddLabel: (label: string) => void;
	onRemoveLabel: (label: string) => void;
	onClear: () => void;
	labels: string[];
	selectedLabels: string[];
}) {
	const [searchText, setSearchText] = useState<string>('');

	const filtered = (labels ?? []).filter((label: string) => label.includes(searchText));

	function handleCheckboxClick(label: string, checked: boolean): void {
		if (checked) {
			onAddLabel(label);
		} else {
			onRemoveLabel(label);
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
							onClick={onClear}
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
										isChecked={selectedLabels.includes(label)}
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
