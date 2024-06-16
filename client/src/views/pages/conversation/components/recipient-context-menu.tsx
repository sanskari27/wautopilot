import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Icon, Menu, MenuButton, MenuItem, MenuList, useBoolean } from '@chakra-ui/react';
import { useRef } from 'react';
import { BiLabel } from 'react-icons/bi';
import { LuPin, LuPinOff } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import { setRecipientsList } from '../../../../store/reducers/RecipientReducer';
import { Recipient } from '../../../../store/types/RecipientsState';
import AssignConversationLabelDialog, {
	AssignConversationLabelDialogHandle,
} from './add-conversation-labels';

export default function ContextMenu({ recipient }: { recipient: Recipient }) {
	const dispatch = useDispatch();
	const assignConversationLabelRef = useRef<AssignConversationLabelDialogHandle>(null);

	const { list } = useSelector((state: StoreState) => state[StoreNames.RECIPIENT]);

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsMenuClicked.toggle();
	};

	const handleConversationPin = () => {
		if (localStorage.getItem('pinned') === null) {
			localStorage.setItem('pinned', JSON.stringify([recipient]));
		} else {
			const pinned = JSON.parse(localStorage.getItem('pinned') as string);
			const index = pinned.findIndex((item: Recipient) => item._id === recipient._id);
			if (index === -1) {
				pinned.push(recipient);
				localStorage.setItem('pinned', JSON.stringify(pinned));
			} else {
				pinned.splice(index, 1);
				localStorage.setItem('pinned', JSON.stringify(pinned));
			}
		}
		dispatch(setRecipientsList(list));
	};

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
					className={!isMenuClicked ? 'group-hover:!block !hidden' : 'bloxk'}
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
					<MenuItem
						onClick={() => {
							assignConversationLabelRef.current?.open(recipient);
						}}
					>
						<Icon as={BiLabel} mr={2} /> Assign label
					</MenuItem>
					<MenuItem onClick={handleConversationPin}>
						{localStorage.getItem('pinned')?.includes(recipient._id) ? (
							<>
								<Icon as={LuPinOff} mr={2} /> Unpin
							</>
						) : (
							<>
								<Icon as={LuPin} mr={2} /> pin
							</>
						)}
					</MenuItem>
				</MenuList>
			</Menu>
			<AssignConversationLabelDialog ref={assignConversationLabelRef} />
		</>
	);
}
