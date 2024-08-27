import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { useFields } from '@/components/context/tags';
import MediaSelectorDialog from '@/components/elements/dialogs/media-selector';
import TemplatePreview from '@/components/elements/template-preview';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { chatbotSchema, templateBodySchema, templateHeaderSchema } from '@/schema/chatbot';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export default function LeadsTemplateMessageDialog({
	isOpen,
	onClose,
	form,
	template,
	template_body,
	header,
	index,
}: {
	isOpen: boolean;
	form: UseFormReturn<z.infer<typeof chatbotSchema>>;
	onClose: () => void;
	template_body: {
		variable_from: string;
		phonebook_data: string;
		fallback_value: string;
		custom_text: string;
	}[];
	header: {
		type: '' | 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
		media_id: string;
		link: string;
	};
	template: {
		components: any[];
	};
	index: number;
}) {
	let phonebook_fields = useFields();
	phonebook_fields = phonebook_fields.filter((field) => field.value !== 'all');

	const t_header = form.watch(`nurturing.${index}.template_header`);
	const t_body = form.watch(`nurturing.${index}.template_body`);
	const isHeaderValid = templateHeaderSchema.safeParse(t_header).success;
	const isBodyValid = templateBodySchema.safeParse(t_body).success;
	const handleSubmit = () => {
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<DialogContent className='sm:max-w-[425px] md:max-w-3xl lg:max-w-6xl h-full overflow-y-auto'>
				<DialogHeader>Leads Template Message</DialogHeader>
				<div className='flex flex-col lg:flex-row w-full justify-between gap-3'>
					<div className='flex flex-col lg:w-[70%] w-full space-y-2'>
						<p
							className='text-lg font-medium'
							hidden={
								!(
									(!!header && header.type !== 'TEXT' && header.type !== '') ||
									template_body.length > 0
								)
							}
						>
							Template details
						</p>
						<Show.ShowIf condition={!!header && header.type !== 'TEXT' && header.type !== ''}>
							<FormField
								name={`nurturing.${index}.template_header.media_id`}
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<div className='flex items-center gap-6'>
											<p className='font-medium'>
												Header Media<span className=' text-red-800'>*</span>:{' '}
											</p>
											<MediaSelectorDialog
												singleSelect
												selectedValue={field.value ? [field.value] : []}
												onConfirm={(media) => field.onChange(media[0])}
												returnType='media_id'
												type={
													header.type === 'IMAGE'
														? 'image'
														: header.type === 'VIDEO'
														? 'video'
														: 'document'
												}
											>
												<Button variant={'outline'}>Select Media</Button>
											</MediaSelectorDialog>
											<span>{field.value ? 'Media selected' : 'No media selected'}</span>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</Show.ShowIf>
						<Show.ShowIf condition={template_body.length > 0}>
							<Each
								items={template_body}
								render={(item, idx) => (
									<div className='flex flex-col'>
										<FormLabel>
											Variable value {idx + 1}
											<span className='ml-[0.2rem] text-red-800'>*</span>
										</FormLabel>
										<div className='flex gap-3 flex-col md:flex-row'>
											<FormField
												control={form.control}
												name={`nurturing.${index}.template_body.${idx}.variable_from`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1 max-w-xs'>
														<FormControl>
															<Select
																required
																onValueChange={field.onChange}
																defaultValue={field.value}
															>
																<FormControl>
																	<SelectTrigger>
																		<SelectValue placeholder='Data From' />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	<SelectItem value='phonebook_data'>Phonebook Data</SelectItem>
																	<SelectItem value='custom_text'>Custom Text</SelectItem>
																</SelectContent>
															</Select>
														</FormControl>
														<FormItem />
													</FormItem>
												)}
											/>
											<Show.ShowIf condition={item.variable_from === 'phonebook_data'}>
												<FormField
													control={form.control}
													name={`nurturing.${index}.template_body.${idx}.phonebook_data`}
													render={({ field }) => (
														<FormItem className='space-y-0 flex-1 max-w-xs'>
															<FormControl>
																<Select
																	required
																	onValueChange={field.onChange}
																	defaultValue={field.value}
																>
																	<FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder='Select Fields' />
																		</SelectTrigger>
																	</FormControl>
																	<SelectContent>
																		<Each
																			items={phonebook_fields}
																			render={(field) => (
																				<SelectItem value={field.value}>{field.label}</SelectItem>
																			)}
																		/>
																	</SelectContent>
																</Select>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name={`nurturing.${index}.template_body.${idx}.fallback_value`}
													render={({ field }) => (
														<FormItem className='space-y-0 flex-1'>
															<FormControl>
																<Input required placeholder='Fallback Value' {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</Show.ShowIf>

											<Show.ShowIf condition={item.variable_from === 'custom_text'}>
												<FormField
													control={form.control}
													name={`nurturing.${index}.template_body.${idx}.custom_text`}
													render={({ field }) => (
														<FormItem className='space-y-0 flex-1 max-w-lg'>
															<FormControl>
																<Input required placeholder='Value' {...field} />
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</Show.ShowIf>
										</div>
									</div>
								)}
							/>
						</Show.ShowIf>
					</div>
					<div className='w-full flex flex-col lg:w-[30%] justify-start items-start gap-3'>
						<Show.ShowIf condition={!!template}>
							<TemplatePreview components={template?.components ?? []} />
						</Show.ShowIf>
					</div>
				</div>
				<DialogFooter>
					<Button
						type='button'
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleSubmit();
						}}
						disabled={!isBodyValid || !isHeaderValid}
						variant='outline'
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
