'use client';
import Each from '@/components/containers/each';
import { useFields } from '@/components/context/tags';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { getDateObject, getFormattedDate, mobileCheck } from '@/lib/utils';
import { PhonebookRecord, phonebookSchema } from '@/schema/phonebook';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

const defaultValues = {
	id: '',
	salutation: '',
	first_name: '',
	last_name: '',
	middle_name: '',
	phone_number: '',
	email: '',
	birthday: '',
	anniversary: '',
	others: {},
	labels: [],
};

const defaultFields = [
	'salutation',
	'first_name',
	'last_name',
	'middle_name',
	'phone_number',
	'email',
	'birthday',
	'anniversary',
	'all',
];

export default function PhonebookDialog({
	defaultValues: _defaultValues,
	onSave,
}: {
	defaultValues?: PhonebookRecord;
	onSave: (data: PhonebookRecord) => void;
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
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>Phonebook Record</DrawerTitle>
					</DrawerHeader>
					<PhonebookForm
						defaultValues={_defaultValues ? _defaultValues : defaultValues}
						onSave={onSave}
					/>
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
				<SheetContent className='w-screen sm:max-w-3xl'>
					<SheetHeader>
						<SheetTitle className='text-center'>Phonebook Record</SheetTitle>
					</SheetHeader>
					<PhonebookForm
						defaultValues={_defaultValues ? _defaultValues : defaultValues}
						onSave={onSave}
					/>
				</SheetContent>
			</Sheet>
		);
	}
}

export function PhonebookForm({
	defaultValues: _defaultValues,
	onSave,
}: {
	defaultValues?: PhonebookRecord;
	onSave: (data: PhonebookRecord) => void;
}) {
	const fields = useFields();

	const form = useForm<PhonebookRecord>({
		resolver: zodResolver(phonebookSchema),
		defaultValues: _defaultValues,
	});

	const birthday = form.watch('birthday');
	const anniversary = form.watch('anniversary');

	const notAvailableFilters = fields.filter((field) => {
		return !defaultFields.includes(field.value);
	});

	const handleChangeDate = (key: 'anniversary' | 'birthday', date?: Date) => {
		const formattedDate = date ? getFormattedDate(date) : '';
		form.setValue(key, formattedDate);
	};

	function handleSave(data: PhonebookRecord) {
		onSave(data);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSave)} className='w-full space-y-2'>
				<h3 className='font-medium text-lg'>Personal Details</h3>
				<div className='flex gap-3 w-full'>
					<FormField
						control={form.control}
						name='salutation'
						render={({ field }) => (
							<FormItem className='space-y-0 flex-1'>
								<FormLabel className='text-primary'>Salutation</FormLabel>
								<FormControl>
									<Input placeholder='eg. Mr.' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='first_name'
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
						name='middle_name'
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
						name='last_name'
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
				<div>
					<FormField
						control={form.control}
						name='phone_number'
						render={({ field }) => (
							<FormItem className='space-y-0'>
								<FormLabel className='text-primary'>Phone Number</FormLabel>
								<FormControl>
									<Input placeholder='eg. +1234567890' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem className='space-y-0'>
								<FormLabel className='text-primary'>Email</FormLabel>
								<FormControl>
									<Input placeholder='eg. example@example.com' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div>
					<FormField
						control={form.control}
						name='birthday'
						render={({ field }) => (
							<FormItem className='space-y-0'>
								<FormLabel className='text-primary'>Birthday</FormLabel>
								<FormControl>
									<DatePicker
										onChange={(date) => handleChangeDate('birthday', date)}
										value={birthday ? getDateObject(birthday) : undefined}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div>
					<FormField
						control={form.control}
						name='anniversary'
						render={({ field }) => (
							<FormItem className='space-y-0'>
								<FormLabel className='text-primary'>Anniversary</FormLabel>
								<FormControl>
									<DatePicker
										onChange={(date) => handleChangeDate('anniversary', date)}
										value={anniversary ? getDateObject(anniversary) : undefined}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Each
					items={notAvailableFilters}
					render={(item) => (
						<FormField
							control={form.control}
							name={`others.${item.value}`}
							render={({ field }) => (
								<FormItem className='space-y-0'>
									<FormLabel className='text-primary'>{item.value}</FormLabel>
									<FormControl>
										<Input placeholder='eg. Delhi' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}
				/>
				<div className='flex justify-end'>
					<Button type='submit'>Save</Button>
				</div>
			</form>
		</Form>
	);
}
