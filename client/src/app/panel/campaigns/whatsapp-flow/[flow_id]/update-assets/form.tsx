'use client';
import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { TWhatsappFlow, whatsappFlowSchema } from '@/schema/whatsapp-flow';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Airplay,
	ALargeSmall,
	CalendarDays,
	ChevronDown,
	CircleDot,
	GripVertical,
	Heading1,
	Heading2,
	Heading3,
	Heading4,
	Image as ImageIcon,
	Images,
	RocketIcon,
	SquareCheck,
	SquareMenu,
	SquareStack,
	TextSelect,
	ToggleRight,
	Trash,
	Type,
	WholeWord,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';
import { saveWhatsappFlowContents } from '../../action';
import PreviewFlowContents from './preview';

const DEFAULT_VALUES = {
	large_heading: {
		type: 'TextHeading',
		text: 'Large Heading',
	},
	small_heading: {
		type: 'TextSubheading',
		text: 'Small Heading',
	},
	body: {
		type: 'TextBody',
		text: 'Body',
	},
	caption: {
		type: 'TextCaption',
		text: 'Caption',
	},
	image: {
		type: 'Image',
		src: 'https://via.placeholder.com/150',
	},
	text_input: {
		type: 'TextInput',
		name: 'text_input',
		label: 'Text Input',
		required: false,
		'input-type': 'text',
		'helper-text': '',
	},
	textarea: {
		type: 'TextArea',
		name: 'textarea',
		label: 'Textarea',
		required: false,
		'helper-text': '',
	},
	date_picker: {
		type: 'DatePicker',
		name: 'date_picker',
		label: 'Date Picker',
		required: false,
		'helper-text': '',
	},
	single_choice: {
		type: 'RadioButtonsGroup',
		name: 'single_choice',
		label: 'Single Choice',
		required: false,
		'data-source': ['Option 1', 'Option 2'],
	},
	multiple_choice: {
		type: 'CheckboxGroup',
		name: 'multiple_choice',
		label: 'Multiple Choice',
		required: false,
		'data-source': ['Option 1', 'Option 2'],
	},
	dropdown: {
		type: 'Dropdown',
		name: 'dropdown',
		label: 'Dropdown',
		required: false,
		'data-source': ['Option 1', 'Option 2'],
	},
	opt_in: {
		type: 'OptIn',
		name: 'opt_in',
		label: 'Opt-in',
		required: false,
	},
};

