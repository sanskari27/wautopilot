import { AddIcon } from '@chakra-ui/icons';
import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Text,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreNames, StoreState } from '../../../../store';
import {
	createEmptyNurturing,
	removeNurturing,
	setNurturingAfterType,
	setNurturingAfterValue,
	setNurturingEndAt,
	setNurturingStartFrom,
	setSelectedNurturingTemplate,
} from '../../../../store/reducers/ChatBotReducer';
import Each from '../../../components/utils/Each';
import NurtureTemplateMessage, { NurtureMessageHandle } from './NurtureTemplateMessage';

export type LeadsNurturingHandle = {
	open: () => void;
};

const LeadsNurturing = forwardRef<LeadsNurturingHandle>((_, ref) => {
	const toast = useToast();

	const nurturingMessageRef = useRef<NurtureMessageHandle>(null);

	const dispatch = useDispatch();

	const [isOpen, setIsOpen] = useState(false);

	const {
		details: { nurturing },
	} = useSelector((state: StoreState) => state[StoreNames.CHATBOT]);

	const { list: templateList } = useSelector((state: StoreState) => state[StoreNames.TEMPLATES]);

	const templateListFiltered = templateList.filter((t) => t.status === 'APPROVED');

	useImperativeHandle(ref, () => ({
		open: () => setIsOpen(true),
	}));

	const handleChange = (
		key: string,
		value: string,
		index: number,
		{ editTemplate = false }: { editTemplate?: boolean } = {
			editTemplate: false,
		}
	) => {
		if (key === 'value') {
			dispatch(setNurturingAfterValue({ index, value: value }));
		} else if (key === 'type') {
			dispatch(setNurturingAfterType({ index, type: value as 'minutes' | 'hours' | 'days' }));
		} else if (key === 'start_from') {
			dispatch(setNurturingStartFrom({ index, start_from: value }));
		} else if (key === 'end_at') {
			dispatch(setNurturingEndAt({ index, end_at: value }));
		} else if (key === 'template_id') {
			if (value === 'Select one!') return;
			const selectedTemplate = templateListFiltered.find((t) => t.id === value);
			if (!selectedTemplate) return;
			if (!editTemplate) {
				dispatch(setSelectedNurturingTemplate({ index, template: selectedTemplate }));
			}
			nurturingMessageRef.current?.open({
				index,
				components: selectedTemplate.components,
			});
		}
	};

	const handleClose = () => {
		let error = false;

		nurturing.map((item) => {
			if (item.template_id === '') {
				toast({
					title: 'Error',
					description: 'Please select a template',
					status: 'error',
				});
				error = true;
			}

			if (item.after.value === '') {
				toast({
					title: 'Error',
					description: 'Please fill the delay field',
					status: 'error',
				});
				error = true;
			}

			if (item.start_from === '' || item.end_at === '') {
				toast({
					title: 'Error',
					description: 'Please fill the start and end field',
					status: 'error',
				});
				error = true;
			}
		});
		if (error) return;
		setIsOpen(false);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			size={'3xl'}
			closeOnEsc={false}
			closeOnOverlayClick={false}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					<HStack justifyContent={'space-between'}>
						<Box>Nurturing</Box>
						<IconButton
							colorScheme='green'
							aria-label='Edit'
							icon={<AddIcon />}
							onClick={() => dispatch(createEmptyNurturing())}
						/>
					</HStack>
				</ModalHeader>
				<ModalBody>
					<Accordion allowToggle>
						<Each
							items={nurturing}
							render={(item, index) => (
								<AccordionItem key={index}>
									<h2>
										<AccordionButton>
											<Box as='span' flex='1' textAlign='left' fontSize={'1.25rem'}>
												Nurturing {index + 1}
											</Box>
											<AccordionIcon />
										</AccordionButton>
									</h2>
									<AccordionPanel pb={4}>
										<FormControl>
											<Flex alignItems={'center'} gap={'0.5rem'} width='full' flexWrap={'wrap'}>
												<Text fontSize={'lg'}>Send this message after </Text>
												<Input
													type='number'
													width={'100px'}
													textAlign={'right'}
													placeholder='Delay'
													value={item.after.value ?? ''}
													onChange={(e) => handleChange('value', e.target.value, index)}
												/>
												<Select
													value={item.after.type ?? 'min'}
													width={'max-content'}
													onChange={(e) => handleChange('type', e.target.value, index)}
												>
													<option value={'minutes'}>Minutes</option>
													<option value={'hours'}>Hours</option>
													<option value={'days'}>Days</option>
												</Select>
												<Text fontSize={'lg'}>from the previous message between</Text>
												<Input
													width={'fit-content'}
													type='time'
													value={item.start_from}
													onChange={(e) => handleChange('start_from', e.target.value, index)}
												/>
												<Text fontSize={'lg'}>to</Text>
												<Input
													width={'fit-content'}
													type='time'
													value={item.end_at}
													onChange={(e) => handleChange('end_at', e.target.value, index)}
												/>
											</Flex>
										</FormControl>
										<FormControl my={'1rem'}>
											<FormLabel mb={'0.25rem'}>Select Template</FormLabel>
											<Select
												placeholder='Select one!'
												value={item.template_id}
												onChange={(e) => handleChange('template_id', e.target.value, index)}
											>
												<Each
													items={templateListFiltered}
													render={(t) => <option value={t.id}>{t.name}</option>}
												/>
											</Select>
											{/* {ui.templateError && <FormErrorMessage>{ui.templateError}</FormErrorMessage>} */}
										</FormControl>
										<HStack justifyContent={'space-between'} mt={'1rem'}>
											<Button
												aria-label='edit-nurturing'
												variant={'outline'}
												colorScheme='green'
												onClick={() => {
													handleChange('template_id', item.template_id, index, {
														editTemplate: true,
													});
												}}
											>
												Edit Template
											</Button>
											<Button
												aria-label='add-nurturing'
												variant={'outline'}
												colorScheme='red'
												onClick={() => dispatch(removeNurturing(index))}
											>
												Delete
											</Button>
										</HStack>
									</AccordionPanel>
								</AccordionItem>
							)}
						/>
					</Accordion>
					<NurtureTemplateMessage ref={nurturingMessageRef} />
				</ModalBody>
				<ModalFooter>
					<Button ml={'1rem'} colorScheme='green' onClick={handleClose}>
						Save
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
});

export default LeadsNurturing;
