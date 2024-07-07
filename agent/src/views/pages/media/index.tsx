import { DeleteIcon, DownloadIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Card,
	CardBody,
	CardFooter,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	GridItem,
	HStack,
	IconButton,
	Skeleton,
	Switch,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	VStack,
	useBoolean,
	useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { IoMdCloudUpload } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useOutlet } from 'react-router-dom';
import APIInstance from '../../../config/APIInstance';
import { NAVIGATION, SERVER_URL } from '../../../config/const';
import usePermissions from '../../../hooks/usePermissions';
import MediaService from '../../../services/media.service';
import { StoreNames, StoreState } from '../../../store';
import { deleteMedia } from '../../../store/reducers/MediaReducer';
import { Media } from '../../../store/types/MediaState';
import { getFileSize } from '../../../utils/file-utils';
import DeleteAlert, { DeleteAlertHandle } from '../../components/delete-alert';
import Each from '../../components/utils/Each';
import Show from '../../components/utils/Show';
import Preview from './preview.component';

const MediaPage = () => {
	const dispatch = useDispatch();
	const outlet = useOutlet();
	const toast = useToast();
	const deleteDialogRef = useRef<DeleteAlertHandle>(null);
	const {
		media: { create: create_media, delete: delete_media, update: update_media },
	} = usePermissions();

	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);
	const {
		list,
		uiDetails: { isFetching },
	} = useSelector((state: StoreState) => state[StoreNames.MEDIA]);
	const [previewEnabled, setPreviewEnabled] = useBoolean(false);

	const handleDelete = async (id: string) => {
		toast.promise(MediaService.deleteMedia(selected_device_id, id), {
			success: () => {
				dispatch(deleteMedia(id));
				return {
					title: 'Media deleted',
				};
			},
			loading: { title: 'Deleting media' },
			error: { title: 'Error deleting media' },
		});
	};

	return (
		<Flex direction={'column'} padding={'1rem'} justifyContent={'start'}>
			<Flex width={'98%'} justifyContent={'space-between'} alignItems={'flex-end'}>
				<Text fontSize={'2xl'} fontWeight={'bold'}>
					Media
				</Text>
				<Show>
					<Show.When condition={create_media}>
						<Link to={`${NAVIGATION.APP}/${NAVIGATION.MEDIA}/new`}>
							<Button
								variant='outline'
								size={'sm'}
								colorScheme='green'
								leftIcon={<IoMdCloudUpload />}
							>
								Upload Media
							</Button>
						</Link>
					</Show.When>
				</Show>
			</Flex>

			<Box marginTop={'1rem'} width={'98%'} pb={'5rem'}>
				<Flex justifyContent={'flex-end'} alignItems={'center'} gap={6} mb={'1rem'}>
					<FormControl display={'inline-flex'} width={'fit-content'} alignItems='center'>
						<FormLabel htmlFor='email-alerts' mb='0'>
							Enable Preview
						</FormLabel>
						<Switch
							id='preview'
							isChecked={previewEnabled}
							onChange={() => setPreviewEnabled.toggle()}
						/>
					</FormControl>
					<Text textAlign={'right'}>{list.length} records found.</Text>
				</Flex>

				{previewEnabled ? (
					<Grid alignItems={'flex-start'} templateColumns='repeat(6, 1fr)' gap={6}>
						<Each
							items={list}
							render={(media) => (
								<GridItem>
									<PreviewElement
										media={media}
										onRemove={() => deleteDialogRef.current?.open(media.id)}
									/>
								</GridItem>
							)}
						/>
					</Grid>
				) : (
					<TableContainer width={'full'} border={'1px dashed gray'} rounded={'2xl'}>
						<Table variant='striped' colorScheme='gray'>
							<Thead>
								<Tr>
									<Th width={'5%'} isNumeric>
										S.No.
									</Th>
									<Th width={'60%'}>File Name</Th>
									<Th width={'15%'}>Type</Th>
									<Th width={'10%'}>Size</Th>
									<Show>
										<Show.When condition={update_media || delete_media}>
											<Th width={'10%'}>Action</Th>
										</Show.When>
									</Show>
								</Tr>
							</Thead>
							<Tbody>
								<Show>
									<Show.When condition={isFetching}>
										<Each
											items={Array.from({ length: 20 })}
											render={() => (
												<Tr>
													<Td colSpan={update_media || delete_media ? 5 : 4} textAlign={'center'}>
														<Skeleton height={'1.2rem'} />
													</Td>
												</Tr>
											)}
										/>
									</Show.When>
									<Show.When condition={list.length === 0}>
										<Tr>
											<Td colSpan={update_media || delete_media ? 5 : 4} textAlign={'center'}>
												No records found
											</Td>
										</Tr>
									</Show.When>
									<Show.Else>
										<Each
											items={list}
											render={(record, index) => (
												<Tr cursor={'pointer'}>
													<Td isNumeric>{index + 1}.</Td>
													<Td>{record.filename}</Td>
													<Td>{record.mime_type}</Td>
													<Td>{getFileSize(record.file_length)}</Td>
													<Td>
														<HStack>
															<Show>
																<Show.When condition={update_media}>
																	<a
																		href={`${SERVER_URL}media/${selected_device_id}/${record.id}/download`}
																		target='_blank'
																	>
																		<IconButton
																			aria-label='Preview'
																			icon={<DownloadIcon />}
																			color={'blue'}
																			border={'1px blue solid'}
																		/>
																	</a>
																</Show.When>
															</Show>
															<Show>
																<Show.When condition={delete_media}>
																	<IconButton
																		aria-label='Preview'
																		icon={<DeleteIcon />}
																		border={'1px red solid'}
																		color={'red'}
																		onClick={() => deleteDialogRef.current?.open(record.id)}
																	/>
																</Show.When>
															</Show>
														</HStack>
													</Td>
												</Tr>
											)}
										/>
									</Show.Else>
								</Show>
							</Tbody>
						</Table>
					</TableContainer>
				)}
			</Box>
			<DeleteAlert type={'Media'} ref={deleteDialogRef} onConfirm={handleDelete} />
			{outlet}
		</Flex>
	);
};