export default function ContentsForm({
	contents,
	editable,
	id,
}: {
	id: string;
	contents: TWhatsappFlow;
	editable: boolean;
}) {
	const router = useRouter();
	const [currentScreen, setCurrentScreen] = useState<number>(0);
	const form = useForm<TWhatsappFlow>({
		resolver: zodResolver(whatsappFlowSchema),
		defaultValues: {
			screens: contents.screens,
		},
		mode: 'onChange',
	});

	const { append: addScreen, remove: removeScreen } = useFieldArray({
		control: form.control,
		name: 'screens',
	});

	const screens = form.watch('screens');

	function addField(screenIndex: number, type: keyof typeof DEFAULT_VALUES) {
		const screens = form.getValues('screens');
		if (screens.length === 0 || screens[screenIndex].children.length >= 8) {
			return;
		}

		const children = form.getValues(`screens.${screenIndex}.children`);
		const withoutFooter = children.filter((child) => child.type !== 'Footer');
		const footer = children.find((child) => child.type === 'Footer');
		form.setValue(`screens.${screenIndex}.children`, [
			...withoutFooter,
			DEFAULT_VALUES[type],
			...(footer ? [footer] : []),
		] as any);
	}

	function handleSave(data: TWhatsappFlow) {
		toast.promise(saveWhatsappFlowContents(id, data), {
			loading: 'Saving flow contents...',
			success: () => {
				router.push(`/panel/campaigns/whatsapp-flow`);
				return 'Flow contents saved successfully';
			},
			error: 'Failed to save flow contents',
		});
	}

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSave)} className='mt-3'>
					<div className='justify-between flex'>
						<h2 className='text-2xl font-bold'>Whatsapp Flow Contents</h2>
						<Button size={'sm'} type='submit' disabled={!form.formState.isValid || !editable}>
							Save
						</Button>
					</div>
					<div className='flex flex-wrap mt-3'>
						<Show.ShowIf condition={!editable}>
							<Alert className='mb-3'>
								<RocketIcon className='h-4 w-4' />
								<AlertTitle>Flow already published</AlertTitle>
								<AlertDescription>
									You can only edit the flow contents if it&apos;s in draft state.
								</AlertDescription>
							</Alert>
						</Show.ShowIf>
						<div className='w-full flex-1 flex gap-6'>
							<div className='flex flex-col max-w-md gap-3 w-full'>
								<div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant='outline' className='w-full'>
												Add Contents
												<ChevronDown className='w-4 h-4 ml-2' />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className='w-56'>
											<DropdownMenuGroup>
												<DropdownMenuItem
													onClick={() =>
														addScreen({
															title: `Screen ${screens.length + 1}`,
															children: [{ type: 'Footer', label: 'Continue' }],
														})
													}
												>
													<Airplay className='w-4 h-4 mr-2' />
													Add Screen
												</DropdownMenuItem>
											</DropdownMenuGroup>
											<Show.ShowIf condition={screens.length > 0}>
												<DropdownMenuSeparator />
												<DropdownMenuGroup>
													<DropdownMenuSub>
														<DropdownMenuSubTrigger>
															<ALargeSmall className='w-4 h-4 mr-2' />
															Text
														</DropdownMenuSubTrigger>
														<DropdownMenuPortal>
															<DropdownMenuSubContent>
																<DropdownMenuItem
																	onClick={() => addField(currentScreen, 'large_heading')}
																>
																	<Heading1 className='w-4 h-4 mr-2' />
																	Large Heading
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() => addField(currentScreen, 'large_heading')}
																>
																	<Heading2 className='w-4 h-4 mr-2' />
																	Small Heading
																</DropdownMenuItem>
																<DropdownMenuItem onClick={() => addField(currentScreen, 'body')}>
																	<Heading3 className='w-4 h-4 mr-2' />
																	Body
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() => addField(currentScreen, 'caption')}
																>
																	<Heading4 className='w-4 h-4 mr-2' />
																	Caption
																</DropdownMenuItem>
															</DropdownMenuSubContent>
														</DropdownMenuPortal>
													</DropdownMenuSub>
													<DropdownMenuSub>
														<DropdownMenuSubTrigger>
															<Images className='w-4 h-4 mr-2' />
															Media
														</DropdownMenuSubTrigger>
														<DropdownMenuPortal>
															<DropdownMenuSubContent>
																<DropdownMenuItem onClick={() => addField(currentScreen, 'image')}>
																	<ImageIcon className='w-4 h-4 mr-2' />
																	Image
																</DropdownMenuItem>
															</DropdownMenuSubContent>
														</DropdownMenuPortal>
													</DropdownMenuSub>
												</DropdownMenuGroup>
												<DropdownMenuSeparator />
												<DropdownMenuGroup>
													<DropdownMenuSub>
														<DropdownMenuSubTrigger>
															<Type className='w-4 h-4 mr-2' />
															Text Answer
														</DropdownMenuSubTrigger>
														<DropdownMenuPortal>
															<DropdownMenuSubContent>
																<DropdownMenuItem
																	onClick={() => addField(currentScreen, 'text_input')}
																>
																	<WholeWord className='w-4 h-4 mr-2' />
																	Short Answer
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() => addField(currentScreen, 'textarea')}
																>
																	<TextSelect className='w-4 h-4 mr-2' />
																	Paragraph
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() => addField(currentScreen, 'date_picker')}
																>
																	<CalendarDays className='w-4 h-4 mr-2' />
																	Date Picker
																</DropdownMenuItem>
															</DropdownMenuSubContent>
														</DropdownMenuPortal>
													</DropdownMenuSub>
													<DropdownMenuSub>
														<DropdownMenuSubTrigger>
															<SquareMenu className='w-4 h-4 mr-2' />
															Selection
														</DropdownMenuSubTrigger>
														<DropdownMenuPortal>
															<DropdownMenuSubContent>
																<DropdownMenuItem
																	onClick={() => addField(currentScreen, 'single_choice')}
																>
																	<CircleDot className='w-4 h-4 mr-2' />
																	Single Selection
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() => addField(currentScreen, 'multiple_choice')}
																>
																	<SquareCheck className='w-4 h-4 mr-2' />
																	Multiple Selection
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() => addField(currentScreen, 'dropdown')}
																>
																	<SquareStack className='w-4 h-4 mr-2' />
																	Dropdown
																</DropdownMenuItem>
																<DropdownMenuItem onClick={() => addField(currentScreen, 'opt_in')}>
																	<ToggleRight className='w-4 h-4 mr-2' />
																	Opt-in
																</DropdownMenuItem>
															</DropdownMenuSubContent>
														</DropdownMenuPortal>
													</DropdownMenuSub>
												</DropdownMenuGroup>
											</Show.ShowIf>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
								<div className='flex flex-col gap-3'>
									<Each
										items={screens}
										render={(item, index) => (
											<div
												onClick={() => setCurrentScreen(index)}
												className={cn(
													'flex justify-between items-center bg-gray-100 px-3 py-2 rounded-md text-sm',
													currentScreen === index && 'bg-primary text-white font-medium'
												)}
											>
												<span className='flex-1'>{item.title}</span>
												<Trash
													onClick={(e) => {
														e.stopPropagation();
														currentScreen === index && setCurrentScreen(0);
														removeScreen(index);
													}}
													className={cn(
														'w-4 h-4',
														currentScreen === index ? 'text-white' : 'text-destructive'
													)}
												/>
											</div>
										)}
									/>
								</div>
							</div>
							<div className='flex-1 min-w-[500px]'>
								<div className='w-[500px] border-dashed border border-gray-400 p-4 rounded-2xl'>
									<Show.ShowIf condition={screens.length > 0}>
										<ContentEditor screenIndex={currentScreen} form={form} />
									</Show.ShowIf>
								</div>
							</div>
						</div>
						<div className='max-w-md w-full'>
							<PreviewFlowContentsWrapper form={form} index={currentScreen} />
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}

