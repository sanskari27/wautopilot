import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Checkbox,
	Flex,
	HStack,
	Image,
	Skeleton,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExtrasService from '../../../../services/extras.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	setTestimonialAdding,
	setTestimonialList,
} from '../../../../store/reducers/TestimonialReducer';
import { Testimonial } from '../../../../store/types/Testimonials';
import Each from '../../../components/utils/Each';
import CreateTestimonialDialog, { TestimonialHandle } from './CreateTestimonialsDialog';

export default function TestimonialsPage() {
	const testimonialDialogRef = useRef<TestimonialHandle>(null);

	const dispatch = useDispatch();
	const toast = useToast();

	const [selectedTestimonial, setSelectedTestimonial] = useState<number[]>([]);

	const {
		list,
		details,
		ui: { isLoading, isAdding },
	} = useSelector((state: StoreState) => state[StoreNames.TESTIMONIAL]);

	const handleDeleteFAQ = () => {
		const filteredList = list.filter((_, i) => !selectedTestimonial.includes(i));
		const promise = ExtrasService.createTestimonials(filteredList);

		toast.promise(promise, {
			loading: { title: 'Deleting Testimonial' },
			success: () => {
				dispatch(setTestimonialList(filteredList));
				setSelectedTestimonial([]);
				return {
					title: 'Testimonial Deleted',
					status: 'success',
				};
			},
			error: () => {
				return {
					title: 'Error while deleting Testimonial',
				};
			},
		});
	};

	const handleTestimonialsSave = (
		details: {
			title: string;
			name: string;
			photo_url: string;
			description: string;
		},
		index?: number
	) => {
		let promise;
		let newList: Testimonial[] = [];
		dispatch(setTestimonialAdding(true));
		if (index !== undefined) {
			newList = list.map((item, i) => {
				if (i === index) {
					return details;
				}
				return item;
			});
			promise = ExtrasService.createTestimonials(newList);
		} else {
			newList = [...list, details];
			promise = ExtrasService.createTestimonials(newList);
		}

		toast.promise(promise, {
			loading: { title: 'Creating Testimonial' },
			success: () => {
				dispatch(setTestimonialList(newList));
				return {
					title: 'Testimonial Created',
					status: 'success',
				};
			},
			error: () => {
				return {
					title: 'Error while saving Testimonial',
				};
			},
		});

		dispatch(setTestimonialAdding(false));
	};

	return (
		<Flex direction={'column'}>
			<HStack justifyContent={'flex-end'}>
				<Button
					colorScheme='red'
					variant={'outline'}
					leftIcon={<DeleteIcon />}
					onClick={handleDeleteFAQ}
					isDisabled={selectedTestimonial.length === 0}
				>
					Delete
				</Button>
				<Button
					colorScheme='green'
					variant={'outline'}
					leftIcon={<AddIcon />}
					onClick={() => testimonialDialogRef.current?.open(details)}
					isDisabled={isAdding}
				>
					Create Testimonial
				</Button>
			</HStack>
			<TableContainer rounded={'2xl'} borderStyle={'dashed'} borderWidth={'2px'} mt={'1rem'}>
				<Table>
					<Thead>
						<Tr>
							<Th width={'5%'}>
								<Checkbox
									mr={'0.5rem'}
									onChange={(e) => {
										if (e.target.checked) {
											setSelectedTestimonial(list.map((_, i) => i));
										} else {
											setSelectedTestimonial([]);
										}
									}}
									isChecked={selectedTestimonial.length === list.length && list.length > 0}
									isIndeterminate={
										selectedTestimonial.length > 0 && selectedTestimonial.length < list.length
									}
								/>
								Sl. no.
							</Th>
							<Th width={'10%'}>Title</Th>
							<Th width={'20%'}>Name</Th>
							<Th width={'50%'}>Description</Th>
							<Th width={'15%'}>Image</Th>
						</Tr>
					</Thead>
					<Tbody>
						{isLoading ? (
							<Tr>
								<Td colSpan={5}>
									<Skeleton height={'50px'} width={'100%'} />
								</Td>
							</Tr>
						) : list.length === 0 ? (
							<Tr>
								<Td colSpan={5}>
									<Box width={'full'} p={'1rem'}>
										<Text fontSize={'xl'} fontWeight={'bold'}>
											No Testimonials found
										</Text>
									</Box>
								</Td>
							</Tr>
						) : (
							<Each
								items={list}
								render={(item, index) => (
									<Tr key={item.title}>
										<Td>
											<Checkbox
												mr={'0.5rem'}
												onChange={(e) => {
													if (e.target.checked) {
														setSelectedTestimonial((prev) => [...prev, index]);
													} else {
														setSelectedTestimonial((prev) => prev.filter((i) => i !== index));
													}
												}}
												isChecked={selectedTestimonial.includes(list.indexOf(item))}
											/>
											{list.indexOf(item) + 1}
										</Td>
										<Td
											onClick={() => testimonialDialogRef.current?.open(item, index)}
											cursor={'pointer'}
										>
											{item.title}
										</Td>
										<Td
											onClick={() => testimonialDialogRef.current?.open(item, index)}
											cursor={'pointer'}
										>
											{item.name}
										</Td>
										<Td
											onClick={() => testimonialDialogRef.current?.open(item, index)}
											cursor={'pointer'}
										>
											{item.description}
										</Td>
										<Td
											onClick={() => testimonialDialogRef.current?.open(item, index)}
											cursor={'pointer'}
										>
											<Image src={item.photo_url} alt={item.title} height={'full'} />
										</Td>
									</Tr>
								)}
							/>
						)}
					</Tbody>
				</Table>
			</TableContainer>
			<CreateTestimonialDialog ref={testimonialDialogRef} onConfirm={handleTestimonialsSave} />
		</Flex>
	);
}
