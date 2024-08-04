'use client';
import Each from '@/components/containers/each';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { mobileCheck } from '@/lib/utils';
import { contactSchema } from '@/schema/phonebook';
import { zodResolver } from '@hookform/resolvers/zod';
import { Minus, Plus } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const _defaultValues = {
	addresses: [],
	emails: [],
	phones: [],
	urls: [],
	birthday: '',
	name: {
		formatted_name: '',
		first_name: '',
		last_name: '',
		middle_name: '',
		prefix: '',
		suffix: '',
	},
	org: {
		company: '',
		department: '',
		title: '',
	},
};

export default function ContactDialog({
	defaultValues = _defaultValues,
	onSave = () => {},
}: {
	defaultValues?: z.infer<typeof contactSchema>;
	onSave?: (data: z.infer<typeof contactSchema>) => void;
}) {
	const router = useRouter();
	const pathname = usePathname();

	const isMobile = mobileCheck();

	if (isMobile) {
		return (
			<Drawer
				open
				onOpenChange={(open) => {
					if (!open) {
						router.replace(pathname);
					}
				}}
			>
				<DrawerContent className='px-3'>
					<DrawerHeader>
						<DrawerTitle>Contact Card</DrawerTitle>
					</DrawerHeader>
					<ContactForm onSave={onSave} defaultValues={defaultValues} />
				</DrawerContent>
			</Drawer>
		);
	} else {
		return (
			<Sheet
				open
				onOpenChange={(open) => {
					if (!open) {
						router.replace(pathname);
					}
				}}
			>
				<SheetContent className='w-screen sm:max-w-3xl overflow-scroll'>
					<SheetHeader>
						<SheetTitle className='text-center'>Contact Card</SheetTitle>
					</SheetHeader>
					<ContactForm onSave={onSave} defaultValues={defaultValues} />
				</SheetContent>
			</Sheet>
		);
	}
}