function ContentEditor({
	screenIndex,
	form,
}: {
	screenIndex: number;
	form: UseFormReturn<TWhatsappFlow>;
}) {
	const { remove: removeChild } = useFieldArray({
		control: form.control,
		name: `screens.${screenIndex}.children`,
	});

	const { children, title } = form.watch(`screens.${screenIndex}`);

	return (
		<>
			<FormField
				control={form.control}
				name={`screens.${screenIndex}.title`}
				render={({ field }) => (
					<FormItem className='space-y-0 flex-1 max-w-md'>
						<FormLabel className='text-primary'>Screen Title</FormLabel>
						<FormControl>
							<Input placeholder='eg. Screen 1' value={title} onChange={field.onChange} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			<div className='flex flex-col gap-3 mt-6'>
				<Each
					items={children ?? []}
					id={(t, index) => `${screenIndex}-${t.type}-${index}`}
					render={(content, index) => {
						if (
							content.type === 'TextHeading' ||
							content.type === 'TextSubheading' ||
							content.type === 'TextBody' ||
							content.type === 'TextCaption'
						) {
							return (
								<div className='max-w-md rounded-md overflow-hidden bg-primary/20 p-2'>
									<Collapse
										trigger={
											<div className=' text-sm inline-flex items-center justify-between w-full'>
												<GripVertical className='w-4 h-4 mr-2' />
												<p className='flex-1'>{content.type.substring(4)}</p>
												<span className='ml-auto'>
													<ChevronDown className='w-4 h-4' />
												</span>
											</div>
										}
									>
										<div className='bg-white rounded-lg py-4 mt-2 gap-2 flex flex-col w-full'>
											<FormField
												control={form.control}
												name={`screens.${screenIndex}.children.${index}.type`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1 max-w-md px-4'>
														<FormControl>
															<Select onValueChange={field.onChange} defaultValue={field.value}>
																<SelectTrigger>
																	<SelectValue placeholder='Select Type' />
																</SelectTrigger>
																<SelectContent>
																	<SelectGroup>
																		<SelectItem value='TextHeading'>Heading</SelectItem>
																		<SelectItem value='TextSubheading'>Subheading</SelectItem>
																		<SelectItem value='TextBody'>Body</SelectItem>
																		<SelectItem value='TextCaption'>Caption</SelectItem>
																	</SelectGroup>
																</SelectContent>
															</Select>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`screens.${screenIndex}.children.${index}.text`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1 max-w-md px-4'>
														<FormControl>
															<Textarea className='resize-none !ring-0' {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<Separator className='bg-gray-200' />
											<div className='flex justify-end px-4'>
												<Button
													className='w-8 h-8'
													variant='destructive'
													size='icon'
													onClick={() => removeChild(index)}
												>
													<Trash className='w-4 h-4' />
												</Button>
											</div>
										</div>
									</Collapse>
								</div>
							);
						} else if (content.type === 'TextInput') {
							return (
								<div className='max-w-md rounded-md overflow-hidden bg-primary/20 p-2'>
									<Collapse
										trigger={
											<div className=' text-sm inline-flex items-center justify-between w-full'>
												<GripVertical className='w-4 h-4 mr-2' />
												<p className='flex-1'>Short Answer</p>
												<span className='ml-auto'>
													<ChevronDown className='w-4 h-4' />
												</span>
											</div>
										}
									>
										<div className='bg-white rounded-lg py-4 mt-2 gap-2 flex flex-col w-full'>
											<FormField
												control={form.control}
												name={`screens.${screenIndex}.children.${index}.input-type`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1 max-w-md px-4'>
														<Label className='font-normal'>
															Type<span className='ml-[0.2rem] text-red-800'>*</span>
														</Label>
														<FormControl>
															<Select onValueChange={field.onChange} defaultValue={field.value}>
																<SelectTrigger>
																	<SelectValue placeholder='Select Type' />
																</SelectTrigger>
																<SelectContent>
																	<SelectGroup>
																		<SelectItem value='text'>Text</SelectItem>
																		<SelectItem value='number'>Number</SelectItem>
																		<SelectItem value='email'>Email</SelectItem>
																		<SelectItem value='password'>Password</SelectItem>
																		<SelectItem value='phone'>Phone</SelectItem>
																	</SelectGroup>
																</SelectContent>
															</Select>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`screens.${screenIndex}.children.${index}.name`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1 max-w-md px-4'>
														<Label className='font-normal'>
															Field name<span className='ml-[0.2rem] text-red-800'>*</span>
														</Label>
														<FormControl>
															<Input
																value={field.value}
																onChange={(e) => {
																	field.onChange(e.target.value.replace(/\s/g, '_'));
																}}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`screens.${screenIndex}.children.${index}.label`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1 max-w-md px-4'>
														<Label className='font-normal'>
															Label<span className='ml-[0.2rem] text-red-800'>*</span>
														</Label>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`screens.${screenIndex}.children.${index}.helper-text`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1 max-w-md px-4'>
														<Label className='font-normal'>Instructions</Label>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<Separator className='bg-gray-200' />
											<div className='flex justify-between px-4'>
												<FormField
													control={form.control}
													name={`screens.${screenIndex}.children.${index}.required`}
													render={({ field }) => (
														<FormItem className='flex items-center gap-3'>
															<Label className='font-normal'>Required</Label>
															<FormControl>
																<Switch
																	className='scale-75 p-0 !mt-0'
																	checked={field.value}
																	onCheckedChange={field.onChange}
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<Button
													className='w-8 h-8'
													variant='destructive'
													size='icon'
													onClick={() => removeChild(index)}
												>
													<Trash className='w-4 h-4' />
												</Button>
											</div>
										</div>
									</Collapse>
								</div>
							);
						} else if (content.type === 'TextArea' || content.type === 'DatePicker') {
							return (
								<div className='max-w-md rounded-md overflow-hidden bg-primary/20 p-2'>
									<Collapse
										trigger={
											<div className=' text-sm inline-flex items-center justify-between w-full'>
												<GripVertical className='w-4 h-4 mr-2' />
												<p className='flex-1'>
													{content.type === 'TextArea' ? 'Paragraph' : 'Date Picker'}
												</p>
												<span className='ml-auto'>
													<ChevronDown className='w-4 h-4' />
												</span>
											</div>
										}
									>
										<div className='bg-white rounded-lg py-4 mt-2 gap-2 flex flex-col w-full'>
											<FormField
												control={form.control}
												name={`screens.${screenIndex}.children.${index}.name`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1 max-w-md px-4'>
														<Label className='font-normal'>
															Field name<span className='ml-[0.2rem] text-red-800'>*</span>
														</Label>
														<FormControl>
															<Input
																value={field.value}
																onChange={(e) => {
																	field.onChange(e.target.value.replace(/\s/g, '_'));
																}}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`screens.${screenIndex}.children.${index}.label`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1 max-w-md px-4'>
														<Label className='font-normal'>
															Label<span className='ml-[0.2rem] text-red-800'>*</span>
														</Label>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`screens.${screenIndex}.children.${index}.helper-text`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1 max-w-md px-4'>
														<Label className='font-normal'>Instructions</Label>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<Separator className='bg-gray-200' />
											<div className='flex justify-between px-4'>
												<FormField
													control={form.control}
													name={`screens.${screenIndex}.children.${index}.required`}
													render={({ field }) => (
														<FormItem className='flex items-center gap-3'>
															<Label className='font-normal'>Required</Label>
															<FormControl>
																<Switch
																	className='scale-75 p-0 !mt-0'
																	checked={field.value}
																	onCheckedChange={field.onChange}
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<Button
													className='w-8 h-8'
													variant='destructive'
													size='icon'
													onClick={() => removeChild(index)}
												>
													<Trash className='w-4 h-4' />
												</Button>
											</div>
										</div>
									</Collapse>
								</div>
							);
						} else if (
							content.type === 'RadioButtonsGroup' ||
							content.type === 'CheckboxGroup' ||
							content.type === 'Dropdown'
						) {
							return (
								<div className='max-w-md rounded-md overflow-hidden bg-primary/20 p-2'>
									<Collapse
										trigger={
											<div className=' text-sm inline-flex items-center justify-between w-full'>
												<GripVertical className='w-4 h-4 mr-2' />
												<p className='flex-1'>
													{content.type === 'RadioButtonsGroup'
														? 'Single Choice'
														: content.type === 'CheckboxGroup'
														? 'Multiple Choice'
														: 'Dropdown'}
												</p>
												<span className='ml-auto'>
													<ChevronDown className='w-4 h-4' />
												</span>
											</div>
										}
									>
										<div className='bg-white rounded-lg py-4 mt-2 gap-2 flex flex-col w-full'>
											<FormField
												control={form.control}
												name={`screens.${screenIndex}.children.${index}.name`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1 max-w-md px-4'>
														<Label className='font-normal'>
															Field name<span className='ml-[0.2rem] text-red-800'>*</span>
														</Label>
														<FormControl>
															<Input
																value={field.value}
																onChange={(e) => {
																	field.onChange(e.target.value.replace(/\s/g, '_'));
																}}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name={`screens.${screenIndex}.children.${index}.label`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1 max-w-md px-4'>
														<Label className='font-normal'>
															Label<span className='ml-[0.2rem] text-red-800'>*</span>
														</Label>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<div>
												<Label className='font-normal px-4'>
													Options<span className='ml-[0.2rem] text-red-800'>*</span>
												</Label>
												<Each
													items={content['data-source']}
													render={(item, opt_index) => (
														<FormField
															control={form.control}
															name={`screens.${screenIndex}.children.${index}.data-source.${opt_index}`}
															render={({ field }) => (
																<FormItem className='space-y-0 flex-1 px-4'>
																	<div className='flex items-center gap-3'>
																		<div className='w-full flex-1'>
																			<FormControl className='flex-1 w-full'>
																				<Input {...field} />
																			</FormControl>
																		</div>
																		<Button
																			className='w-8 h-8'
																			variant='destructive'
																			size='icon'
																			onClick={() => {
																				form.setValue(
																					`screens.${screenIndex}.children.${index}.data-source`,
																					content['data-source'].filter((_, i) => i !== opt_index)
																				);
																			}}
																		>
																			<Trash className='w-4 h-4' />
																		</Button>
																	</div>
																	<FormMessage />
																</FormItem>
															)}
														/>
													)}
												/>

												<div className='flex justify-start px-4 mt-3'>
													<Button
														className=''
														variant={'outline'}
														size='sm'
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															form.setValue(
																`screens.${screenIndex}.children.${index}.data-source`,
																[...content['data-source'], '']
															);
														}}
													>
														Add Option
													</Button>
												</div>
											</div>

											<Separator className='bg-gray-200' />

											<div className='flex justify-between px-4'>
												<FormField
													control={form.control}
													name={`screens.${screenIndex}.children.${index}.required`}
													render={({ field }) => (
														<FormItem className='flex items-center gap-3'>
															<Label className='font-normal'>Required</Label>
															<FormControl>
																<Switch
																	className='scale-75 p-0 !mt-0'
																	checked={field.value}
																	onCheckedChange={field.onChange}
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<Button
													className='w-8 h-8'
													variant='destructive'
													size='icon'
													onClick={() => removeChild(index)}
												>
													<Trash className='w-4 h-4' />
												</Button>
											</div>
										</div>
									</Collapse>
								</div>
							);
						} else if (content.type === 'OptIn') {
							return (
								<div className='max-w-md rounded-md overflow-hidden bg-primary/20 p-2'>
									<Collapse
										trigger={
											<div className=' text-sm inline-flex items-center justify-between w-full'>
												<GripVertical className='w-4 h-4 mr-2' />
												<p className='flex-1'>Opt-in</p>
												<span className='ml-auto'>
													<ChevronDown className='w-4 h-4' />
												</span>
											</div>
										}
									>
										<div className='bg-white rounded-lg py-4 mt-2 gap-2 flex flex-col w-full'>
											<FormField
												control={form.control}
												name={`screens.${screenIndex}.children.${index}.label`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1 max-w-md px-4'>
														<Label className='font-normal'>
															Label<span className='ml-[0.2rem] text-red-800'>*</span>
														</Label>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>

											<Separator className='bg-gray-200' />

											<div className='flex justify-between px-4'>
												<FormField
													control={form.control}
													name={`screens.${screenIndex}.children.${index}.required`}
													render={({ field }) => (
														<FormItem className='flex items-center gap-3'>
															<Label className='font-normal'>Required</Label>
															<FormControl>
																<Switch
																	className='scale-75 p-0 !mt-0'
																	checked={field.value}
																	onCheckedChange={field.onChange}
																/>
															</FormControl>
														</FormItem>
													)}
												/>
												<Button
													className='w-8 h-8'
													variant='destructive'
													size='icon'
													onClick={() => removeChild(index)}
												>
													<Trash className='w-4 h-4' />
												</Button>
											</div>
										</div>
									</Collapse>
								</div>
							);
						} else if (content.type === 'Footer') {
							return (
								<div className='max-w-md rounded-md overflow-hidden bg-primary/20 p-2'>
									<Collapse
										trigger={
											<div className=' text-sm inline-flex items-center justify-between w-full'>
												<GripVertical className='w-4 h-4 mr-2' />
												<p className='flex-1'>Footer</p>
												<span className='ml-auto'>
													<ChevronDown className='w-4 h-4' />
												</span>
											</div>
										}
									>
										<div className='bg-white rounded-lg py-4 mt-2 gap-2 flex flex-col w-full'>
											<FormField
												control={form.control}
												name={`screens.${screenIndex}.children.${index}.label`}
												render={({ field }) => (
													<FormItem className='space-y-0 flex-1 max-w-md px-4'>
														<Label className='font-normal'>
															Label<span className='ml-[0.2rem] text-red-800'>*</span>
														</Label>
														<FormControl>
															<Input {...field} />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</Collapse>
								</div>
							);
						}
						return <></>;
					}}
				/>
			</div>
		</>
	);
}

function Collapse({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger asChild>{trigger}</CollapsibleTrigger>
			<CollapsibleContent>{children}</CollapsibleContent>
		</Collapsible>
	);
}

function PreviewFlowContentsWrapper({
	form,
	index,
}: {
	form: UseFormReturn<TWhatsappFlow>;
	index: number;
}) {
	const screens = form.watch('screens');
	return <PreviewFlowContents screen={index < screens.length ? screens[index] : null} />;
}
