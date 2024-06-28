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
import { setNurturingTemplateId } from '../../../../store/reducers/ChatBotReducer';
import { countOccurrences } from '../../../../utils/templateHelper';
import TemplateComponentParameter from '../../../components/template-component-parameters';

export type NurtureMessageHandle = {
	open: ({
		index,
		templateId,
		components,
	}: {
		index: number;
		templateId: string;
		components: Record<string, any>[];
	}) => void;
};

type NurturingMessageProps = {
	onConfirm: (nurturing: {
		index: number;
		template_id: string;
		template_body: {
			custom_text: string;
			phonebook_data: string;
			variable_from: 'custom_text' | 'phonebook_data';
			fallback_value: string;
		}[];
		template_header: {
			type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
			link: string;
			media_id: string;
		};
	}) => void;
};

const NurtureTemplateMessage = forwardRef<NurtureMessageHandle, NurturingMessageProps>(
	({ onConfirm }, ref) => {
		const dispatch = useDispatch();
		const toast = useToast();

		const { selected_device_id } = useSelector((state: StoreState) => state[StoreNames.USER]);

		const [isOpen, setIsOpen] = useState(false);

		const [nurturing, setNurturing] = useState<{
			index: number;
			components: Record<string, any>[];
			template_id: string;
			template_body: {
				custom_text: string;
				phonebook_data: string;
				variable_from: 'custom_text' | 'phonebook_data';
				fallback_value: string;
			}[];
			template_header: {
				type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
				link: string;
				media_id: string;
				file: File | null;
			};
			error: {
				headerError: string;
				bodyError: string;
			};
		}>({
			index: 0,
			components: [],
			template_id: '',
			template_body: [],
			template_header: {
				type: 'TEXT' as 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT',
				link: '',
				media_id: '',
				file: null,
			},
			error: {
				bodyError: '',
				headerError: '',
			},
		});

		useImperativeHandle(ref, () => ({
			open: ({
				index,
				templateId,
				components,
			}: {
				index: number;
				templateId: string;
				components: Record<string, any>[];
			}) => {
				setIsOpen(true);
				const header = components.find((component) => component.type === 'HEADER');
				const body = components.find((c) => c.type === 'BODY');
				const variables = countOccurrences(body?.text ?? '');

				setNurturing((prev) => ({
					...prev,
					index,
					template_id: templateId,
					template_header: {
						type: header?.format || 'TEXT',
						link: '',
						media_id: '',
						file: null,
					},
					components,
					template_body: Array.from({ length: variables }).map(() => ({
						custom_text: '',
						phonebook_data: '',
						variable_from: 'custom_text',
						fallback_value: '',
					})),
				}));
			},
		}));

		const handleTemplateDetailsChange = ({
			headerLink,
			body,
			headerFile,
		}: {
			headerLink: string;
			headerFile: File | null;
			body?: {
				index: number;
				custom_text: string;
				phonebook_data: string;
				variable_from: 'custom_text' | 'phonebook_data';
				fallback_value: string;
			};
		}) => {
			setNurturing((prev) => ({
				...prev,
				template_header: {
					...prev.template_header,
					link: headerLink,
					file: headerFile,
				},
				template_body: prev.template_body.map((b, i) => {
					if (body && body.index === i) {
						return {
							...b,
							...body,
						};
					}
					return b;
				}),
			}));
		};

		const validate = () => {
			let notHasError = true;
			if (
				nurturing.template_header.type === 'IMAGE' ||
				nurturing.template_header.type === 'VIDEO' ||
				nurturing.template_header.type === 'DOCUMENT'
			) {
				if (!nurturing.template_header.link && !nurturing.template_header.file) {
					setNurturing((prev) => {
						return {
							...prev,
							error: {
								...prev.error,
								headerError: 'Header link or file is required',
							},
						};
					});
					notHasError = false;
				} else {
					setNurturing((prev) => {
						return {
							...prev,
							error: {
								...prev.error,
								headerError: '',
							},
						};
					});
				}
			}
			nurturing.template_body.map((body) => {
				if (body.variable_from === 'phonebook_data') {
					if (!body.phonebook_data) {
						setNurturing((prev) => {
							return {
								...prev,
								error: {
									...prev.error,
									bodyError: 'Phonebook Data is required',
								},
							};
						});
						notHasError = false;
					} else {
						setNurturing((prev) => {
							return {
								...prev,
								error: {
									...prev.error,
									bodyError: '',
								},
							};
						});
					}
					if (!body.fallback_value) {
						setNurturing((prev) => {
							return {
								...prev,
								error: {
									...prev.error,
									bodyError: 'Fallback value is required',
								},
							};
						});
						notHasError = false;
					} else {
						setNurturing((prev) => {
							return {
								...prev,
								error: {
									...prev.error,
									bodyError: '',
								},
							};
						});
					}
				}
				if (body.variable_from === 'custom_text' && !body.custom_text) {
					setNurturing((prev) => {
						return {
							...prev,
							error: {
								...prev.error,
								bodyError: 'Custom Text is required',
							},
						};
					});
					notHasError = false;
				} else {
					setNurturing((prev) => {
						return {
							...prev,
							error: {
								...prev.error,
								bodyError: '',
							},
						};
					});
				}
			});

			return notHasError;
		};

		const handleClose = () => {
			setIsOpen(false);

			dispatch(setNurturingTemplateId({ index: nurturing.index, template_id: '' }));

			setNurturing({
				index: 0,
				components: [],
				template_id: '',
				template_body: [],
				template_header: {
					type: 'TEXT' as 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT',
					link: '',
					media_id: '',
					file: null,
				},
				error: {
					bodyError: '',
					headerError: '',
				},
			});
		};

		const returnData = (media_id?: string) => {
			const returnNurturingData = {
				index: nurturing.index,
				template_id: nurturing.template_id,
				template_body: nurturing.template_body.map((body) => {
					return {
						custom_text: body.custom_text,
						phonebook_data: body.phonebook_data,
						variable_from: body.variable_from,
						fallback_value: body.fallback_value,
					};
				}),
				template_header: {
					type: nurturing.template_header.type,
					link: nurturing.template_header.link,
					media_id: media_id ?? '',
				},
			};
			onConfirm(returnNurturingData);
			setIsOpen(false);
		};

		const handleSave = () => {
			if (!validate()) {
				console.log(nurturing.error);
				return;
			}

			if (nurturing.template_header.file) {
				toast.promise(
					UploadService.generateMetaMediaId(selected_device_id, nurturing.template_header.file),
					{
						success: (media_id) => {
							returnData(media_id);
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
					}
				);
			} else {
				returnData();
			}
		};

		return (
			<>
				<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size={'4xl'}>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>Nurturing Message</ModalHeader>
						<ModalBody>
							<TemplateComponentParameter
								components={nurturing.components}
								headerLink={nurturing.template_header.link}
								headerFile={null}
								body={nurturing.template_body}
								error={nurturing.error}
								handleTemplateDetailsChange={handleTemplateDetailsChange}
							/>
						</ModalBody>
						<ModalFooter>
							<Button onClick={handleClose} variant={'outline'} colorScheme='red'>
								Close
							</Button>
							<Button colorScheme='green' ml={'1rem'} onClick={handleSave}>
								Save
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</>
		);
	}
);

export default NurtureTemplateMessage;
