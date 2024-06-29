/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useToast,
} from '@chakra-ui/react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UploadService from '../../../../services/upload.service';
import { StoreNames, StoreState } from '../../../../store';
import {
	setNurturingTemplateBody,
	setNurturingTemplateHeaderLink,
	setNurturingTemplateHeaderMediaId,
	setNurturingTemplateId,
} from '../../../../store/reducers/ChatBotReducer';
import TemplateComponentParameter from '../../../components/template-component-parameters';

export type NurtureMessageHandle = {
	open: ({ index, components }: { index: number; components: Record<string, any>[] }) => void;
};

const NurtureTemplateMessage = forwardRef<NurtureMessageHandle>((_, ref) => {
	const dispatch = useDispatch();
	const toast = useToast();

	const {
		details: { nurturing },
	} = useSelector((state: StoreState) => state[StoreNames.CHATBOT]);

	const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

	const [isOpen, setIsOpen] = useState(false);

	const [nurturingIndex, setNurturingIndex] = useState(0);

	const [nurturingHeaderFile, setNurturingHeaderFile] = useState<File | null>(null);

	const [components, setComponents] = useState<Record<string, any>[]>([]);

	useImperativeHandle(ref, () => ({
		open: ({ index, components }: { index: number; components: Record<string, any>[] }) => {
			setIsOpen(true);
			setNurturingIndex(index);
			setComponents(components);
		},
	}));

	const handleTemplateDetailsChange = ({
		headerLink,
		headerMediaId,
		body,
		headerFile,
	}: {
		headerLink: string;
		headerFile: File | null;
		headerMediaId: string;
		body?: {
			index: number;
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		};
	}) => {
		dispatch(setNurturingTemplateHeaderLink({ index: nurturingIndex, link: headerLink }));
		dispatch(setNurturingTemplateHeaderMediaId({ index: nurturingIndex, media_id: headerMediaId }));
		setNurturingHeaderFile(headerFile);
		if (body) dispatch(setNurturingTemplateBody({ index: nurturingIndex, body: body }));
	};

	const validate = () => {
		let notHasError = true;
		if (
			nurturing[nurturingIndex]?.template_header.type === 'IMAGE' ||
			nurturing[nurturingIndex]?.template_header.type === 'VIDEO' ||
			nurturing[nurturingIndex]?.template_header.type === 'DOCUMENT'
		) {
			if (
				!nurturing[nurturingIndex]?.template_header.link &&
				!nurturingHeaderFile &&
				!nurturing[nurturingIndex]?.template_header.media_id
			) {
				toast({
					title: 'Header is required',
					status: 'error',
				});
				notHasError = false;
			}
		}
		nurturing[nurturingIndex].template_body.map((body) => {
			if (body.variable_from === 'phonebook_data') {
				if (!body.phonebook_data) {
					toast({
						title: 'Phonebook data is required',
						status: 'error',
					});
					notHasError = false;
				}
				if (!body.fallback_value) {
					toast({
						title: 'Fallback value is required',
						status: 'error',
					});
					notHasError = false;
				}
			}
			if (body.variable_from === 'custom_text' && !body.custom_text) {
				toast({
					title: 'Custom text is required',
					status: 'error',
				});
				notHasError = false;
			}
		});

		return notHasError;
	};

	const handleClose = () => {
		setIsOpen(false);

		dispatch(setNurturingTemplateId({ index: nurturingIndex, template_id: '' }));
	};

	const handleSave = () => {
		if (!validate()) {
			return;
		}

		if (nurturingHeaderFile) {
			toast.promise(UploadService.generateMetaMediaId(selected_device_id, nurturingHeaderFile), {
				success: (media_id) => {
					dispatch(setNurturingTemplateHeaderMediaId({ index: nurturingIndex, media_id }));
					setIsOpen(false);
					return {
						title: 'File uploaded',
					};
				},
				error: {
					title: 'Failed to upload file',
				},
				loading: {
					title: 'Uploading file',
				},
			});
		} else {
			setIsOpen(false);
		}
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				size={'6xl'}
				closeOnOverlayClick={false}
				closeOnEsc={false}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Nurturing Message</ModalHeader>
					<ModalBody>
						<TemplateComponentParameter
							components={components}
							headerLink={nurturing[nurturingIndex]?.template_header?.link ?? ''}
							headerFile={nurturingHeaderFile}
							headerMediaId={nurturing[nurturingIndex]?.template_header?.media_id ?? ''}
							body={nurturing[nurturingIndex]?.template_body ?? []}
							header={
								nurturing[nurturingIndex]?.template_header ?? {
									type: 'TEXT',
									link: '',
									media_id: '',
								}
							}
							handleTemplateDetailsChange={handleTemplateDetailsChange}
						/>
					</ModalBody>
					<ModalFooter>
						<Button onClick={handleClose} variant={'outline'} colorScheme='red'>
							Cancel
						</Button>
						<Button colorScheme='green' ml={'1rem'} onClick={handleSave}>
							Save
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
});

export default NurtureTemplateMessage;
