'use client';
import Each from '@/components/containers/each';
import TagsSelector from '@/components/elements/popover/tags';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { parseToObject } from '@/lib/utils';
import { permissionsSchema } from '@/schema/access';
import { profileSchema, resetSchema } from '@/schema/auth';
import AgentService from '@/services/agent.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { ListFilter } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { IoClose } from 'react-icons/io5';
import { z } from 'zod';

export function DetailsDialog() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const id = searchParams.get('edit') === 'new' ? '' : searchParams.get('edit');
	const f_nm = searchParams.get('name')?.split(' ')[0] ?? '';
	const l_nm =
		(searchParams.get('name') ?? '').split(' ').length > 1
			? searchParams.get('name')?.split(' ').slice(1).join(' ')
			: '';

	const {
		handleSubmit,
		register,
		setError,
		setValue,
		clearErrors: resetErrors,
		formState: { errors },
	} = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			email: searchParams.get('email') || '',
			firstName: f_nm,
			lastName: l_nm,
			phone: searchParams.get('phone') || '',
		},
	});

	async function formSubmit(values: z.infer<typeof profileSchema>) {
		const details = {
			name: `${values.firstName} ${values.lastName}`.trim(),
			phone: values.phone,
			email: values.email,
			password: '000000',
		};
		if (id) {
			toast.promise(AgentService.updateAgent({ ...details, id }), {
				loading: 'Updating...',
				success: () => {
					router.replace(pathname);
					router.refresh();
					return 'Agent updated successfully';
				},
				error: (err) => {
					return err.message || 'Failed to update agent';
				},
			});
		} else {
			toast.promise(AgentService.createAgent(details), {
				loading: 'Updating...',
				success: () => {
					router.replace(pathname);
					router.refresh();
					return 'Agent created successfully';
				},
				error: (err) => {
					return err.message || 'Failed to create agent';
				},
			});
		}
	}

	return (
		<Dialog
			defaultOpen
			onOpenChange={(value) => {
				if (!value) {
					router.replace(pathname);
				}
			}}
		>
			<DialogContent className='sm:max-w-[425px] lg:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Edit profile</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				<form method='post' onSubmit={handleSubmit(formSubmit)}>
					<div className='grid gap-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div className='grid gap-2'>
								<Label className='text-primary' htmlFor='first-name'>
									First name
								</Label>
								<Input
									id='first-name'
									placeholder='John'
									{...register('firstName', { required: true })}
									onChange={(e) => {
										setValue('firstName', e.target.value);
										resetErrors();
									}}
								/>
							</div>
							<div className='grid gap-2'>
								<Label className='text-primary' htmlFor='last-name'>
									Last name
								</Label>
								<Input
									id='last-name'
									placeholder='Doe'
									{...register('lastName', {})}
									onChange={(e) => {
										setValue('lastName', e.target.value);
										resetErrors();
									}}
								/>
							</div>
						</div>
						<div className='grid gap-2'>
							<Label className='text-primary' htmlFor='email'>
								Phone (with country code)
							</Label>
							<Input
								id='phone'
								type='tel'
								placeholder='91890XXXXX78'
								{...register('phone', { required: true, pattern: /^[0-9]{12}$/ })}
								onChange={(e) => {
									setValue('phone', e.target.value);
									resetErrors();
								}}
								isInvalid={!!errors.email?.message}
							/>
						</div>
						<div className='grid gap-2'>
							<Label className='text-primary' htmlFor='email'>
								Email
							</Label>
							<Input
								id='email'
								type='email'
								placeholder='john@example.com'
								{...register('email', { required: true, pattern: /^\S+@\S+$/i })}
								onChange={(e) => {
									setValue('email', e.target.value);
									resetErrors();
								}}
								isInvalid={!!errors.email?.message}
							/>
						</div>
					</div>
					<DialogFooter className='mt-2'>
						<Button type='submit'>Save changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export function PasswordDialog() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const id = searchParams.get('update-password');

	const {
		handleSubmit,
		register,
		setError,
		setValue,
		clearErrors: resetErrors,
		formState: { errors },
	} = useForm<z.infer<typeof resetSchema>>({
		resolver: zodResolver(resetSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	async function formSubmit(values: z.infer<typeof resetSchema>) {
		if (!id) {
			return;
		}
		toast.promise(AgentService.updateAgentPassword(id, values.password), {
			loading: 'Updating...',
			success: () => {
				router.replace(pathname);
				return 'Password updated successfully';
			},
			error: (err) => {
				router.replace(pathname);
				return err.message || 'Failed to update password';
			},
		});
	}

	return (
		<Dialog
			defaultOpen
			onOpenChange={(value) => {
				if (!value) {
					router.replace(pathname);
				}
			}}
		>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Update password</DialogTitle>
					<DialogDescription>
						Enter new password and confirm to update your password.
					</DialogDescription>
				</DialogHeader>
				<form method='post' onSubmit={handleSubmit(formSubmit)}>
					<div className='grid gap-4'>
						<div className='grid gap-2'>
							<Label htmlFor='password'>New Password</Label>
							<Input
								autoComplete='new-password'
								type='password'
								{...register('password', { required: true, minLength: 8 })}
								onChange={(e) => {
									setValue('password', e.target.value);
									resetErrors();
								}}
								isInvalid={!!errors.password?.message}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='password'>Confirm Password</Label>
							<Input
								autoComplete='new-password'
								type='password'
								{...register('confirmPassword', { required: true, minLength: 8 })}
								onChange={(e) => {
									setValue('confirmPassword', e.target.value);
									resetErrors();
								}}
								isInvalid={!!errors.password?.message}
							/>
							<span className='text-red-500 text-sm text-center'>{errors.password?.message}</span>
						</div>
					</div>
					<DialogFooter className='mt-2'>
						<Button type='submit'>Save changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export function PermissionDialog() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const id = searchParams.get('permissions');
	const res = permissionsSchema.safeParse(parseToObject(searchParams.get('data')));
	const data = res.success
		? res.data
		: {
				phonebook: {
					create: false,
					update: false,
					delete: false,
					export: false,
				},
				broadcast: {
					create: false,
					update: false,
					report: false,
					export: false,
				},
				recurring: {
					create: false,
					update: false,
					delete: false,
					export: false,
				},
				media: {
					create: false,
					update: false,
					delete: false,
				},
				contacts: {
					create: false,
					update: false,
					delete: false,
				},
				template: {
					create: false,
					update: false,
					delete: false,
				},
				buttons: {
					read: false,
					export: false,
				},
				chatbot: {
					create: false,
					update: false,
					delete: false,
					export: false,
				},
				chatbot_flow: {
					create: false,
					update: false,
					delete: false,
					export: false,
				},
				auto_assign_chats: false,
				assigned_labels: [],
		  };

	const { handleSubmit, register, getValues, watch, setError, setValue } = useForm<
		z.infer<typeof permissionsSchema>
	>({
		resolver: zodResolver(permissionsSchema),
		defaultValues: data,
	});

	async function formSubmit(values: z.infer<typeof permissionsSchema>) {
		if (!id) {
			return;
		}
		toast.promise(AgentService.assignAgentPermission(id, values), {
			loading: 'Updating...',
			success: () => {
				router.replace(pathname);
				router.refresh();
				return 'Agent permissions updated successfully';
			},
			error: (err) => {
				router.replace(pathname);
				return err.message || 'Failed to update permissions';
			},
		});
	}

	const handleTagsChange = (tags: string[]) => {
		const newTags: string[] = tags.filter((tag) => !watch('assigned_labels').includes(tag));
		setValue('assigned_labels', [...watch('assigned_labels'), ...newTags]);
	};

	return (
		<Dialog
			defaultOpen
			onOpenChange={(value) => {
				if (!value) {
					router.replace(pathname);
				}
			}}
		>
			<DialogContent className='max-w-3xl'>
				<DialogHeader>
					<DialogTitle>Update Permissions</DialogTitle>
				</DialogHeader>
				<form method='post' onSubmit={handleSubmit(formSubmit)}>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='w-[30%]'></TableHead>
								<TableHead className='text-center'>Read</TableHead>
								<TableHead className='text-center'>Create</TableHead>
								<TableHead className='text-center'>Update</TableHead>
								<TableHead className='text-center'>Delete</TableHead>
								<TableHead className='text-center'>Report</TableHead>
								<TableHead className='text-center'>Export</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell className='font-medium'>Phonebook</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.phonebook?.create}
										{...register('phonebook.create')}
										onCheckedChange={(e) => {
											setValue('phonebook.create', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.phonebook?.update}
										{...register('phonebook.update')}
										onCheckedChange={(e) => {
											setValue('phonebook.update', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.phonebook?.delete}
										{...register('phonebook.delete')}
										onCheckedChange={(e) => {
											setValue('phonebook.delete', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.phonebook?.export}
										{...register('phonebook.export')}
										onCheckedChange={(e) => {
											setValue('phonebook.export', Boolean(e));
										}}
									/>
								</TableCell>
							</TableRow>

							<TableRow>
								<TableCell className='font-medium'>Broadcast</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.broadcast?.create}
										{...register('broadcast.create')}
										onCheckedChange={(e) => {
											setValue('broadcast.create', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.broadcast?.update}
										{...register('broadcast.update')}
										onCheckedChange={(e) => {
											setValue('broadcast.update', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.broadcast?.report}
										{...register('broadcast.report')}
										onCheckedChange={(e) => {
											setValue('broadcast.report', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.broadcast?.export}
										{...register('broadcast.export')}
										onCheckedChange={(e) => {
											setValue('broadcast.export', Boolean(e));
										}}
									/>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>Recurring</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.recurring?.create}
										{...register('recurring.create')}
										onCheckedChange={(e) => {
											setValue('recurring.create', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.recurring?.update}
										{...register('recurring.update')}
										onCheckedChange={(e) => {
											setValue('recurring.update', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.recurring?.delete}
										{...register('recurring.delete')}
										onCheckedChange={(e) => {
											setValue('recurring.delete', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.broadcast?.export}
										{...register('broadcast.export')}
										onCheckedChange={(e) => {
											setValue('broadcast.export', Boolean(e));
										}}
									/>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>Chatbot</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.chatbot?.create}
										{...register('chatbot.create')}
										onCheckedChange={(e) => {
											setValue('chatbot.create', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.chatbot?.update}
										{...register('chatbot.update')}
										onCheckedChange={(e) => {
											setValue('chatbot.update', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.chatbot?.delete}
										{...register('chatbot.delete')}
										onCheckedChange={(e) => {
											setValue('chatbot.delete', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.chatbot?.export}
										{...register('chatbot.export')}
										onCheckedChange={(e) => {
											setValue('chatbot.export', Boolean(e));
										}}
									/>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>Flows</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.chatbot_flow?.create}
										{...register('chatbot_flow.create')}
										onCheckedChange={(e) => {
											setValue('chatbot_flow.create', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.chatbot_flow?.update}
										{...register('chatbot_flow.update')}
										onCheckedChange={(e) => {
											setValue('chatbot_flow.update', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.chatbot_flow?.delete}
										{...register('chatbot_flow.delete')}
										onCheckedChange={(e) => {
											setValue('chatbot_flow.delete', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.chatbot_flow?.export}
										{...register('chatbot_flow.export')}
										onCheckedChange={(e) => {
											setValue('chatbot_flow.export', Boolean(e));
										}}
									/>
								</TableCell>
							</TableRow>

							<TableRow>
								<TableCell className='font-medium'>Media</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.media?.create}
										{...register('media.create')}
										onCheckedChange={(e) => {
											setValue('media.create', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'></TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.media?.delete}
										{...register('media.delete')}
										onCheckedChange={(e) => {
											setValue('media.delete', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center' />
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>VCards</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.contacts?.create}
										{...register('contacts.create')}
										onCheckedChange={(e) => {
											setValue('contacts.create', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.contacts?.update}
										{...register('contacts.update')}
										onCheckedChange={(e) => {
											setValue('contacts.update', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.contacts?.delete}
										{...register('contacts.delete')}
										onCheckedChange={(e) => {
											setValue('contacts.delete', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center' />
							</TableRow>
							<TableRow>
								<TableCell className='font-medium'>Templates</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.template?.create}
										{...register('template.create')}
										onCheckedChange={(e) => {
											setValue('template.create', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.template?.update}
										{...register('template.update')}
										onCheckedChange={(e) => {
											setValue('template.update', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.template?.delete}
										{...register('template.delete')}
										onCheckedChange={(e) => {
											setValue('template.delete', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center' />
							</TableRow>

							<TableRow className='h-[30px]'>
								<TableCell className='font-medium'>Button Reports</TableCell>
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.buttons?.read}
										{...register('buttons.read')}
										onCheckedChange={(e) => {
											setValue('buttons.read', Boolean(e));
										}}
									/>
								</TableCell>
								<TableCell className='text-center' />
								<TableCell className='text-center' />
								<TableCell className='text-center' />
								<TableCell className='text-center'>
									<Checkbox
										defaultChecked={data.buttons?.export}
										{...register('buttons.export')}
										onCheckedChange={(e) => {
											setValue('buttons.export', Boolean(e));
										}}
									/>
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
					<div>
						<p className='font-medium text-lg'>Extras</p>

						<div className='flex items-center justify-between py-2 px-4'>
							<label
								htmlFor='auto_assign_chats'
								className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
							>
								Auto assign chats
							</label>
							<Checkbox
								id='auto_assign_chats'
								defaultChecked={data.auto_assign_chats}
								{...register('auto_assign_chats')}
								onCheckedChange={(e) => {
									setValue('auto_assign_chats', Boolean(e));
								}}
							/>
						</div>
					</div>
					<div>
						<p className='font-medium text-lg'>Tags</p>

						<div className='flex items-center justify-between py-2 px-4 border-b gap-2'>
							<div className='flex flex-wrap gap-2 border-dashed border-2 rounded-lg p-2 flex-1'>
								<Each
									items={watch('assigned_labels')}
									render={(label) => (
										<Badge className=''>
											{label}
											<IoClose
												onClick={() =>
													setValue(
														'assigned_labels',
														watch('assigned_labels').filter((l) => l !== label)
													)
												}
												className='w-4 h-4 cursor-pointer'
												strokeWidth={3}
											/>
										</Badge>
									)}
								/>
							</div>
							<TagsSelector onChange={(tags) => handleTagsChange(tags)}>
								<Button variant='secondary' size={'icon'}>
									<ListFilter className='w-4 h-4' strokeWidth={3} />
								</Button>
							</TagsSelector>
						</div>
					</div>

					<DialogFooter className='mt-2'>
						<Button type='submit'>Save changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
