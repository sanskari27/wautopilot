import {
	Box,
	Button,
	ComponentWithAs,
	Flex,
	Icon,
	IconButton,
	IconProps,
	Input,
	Skeleton,
	SkeletonCircle,
	SkeletonText,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr,
} from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
// import TextToQR from '../../../helpers/qr-generator/textToQR';
import { CopyIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { IoLink } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import useFilteredList from '../../../hooks/useFilteredList';
import ShortenerService from '../../../services/shortener.service';
import { StoreNames, StoreState } from '../../../store';
import { deleteShortenLink, setLinkCopied } from '../../../store/reducers/LinkShortenerReducer';
import DeleteAlert, { DeleteAlertHandle } from '../../components/delete-alert';
import QRImage from '../../components/qr-image/QRImage';
import Each from '../../components/utils/Each';
import LinkDetailsDrawer, { LinkDetailsDrawerHandle } from './components/LinkDetailsDrawer';

const LinkShortener = () => {
	const dispatch = useDispatch();
	const deleteAlertRef = useRef<DeleteAlertHandle>(null);
	const drawerRef = useRef<LinkDetailsDrawerHandle>(null);

	const {
		list,
		ui: { link_copied, loading_links },
	} = useSelector((state: StoreState) => state[StoreNames.LINK]);

	const deleteLink = async (id: string) => {
		await ShortenerService.deleteLink(id);
		dispatch(deleteShortenLink(id));
	};

	useEffect(() => {
		setTimeout(() => {
			dispatch(setLinkCopied(false));
		}, 5000);
	}, [link_copied, dispatch]);

	const filtered = useFilteredList(list, { title: 1 });

	return (
		<Box p={8}>
			<Flex width={'full'} justifyContent={'space-between'} alignItems={'flex-end'} pb={'1rem'}>
				<Text fontSize={'2xl'} fontWeight={'bold'}>
					Shorten Links
				</Text>
				<Button
					variant='outline'
					size={'sm'}
					colorScheme='green'
					leftIcon={<IoLink />}
					onClick={() => drawerRef.current?.open()}
				>
					Create Link
				</Button>
			</Flex>
			<LinkDetailsDrawer ref={drawerRef} />

			<TableContainer width={'full'} border={'1px dashed gray'} rounded={'2xl'}>
				<Table variant='striped' colorScheme='gray'>
					<Thead>
						<Tr>
							<Th width={'5%'}>Sl. no</Th>
							<Th width={'15%'}>Qr Code</Th>
							<Th width={'20%'}>Title</Th>
							<Th width={'25%'}>link</Th>
							<Th width={'25%'}>shorten link</Th>
							<Th width={'5%'}>Action</Th>
						</Tr>
					</Thead>
					<Tbody>
						{loading_links && list.length === 0 ? (
							<Each items={[1, 2, 3]} render={() => <ListSkeleton />} />
						) : (
							<Each
								items={filtered.filtered}
								render={(item, index) => (
									<Tr>
										<Td>{index + 1}.</Td>
										<Td>
											<QRImage base64={item.base64} />
										</Td>
										<Td>{item.title ?? 'No title'}</Td>
										<Td>
											<Input value={item.link} isReadOnly size={'sm'} />
										</Td>
										<Td>
											<Input value={item.shorten_link} isReadOnly size={'sm'} />
										</Td>
										<Td>
											<ActionButton
												label='Copy Link'
												activeBackgroundColor='gray.100'
												icon={CopyIcon}
												onClick={() => navigator.clipboard.writeText(item.shorten_link)}
												color={'black'}
											/>
											<ActionButton
												label='Edit Link'
												activeBackgroundColor='yellow.100'
												icon={EditIcon}
												onClick={() => {
													drawerRef.current?.open(item.id);
												}}
												color={'yellow.500'}
											/>
											<ActionButton
												label='Delete Link'
												isHidden
												activeBackgroundColor='red.100'
												icon={DeleteIcon}
												onClick={() => {
													deleteAlertRef.current?.open(item.id);
												}}
												color={'red.500'}
											/>
										</Td>
									</Tr>
								)}
							/>
						)}
					</Tbody>
				</Table>
			</TableContainer>
			<DeleteAlert ref={deleteAlertRef} type={'Link'} onConfirm={deleteLink} />
		</Box>
	);
};

type ActionButtonProps = {
	icon: ComponentWithAs<'svg', IconProps>;
	onClick: () => void;
	activeBackgroundColor: string;
	color: string;
	isHidden?: boolean;
	label: string;
};
function ActionButton({
	icon,
	onClick,
	color,
	activeBackgroundColor,
	isHidden = false,
	label,
}: ActionButtonProps) {
	return (
		<Tooltip label={label} aria-label={label}>
			<IconButton
				backgroundColor={'transparent'}
				border={'none'}
				outline={'none'}
				_hover={{
					backgroundColor: 'transparent',
					border: 'none',
					outline: 'none',
				}}
				_active={{
					backgroundColor: activeBackgroundColor,
					border: 'none',
					outline: 'none',
				}}
				aria-label='action-button'
				icon={<Icon as={icon} />}
				onClick={onClick}
				color={color}
				hidden={isHidden}
				zIndex={1}
			/>
		</Tooltip>
	);
}

function LineSkeleton() {
	return <SkeletonText mt='4' noOfLines={1} spacing='4' skeletonHeight='4' rounded={'md'} />;
}

function BoxSkeleton() {
	return (
		<Skeleton height='15px' width='15px' ml='1rem'>
			<Box>LOREM</Box>
		</Skeleton>
	);
}

function ListSkeleton() {
	return (
		<Tr>
			<Td>
				<SkeletonCircle size='10' />
			</Td>
			<Td>
				<Skeleton height='125px' width='125px' ml='1rem'>
					<Box>LOREM</Box>
				</Skeleton>
			</Td>
			<Td>
				<LineSkeleton />
			</Td>

			<Td>
				<LineSkeleton />
			</Td>
			<Td>
				<LineSkeleton />
			</Td>
			<Td>
				<Flex>
					<BoxSkeleton />
					<BoxSkeleton />
				</Flex>
			</Td>
		</Tr>
	);
}

export default LinkShortener;
