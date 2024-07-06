import { LinkIcon } from '@chakra-ui/icons';
import {
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Flex,
	FormControl,
	FormHelperText,
	FormLabel,
	Input,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Textarea,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShortenerService from '../../../../services/shortener.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	addShortenLink,
	resetDetails,
	setLink,
	setLinkType,
	setMessage,
	setNumber,
	setSelectedLink,
	setShortingLink,
	setTitle,
} from '../../../../store/reducers/LinkShortenerReducer';

export type LinkDetailsDrawerHandle = {
	open: (id?: string) => void;
	close: () => void;
};

const LinkDetailsDrawer = forwardRef<LinkDetailsDrawerHandle>((_, ref) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const dispatch = useDispatch();
	const toast = useToast();

	useImperativeHandle(ref, () => ({
		open: (id?: string) => {
			if (!id) {
				dispatch(resetDetails());
			} else {
				dispatch(setSelectedLink(id));
			}
			onOpen();
		},
		close: () => {
			onClose();
		},
	}));

	const {
		details: { id, link, message, number, title, type },
		ui: { shortening_link },
	} = useSelector((state: StoreState) => state[StoreNames.LINK]);

	const generateQrCode = async () => {
		if (title === '') {
			toast({
				title: 'Title is required',
				status: 'error',
			});
			return;
		}

		if (type === 'whatsapp') {
			if (!number || !message) {
				toast({
					title: 'Number & Message is required',
					status: 'error',
				});
				return;
			}
		} else if (type === 'link' && !link) {
			toast({
				title: 'Link is required',
				status: 'error',
			});
			return;
		}
		const details = {
			type,
			title,
			number,
			message,
			link,
		};
		let promise;
		if (id) {
			promise = ShortenerService.updateShortenURL(id, details);
		} else {
			promise = ShortenerService.createShortenURL(details);
		}
		dispatch(setShortingLink(true));
		toast.promise(promise, {
			loading: { title: 'Generating link' },
			success: (data) => {
				dispatch(setShortingLink(false));
				dispatch(addShortenLink(data));
				onClose();
				return { title: 'Link generated successfully' };
			},
			error: () => {
				dispatch(setShortingLink(false));
				return { title: 'Error generating link' };
			},
		});
	};

	return (
		<Drawer isOpen={isOpen} placement='right' onClose={onClose} size={'lg'}>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>Shorten a Link</DrawerHeader>

				<DrawerBody>
					<Flex direction={'column'} alignSelf={'center'} gap={4} p={4} width={'full'} flex={1}>
						<FormControl>
							<FormLabel>Link Title</FormLabel>
							<Input
								placeholder='eg. Contact card'
								type='test'
								onChange={(e) => {
									dispatch(setTitle(e.target.value));
								}}
								value={title}
							/>
						</FormControl>

						<Tabs
							size='md'
							variant='enclosed'
							colorScheme='whatsapp'
							index={type === 'whatsapp' ? 0 : 1}
							onChange={(index) => dispatch(setLinkType(index === 0 ? 'whatsapp' : 'link'))}
						>
							<TabList>
								<Tab>Whatsapp</Tab>
								<Tab>Link</Tab>
							</TabList>
							<TabPanels border={'1px solid rgba(0,0,0,0.08)'}>
								<TabPanel>
									<FormControl>
										<FormLabel>What's your number?</FormLabel>
										<Input
											placeholder='eg. 91'
											type='number'
											name='number'
											onChange={(e) => {
												dispatch(setNumber(e.target.value));
											}}
											value={number}
										/>
										<FormHelperText fontSize={'xs'}>
											Make sure you include the country code followed by the area code eg. for india
											91, for UK 44
										</FormHelperText>
									</FormControl>
									<FormControl>
										<FormLabel>
											What message do you want your customer to see when they contact you?
										</FormLabel>
										<Textarea
											resize={'none'}
											name='message'
											onChange={(e) => {
												dispatch(setMessage(e.target.value));
											}}
											value={message}
											placeholder='Enter your message'
										/>
									</FormControl>
								</TabPanel>
								<TabPanel>
									<FormControl>
										<FormLabel>Enter Link to Shorten</FormLabel>
										<Input
											placeholder='Enter Link'
											name='text'
											onChange={(e) => {
												dispatch(setLink(e.target.value));
											}}
											value={link}
											type='url'
										/>
									</FormControl>
								</TabPanel>
							</TabPanels>
						</Tabs>

						<Button
							isLoading={shortening_link}
							width={'full'}
							leftIcon={<LinkIcon />}
							colorScheme='whatsapp'
							onClick={generateQrCode}
						>
							Shorten Link
						</Button>
					</Flex>
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
});

export default LinkDetailsDrawer;