function ContactForm({
	defaultValues = _defaultValues,
	onSave,
}: {
	defaultValues?: z.infer<typeof contactSchema>;
	onSave: (data: z.infer<typeof contactSchema>) => void;
}) {
	const form = useForm<z.infer<typeof contactSchema>>({
		resolver: zodResolver(contactSchema),
		defaultValues,
	});

	const emails = form.watch('emails');
	const urls = form.watch('urls');
	const phones = form.watch('phones');
	const addresses = form.watch('addresses');

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSave)} className='w-full space-y-2'>
				<h3 className='font-medium text-lg'>Personal Details</h3>

				<div>
					<FormField
						control={form.control}
						name='name.formatted_name'
						render={({ field }) => (
							<FormItem className='space-y-0 flex-1'>
								<FormLabel className='text-primary'>Formatted Name</FormLabel>
								<FormControl>
									<Input placeholder='eg. John Doe' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className='flex gap-3 w-full'>
					<FormField
						control={form.control}
						name='name.prefix'
						render={({ field }) => (
							<FormItem className='space-y-0 flex-1'>
								<FormLabel className='text-primary'>Prefix</FormLabel>
								<FormControl>
									<Input placeholder='eg. Mr.' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='name.first_name'
						render={({ field }) => (
							<FormItem className='space-y-0  flex-1'>
								<FormLabel className='text-primary'>First Name</FormLabel>
								<FormControl>
									<Input placeholder='eg. John' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className='flex gap-3 w-full'>
					<FormField
						control={form.control}
						name='name.middle_name'
						render={({ field }) => (
							<FormItem className='space-y-0 flex-1'>
								<FormLabel className='text-primary'>Middle Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='name.last_name'
						render={({ field }) => (
							<FormItem className='space-y-0  flex-1'>
								<FormLabel className='text-primary'>Last Name</FormLabel>
								<FormControl>
									<Input placeholder='eg. Doe' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className='flex gap-3 w-full'>
					<FormField
						control={form.control}
						name='name.suffix'
						render={({ field }) => (
							<FormItem className='space-y-0 flex-1'>
								<FormLabel className='text-primary'>Suffix</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Separator />

				<h3 className='font-medium text-lg'>Job Details</h3>

				<div className='flex gap-3 w-full'>
					<FormField
						control={form.control}
						name='org.company'
						render={({ field }) => (
							<FormItem className='space-y-0 flex-1'>
								<FormLabel className='text-primary'>Company</FormLabel>
								<FormControl>
									<Input placeholder='ex. Tata' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className='flex gap-3 w-full'>
					<FormField
						control={form.control}
						name='org.title'
						render={({ field }) => (
							<FormItem className='space-y-0 flex-1'>
								<FormLabel className='text-primary'>Title</FormLabel>
								<FormControl>
									<Input placeholder='eg. Manager' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='org.department'
						render={({ field }) => (
							<FormItem className='space-y-0  flex-1'>
								<FormLabel className='text-primary'>Department</FormLabel>
								<FormControl>
									<Input placeholder='eg. Marketing' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Separator />

				<h3 className='font-medium text-lg'>Other Details</h3>

				<div className='w-full'>
					<div className='flex justify-between'>
						<h4 className='text-primary'>Phone Numbers</h4>
						<Button
							size={'icon'}
							variant={'secondary'}
							className='w-8 h-8 p-2'
							onClick={(e) => {
								form.setValue('phones', [
									...form.getValues('phones'),
									{
										type: 'work',
										phone: '',
										wa_id: '',
									},
								]);
								e.preventDefault();
							}}
						>
							<Plus className='w-4 h-4' />
						</Button>
					</div>
					<div>
						<Each
							items={phones}
							render={(_, index) => (
								<FormField
									control={form.control}
									name={`phones.${index}.phone`}
									render={({ field }) => (
										<FormItem className='space-y-0  flex-1'>
											<div className='flex items-center w-full'>
												<div className='flex-1'>
													<FormControl>
														<Input placeholder='eg. 919XXXXXXX87' {...field} />
													</FormControl>
												</div>
												<Button
													size={'icon'}
													variant={'secondary'}
													className='w-8 h-8 p-2'
													onClick={(e) => {
														form.setValue(
															'phones',
															phones.filter((_, i) => i !== index)
														);
														e.preventDefault();
													}}
												>
													<Minus className='w-4 h-4 text-destructive' />
												</Button>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						/>
					</div>
				</div>

				<div className='w-full'>
					<div className='flex justify-between'>
						<h4 className='text-primary'>Emails</h4>
						<Button
							size={'icon'}
							variant={'secondary'}
							className='w-8 h-8 p-2'
							onClick={(e) => {
								form.setValue('emails', [
									...form.getValues('emails'),
									{
										type: 'work',
										email: '',
									},
								]);
								e.preventDefault();
							}}
						>
							<Plus className='w-4 h-4' />
						</Button>
					</div>
					<div>
						<Each
							items={emails}
							render={(_, index) => (
								<FormField
									control={form.control}
									name={`emails.${index}.email`}
									render={({ field }) => (
										<FormItem className='space-y-0  flex-1'>
											<div className='flex items-center w-full'>
												<div className='flex-1'>
													<FormControl>
														<Input placeholder='eg. abc@xyz.com' {...field} />
													</FormControl>
												</div>
												<Button
													size={'icon'}
													variant={'secondary'}
													className='w-8 h-8 p-2'
													onClick={(e) => {
														form.setValue(
															'emails',
															emails.filter((_, i) => i !== index)
														);
														e.preventDefault();
													}}
												>
													<Minus className='w-4 h-4 text-destructive' />
												</Button>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						/>
					</div>
				</div>

				<div className='w-full'>
					<div className='flex justify-between'>
						<h4 className='text-primary'>Links</h4>
						<Button
							size={'icon'}
							variant={'secondary'}
							className='w-8 h-8 p-2'
							onClick={(e) => {
								form.setValue('urls', [
									...form.getValues('urls'),
									{
										type: 'work',
										url: '',
									},
								]);
								e.preventDefault();
							}}
						>
							<Plus className='w-4 h-4' />
						</Button>
					</div>
					<div>
						<Each
							items={urls}
							render={(_, index) => (
								<FormField
									control={form.control}
									name={`urls.${index}.url`}
									render={({ field }) => (
										<FormItem className='space-y-0  flex-1'>
											<div className='flex items-center w-full'>
												<div className='flex-1'>
													<FormControl>
														<Input placeholder='eg. https://...' {...field} />
													</FormControl>
												</div>
												<Button
													size={'icon'}
													variant={'secondary'}
													className='w-8 h-8 p-2'
													onClick={(e) => {
														form.setValue(
															'urls',
															urls.filter((_, i) => i !== index)
														);
														e.preventDefault();
													}}
												>
													<Minus className='w-4 h-4 text-destructive' />
												</Button>
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
						/>
					</div>
				</div>

				<div className='w-full'>
					<div className='flex justify-between'>
						<h4 className='text-primary'>Addresses</h4>
						<Button
							size={'icon'}
							variant={'secondary'}
							className='w-8 h-8 p-2'
							onClick={(e) => {
								form.setValue('addresses', [
									...form.getValues('addresses'),
									{
										type: 'work',
										street: '',
										city: '',
										state: '',
										country: '',
										zip: '',
										country_code: '',
									},
								]);
								e.preventDefault();
							}}
						>
							<Plus className='w-4 h-4' />
						</Button>
					</div>
					<div>
						<Each
							items={addresses}
							render={(_, index) => (
								<div className='my-2'>
									<div className='flex justify-between pl-4'>
										<span>{index + 1}. Address</span>
										<Button
											size={'icon'}
											variant={'secondary'}
											className='w-8 h-8 p-2'
											onClick={(e) => {
												form.setValue(
													'addresses',
													addresses.filter((_, i) => i !== index)
												);
												e.preventDefault();
											}}
										>
											<Minus className='w-4 h-4 text-destructive' />
										</Button>
									</div>
									<div className='flex gap-3 w-full'>
										<FormField
											control={form.control}
											name={`addresses.${index}.street`}
											render={({ field }) => (
												<FormItem className='space-y-0  flex-1'>
													<FormControl>
														<Input {...field} placeholder='Street' />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`addresses.${index}.city`}
											render={({ field }) => (
												<FormItem className='space-y-0  flex-1'>
													<FormControl>
														<Input {...field} placeholder='City' />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className='flex gap-3 w-full'>
										<FormField
											control={form.control}
											name={`addresses.${index}.state`}
											render={({ field }) => (
												<FormItem className='space-y-0  flex-1'>
													<FormControl>
														<Input {...field} placeholder='State' />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`addresses.${index}.country`}
											render={({ field }) => (
												<FormItem className='space-y-0  flex-1'>
													<FormControl>
														<Input {...field} placeholder='Country' />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className='flex gap-3 w-full'>
										<FormField
											control={form.control}
											name={`addresses.${index}.zip`}
											render={({ field }) => (
												<FormItem className='space-y-0  flex-1'>
													<FormControl>
														<Input {...field} placeholder='Pincode Code' />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`addresses.${index}.country_code`}
											render={({ field }) => (
												<FormItem className='space-y-0  flex-1'>
													<FormControl>
														<Input {...field} placeholder='Country Code' />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							)}
						/>
					</div>
				</div>

				<div className='flex justify-end'>
					<Button type='submit'>Save</Button>
				</div>
			</form>
		</Form>
	);
}