export default MediaPage;

function PreviewElement({ media, onRemove }: { media: Media; onRemove: () => void }) {
	const [data, setData] = useState<{
		blob: Blob | MediaSource | null;
		url: string | null;
		type: string;
		size: string;
		filename: string;
	} | null>(null);

	const [progress, setProgress] = useState(0);
	const {
		media: { delete: delete_media },
	} = usePermissions();
	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	useEffect(() => {
		if (!selected_device_id) return;

		APIInstance.head(`${SERVER_URL}${selected_device_id}/media/${media.id}/download`, {
			responseType: 'blob',
		}).then((response) => {
			const contentDisposition = response.headers['content-disposition'];
			const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.*)"/);
			const filename = filenameMatch ? filenameMatch[1] : 'downloaded-file';

			const fileType = response.headers['content-type'] as string;
			const fileSizeBytes = parseInt(response.headers['content-length'], 10);
			let type = '';
			if (fileType.includes('image')) {
				type = 'image';
			} else if (fileType.includes('video')) {
				type = 'video';
			} else if (fileType.includes('pdf')) {
				type = 'PDF';
			} else if (fileType.includes('audio')) {
				type = fileType;
			}

			const fileSizeKB = fileSizeBytes / 1024; // Convert bytes to kilobytes
			const fileSizeMB = fileSizeKB / 1024;
			setData({
				blob: null,
				url: null,
				type,
				size: fileSizeMB > 1 ? `${fileSizeMB.toFixed(2)} MB` : `${fileSizeKB.toFixed(2)} KB`,
				filename,
			});
		});
	}, [media, selected_device_id]);

	useEffect(() => {
		APIInstance.get(`${SERVER_URL}${selected_device_id}/media/${media.id}/download`, {
			responseType: 'blob',
			onDownloadProgress: (progressEvent) => {
				if (progressEvent.total) {
					setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
				} else {
					setProgress(-1);
				}
			},
		}).then((response) => {
			const contentDisposition = response.headers['content-disposition'];
			const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.*)"/);
			const filename = filenameMatch ? filenameMatch[1] : 'downloaded-file';

			const { data: blob } = response;
			const url = window.URL.createObjectURL(blob);
			const fileType = blob.type as string;
			const fileSizeBytes = blob.size as number;
			let type = '';

			if (fileType.includes('image')) {
				type = 'image';
			} else if (fileType.includes('video')) {
				type = 'video';
			} else if (fileType.includes('pdf')) {
				type = 'PDF';
			} else if (fileType.includes('audio')) {
				type = fileType;
			}

			const fileSizeKB = fileSizeBytes / 1024; // Convert bytes to kilobytes
			const fileSizeMB = fileSizeKB / 1024;
			setData({
				blob,
				url,
				type,
				size: fileSizeMB > 1 ? `${fileSizeMB.toFixed(2)} MB` : `${fileSizeKB.toFixed(2)} KB`,
				filename,
			});
		});
	}, [media, selected_device_id]);

	const download = () => {
		if (!data || !data.blob) {
			MediaService.downloadMedia(selected_device_id, media.id);
			return;
		}
		// Create a temporary link element
		const downloadLink = document.createElement('a');
		downloadLink.href = window.URL.createObjectURL(data.blob);
		downloadLink.download = data.filename; // Specify the filename

		// Append the link to the body and trigger the download
		document.body.appendChild(downloadLink);
		downloadLink.click();

		// Clean up - remove the link
		document.body.removeChild(downloadLink);
	};

	return (
		<Card size='sm' rounded={'2xl'}>
			<CardBody>
				<Preview data={data?.url ? { url: data.url, type: data.type } : null} progress={progress} />
			</CardBody>
			<Divider />
			<CardFooter>
				<VStack alignItems={'stretch'} width={'full'}>
					<Flex gap={'0.5rem'} alignItems={'center'}>
						<Text>File Type:</Text>
						<Text fontWeight={'medium'}>{data?.type}</Text>
					</Flex>
					<Flex gap={'0.5rem'} alignItems={'center'}>
						<Text>File Size:</Text>

						<Text fontWeight={'medium'}>{data?.size}</Text>
					</Flex>

					<Flex gap='2'>
						<Button
							leftIcon={<DownloadIcon />}
							variant='outline'
							colorScheme='green'
							onClick={download}
							flexGrow={1}
						>
							Download
						</Button>
						<Show>
							<Show.When condition={delete_media}>
								<IconButton
									aria-label='delete'
									icon={<DeleteIcon color={'red.400'} />}
									variant='unstyled'
									colorScheme='red'
									border={'1px red solid'}
									_hover={{
										bgColor: 'red.100',
									}}
									onClick={onRemove}
								/>
							</Show.When>
						</Show>
					</Flex>
				</VStack>
			</CardFooter>
		</Card>
	);
}
