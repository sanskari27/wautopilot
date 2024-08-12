'use client';

import Each from '@/components/containers/each';
import { useTemplates } from '@/components/context/templates';
import TemplateSelector from '@/components/elements/templetes-selector';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import useBoolean from '@/hooks/useBoolean';
import { countOccurrences } from '@/lib/utils';
import { chatbotSchema, nurturingSchema } from '@/schema/chatbot';
import { ChatBot } from '@/schema/chatbot';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Trash } from 'lucide-react';
import React from 'react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import LeadsTemplateMessageDialog from './leads-template-message';

const DEFAULT_NURTURING = {
	after: {
		value: '1',
		type: 'minutes',
	},
	start_from: '00:01',
	end_at: '23:59',
	template_body: [],
	template_header: {
		type: '',
		link: '',
		media_id: '',
	},
	template_id: '',
	template_name: '',
} as {
	after: {
		value: string;
		type: 'minutes' | 'hours' | 'days';
	};
	start_from: string;
	end_at: string;
	template_body: {
		variable_from: 'custom_text' | 'phonebook_data';
		phonebook_data: string;
		fallback_value: string;
		custom_text: string;
	}[];
	template_header: {
		type: '' | 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
		media_id: string;
		link: string;
	};
	template_id: string;
	template_name: string;
};

export default function LeadNurturingDialog({
	children,
	form,
	nurturing,
}: {
	form: UseFormReturn<z.infer<typeof chatbotSchema>>;
	children: React.ReactNode;
	nurturing: ChatBot['nurturing'];
}) {
	const templates = useTemplates();

	const {
		value: isTemplateOpen,
		on: openTemplateDialog,
		off: closeTemplateDialog,
	} = useBoolean(false);
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'nurturing',
	});

	const isNurturingValid = nurturingSchema.safeParse(nurturing).success;

	const handleTemplateChange = (details: { id: string; name: string } | null, index: number) => {
		if (!details) {
			return;
		}
		const template = templates.find((t) => t.id === details.id);
		const body = template?.components.find((c) => c.type === 'BODY');
		const variables = countOccurrences(body?.text ?? '');
		const header = template?.components.find((c) => c.type === 'HEADER');
		form.setValue(`nurturing.${index}.template_id`, details.id);
		form.setValue(`nurturing.${index}.template_name`, details.name);
		form.setValue(
			`nurturing.${index}.template_body`,
			Array.from({ length: variables }).map(() => ({
				custom_text: '',
				phonebook_data: '',
				variable_from: 'custom_text' as 'custom_text' | 'phonebook_data',
				fallback_value: '',
			}))
		);
		form.setValue(`nurturing.${index}.template_header`, {
			type: header?.format ?? '',
			link: '',
			media_id: '',
		});

		openTemplateDialog();
	};

	const selectTemplate = (index: number) => {
		return templates.find((t) => t.id === form.getValues(`nurturing.${index}.template_id`));
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-xl'>
				<DialogHeader>
					<DialogTitle>Lead Nurturing</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<Button type='button' className='w-full' onClick={() => append(DEFAULT_NURTURING)}>
						Add
					</Button>
				</DialogDescription>
				<Accordion type='single' collapsible className='w-full'>
					<Each
						items={fields}
						render={(item, index) => (
							<>
								<AccordionItem value={`${index}`}>
									<AccordionTrigger>Nurturing {index + 1}</AccordionTrigger>
									<AccordionContent>
										<Separator className='my-2' />
										<div className='flex justify-start flex-wrap gap-2 items-center'>
											<div className='w-max flex-1'>Send this message after</div>
											<div className='flex-1'>
												<FormField
													control={form.control}
													name={`nurturing.${index}.after.value`}
													render={({ field }) => (
														<FormControl>
															<Input {...field} type='number' />
														</FormControl>
													)}
												/>
											</div>
											<div>
												<FormField
													control={form.control}
													name={`nurturing.${index}.after.type`}
													render={({ field }) => (
														<FormControl>
															<Select
																value={field.value}
																onValueChange={(value) => field.onChange(value)}
															>
																<SelectTrigger>
																	<SelectValue />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value='minutes'>Minutes</SelectItem>
																	<SelectItem value='hours'>Hours</SelectItem>
																	<SelectItem value='days'>Days</SelectItem>
																</SelectContent>
															</Select>
														</FormControl>
													)}
												/>
											</div>
										</div>
										<div className='flex justify-start flex-wrap gap-2 items-center'>
											<div className='flex-2'>from the previous between</div>
											<div className='flex-1'>
												<FormField
													control={form.control}
													name={`nurturing.${index}.start_from`}
													render={({ field }) => (
														<FormControl>
															<Input {...field} type='time' />
														</FormControl>
													)}
												/>
											</div>
											<div className='flex-1'>
												<FormField
													control={form.control}
													name={`nurturing.${index}.end_at`}
													render={({ field }) => (
														<FormControl>
															<Input {...field} type='time' />
														</FormControl>
													)}
												/>
											</div>
										</div>
										<div className='my-4'>
											<FormField
												name={`nurturing.${index}.template_name`}
												control={form.control}
												render={({ field }) => (
													<FormItem>
														<FormControl>
															<TemplateSelector
																onChange={(value) => handleTemplateChange(value, index)}
																value={field.value}
																placeholder='Select Template'
															/>
														</FormControl>
													</FormItem>
												)}
											/>
										</div>
										<LeadsTemplateMessageDialog
											header={form.watch(`nurturing.${index}.template_header`)}
											template_body={form.watch(`nurturing.${index}.template_body`)}
											form={form}
											isOpen={isTemplateOpen}
											onClose={closeTemplateDialog}
											template={
												selectTemplate(index) ?? {
													components: [],
												}
											}
											index={index}
										/>
										<div className='flex justify-between mt-4'>
											<Button variant={'outline'} onClick={openTemplateDialog}>
												Edit Template
											</Button>

											<Button variant={'destructive'} size={'icon'} onClick={() => remove(index)}>
												<Trash className='w-4 h-4' />
											</Button>
										</div>
									</AccordionContent>
								</AccordionItem>
							</>
						)}
					/>
				</Accordion>

				<DialogFooter>
					<DialogClose asChild>
						<Button disabled={!isNurturingValid}>Save</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
