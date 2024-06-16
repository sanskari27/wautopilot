import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Icon, Menu, MenuButton, MenuItem, MenuList, useBoolean } from '@chakra-ui/react';
import { BiLabel } from 'react-icons/bi';
import { TiPinOutline } from 'react-icons/ti';
import { useDispatch } from 'react-redux';
import { setLabels } from '../../../../store/reducers/PhonebookReducer';
import LabelFilter from '../../../components/labelFilter';

export default function ContextMenu() {
	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsMenuClicked.toggle();
	};

	const dispatch = useDispatch();

	const [isMenuClicked, setIsMenuClicked] = useBoolean(false);

	return (
		<>
			<Menu onClose={setIsMenuClicked.off}>
				<MenuButton
					as={Button}
					onClick={handleClick}
					bgColor={'transparent'}
					_hover={{ bgColor: 'transparent' }}
					_expanded={{ bgColor: 'transparent' }}
					_focus={{ bgColor: 'transparent' }}
					ml={'auto'}
					className={!isMenuClicked ? 'group-hover:!block !hidden' : 'block'}
					// position={'absolute'}
					right={0}
				>
					<Icon
						as={ChevronDownIcon}
						alignSelf={'flex-start'}
						ml={'auto'}
						fontSize={'1.5rem'}
						// display={isMenuClicked ? 'block' : 'none'}
					/>
				</MenuButton>
				<MenuList>
					<MenuItem>
						<LabelFilter
							onChange={(labels) => dispatch(setLabels(labels))}
							buttonComponent={
								<Box>
									<Icon as={BiLabel} mr={2} /> Assign label
								</Box>
							}
						/>
					</MenuItem>
					<MenuItem>
						<Icon as={TiPinOutline} mr={2} /> Pin
					</MenuItem>
				</MenuList>
			</Menu>
		</>
	);
}
