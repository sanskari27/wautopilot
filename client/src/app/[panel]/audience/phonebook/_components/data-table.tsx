'use client';

import Show from '@/components/containers/show';
import { usePermissions, useUserDetails } from '@/components/context/user-details';
import PhonebookDialog from '@/components/elements/dialogs/phonebook';
import FieldSearch from '@/components/elements/filters/fieldSearch';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableCellLink,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { formatPhoneNumber, parseToObject } from '@/lib/utils';
import { PhonebookRecord, PhonebookRecordWithID, phonebookSchema } from '@/schema/phonebook';
import PhoneBookService from '@/services/phonebook.service';
import {
	CaretSortIcon,
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import {
	ColumnDef,
	ColumnFiltersState,
	Row,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';
import toast from 'react-hot-toast';
import {
	AddRecord,
	AssignAgent,
	DeleteButton,
	ExportButton,
	ExportChatButton,
	TagsFilter,
} from './buttons';
import { AddFields, AssignTags, UploadCSV } from './dialogs';

function generateColumns(keys: string[], isAgent = false): ColumnDef<PhonebookRecordWithID>[] {
	return [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label='Select all'
				/>
			),
			cell: ({ row }) => (
				<div
					className='inline-flex items-center px-2'
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
					}}
				>
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label='Select row'
					/>
					<span className='ml-2'></span>
					{row.index + 1}.
				</div>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'salutation',
			header: ({ column }) => {
				return (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Salutation
						<CaretSortIcon className='ml-2 h-4 w-4' />
					</Button>
				);
			},
			cell: ({ row }) => <div className='px-4'>{row.getValue('salutation')}</div>,
		},
		{
			accessorKey: 'first_name',
			header: ({ column }) => {
				return (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						First Name
						<CaretSortIcon className='ml-2 h-4 w-4' />
					</Button>
				);
			},
			cell: ({ row }) => <div className='px-4'>{row.getValue('first_name')}</div>,
		},
		{
			accessorKey: 'middle_name',
			header: () => {
				return <Button variant='ghost'>Middle Name</Button>;
			},
			cell: ({ row }) => <div className='px-4'>{row.getValue('middle_name')}</div>,
		},
		{
			accessorKey: 'last_name',
			header: () => {
				return <Button variant='ghost'>Last Name</Button>;
			},
			cell: ({ row }) => <div className='px-4'>{row.getValue('last_name')}</div>,
		},
		{
			accessorKey: 'phone_number',
			header: ({ column }) => {
				return (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Phone Number
						<CaretSortIcon className='ml-2 h-4 w-4' />
					</Button>
				);
			},
			cell: ({ row }) => (
				<div className='px-4'>
					+
					{isAgent
						? formatPhoneNumber(row.getValue('phone_number') as string)
						: row.getValue('phone_number')}
				</div>
			),
		},
		{
			accessorKey: 'email',
			header: () => {
				return <Button variant='ghost'>Email</Button>;
			},
			cell: ({ row }) => <div className='px-4'>{row.getValue('email')}</div>,
		},
		{
			accessorKey: 'birthday',
			header: ({ column }) => {
				return (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Birthday
						<CaretSortIcon className='ml-2 h-4 w-4' />
					</Button>
				);
			},
			cell: ({ row }) => <div className='px-4'>{row.getValue('birthday')}</div>,
		},
		{
			accessorKey: 'anniversary',
			header: ({ column }) => {
				return (
					<Button
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
					>
						Anniversary
						<CaretSortIcon className='ml-2 h-4 w-4' />
					</Button>
				);
			},
			cell: ({ row }) => <div className='px-4'>{row.getValue('anniversary')}</div>,
		},
		...keys.map((key) => {
			return {
				accessorKey: key,
				header: () => {
					return <Button variant='ghost'>{key}</Button>;
				},
				cell: ({ row }: { row: Row<PhonebookRecordWithID> }) => (
					<div className='px-4'>{row.original.others[key]}</div>
				),
			};
		}),
	];
}

export function DataTable({
	records,
	maxRecord,
}: {
	records: PhonebookRecordWithID[];
	maxRecord: number;
}) {
	const pathname = usePathname();
	const { isAgent } = useUserDetails();
	const {
		create: createPermission,
		delete: deletePermission,
		export: exportPermission,
		update: updatePermission,
	} = usePermissions().phonebook;
	const fields = records.reduce<Set<string>>((acc, record) => {
		Object.keys(record.others).forEach((field) => acc.add(field));
		return acc;
	}, new Set<string>());

	const keys = Array.from(fields);
	const hidden = keys.reduce((acc, key) => {
		acc[key] = false;
		return acc;
	}, {} as { [key: string]: boolean });

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
		...hidden,
		middle_name: false,
		birthday: false,
		anniversary: false,
	});
	const [rowSelection, setRowSelection] = React.useState({});
	const searchParams = useSearchParams();
	const router = useRouter();
	const limit = searchParams.get('limit') || '20';
	const maxPage = Math.ceil(maxRecord / parseInt(limit, 10));
	const page = Math.min(parseInt(searchParams.get('page') || '1', 10), maxPage);

	React.useEffect(() => {
		if (parseInt(searchParams.get('page') || '1', 10) > maxPage) {
			const url = new URL((window as any).location);
			url.searchParams.set('page', maxPage.toString());
			router.replace(url.toString());
		}
	}, [maxPage, router, searchParams]);

	const columns = React.useMemo(() => generateColumns(keys, isAgent), [keys, isAgent]);

	const table = useReactTable({
		data: records,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getRowId: (row) => row.id,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination: {
				pageSize: parseInt(limit, 10),
				pageIndex: page - 1,
			},
		},
	});

	function setPage(page: number) {
		const url = new URL((window as any).location);
		url.searchParams.set('page', page.toString());
		router.replace(url.toString());
	}

	const handlePhonebookInput = (phonebook: PhonebookRecord) => {
		let id = searchParams.get('add-phonebook');
		id = id === 'true' ? '' : id;

		let promise;
		if (id) {
			if (!updatePermission) {
				toast.error('You do not have permission to update phonebook');
				return;
			}
			promise = PhoneBookService.updateRecord(id, phonebook);
		} else {
			if (!createPermission) {
				toast.error('You do not have permission to create phonebook');
				return;
			}
			promise = PhoneBookService.addRecord(phonebook);
		}

		toast.promise(promise, {
			loading: 'Saving Phonebook...',
			success: () => {
				router.replace(pathname);
				router.refresh();
				return 'Phonebook saved successfully';
			},
			error: 'Failed to save phonebook',
		});
	};

	const phonebookData = phonebookSchema.safeParse(parseToObject(searchParams.get('data')));
	const isOpenPhonebookDialog =
		searchParams.get('add-phonebook') === 'true' || phonebookData.success;

	return (
		<div className='flex flex-col gap-4 justify-center p-4'>
			<div className='justify-between flex'>
				<h2 className='text-2xl font-bold'>Phonebook</h2>
				<div className='flex gap-x-2 gap-y-1 flex-wrap '>
					<Show.ShowIf condition={Object.keys(rowSelection).length === 0}>
						<Show.ShowIf condition={!isAgent}>
							<AddFields />
						</Show.ShowIf>
						<Show.ShowIf condition={exportPermission}>
							<ExportButton labels={searchParams.getAll('tags') ?? []} />
						</Show.ShowIf>
						<Show.ShowIf condition={createPermission}>
							<UploadCSV />
							<AddRecord />
						</Show.ShowIf>
					</Show.ShowIf>
					<Show.ShowIf condition={Object.keys(rowSelection).length !== 0}>
						<Show.ShowIf condition={deletePermission}>
							<DeleteButton ids={Object.keys(rowSelection)} />
						</Show.ShowIf>
						<ExportChatButton ids={Object.keys(rowSelection)} />
						<AssignTags ids={Object.keys(rowSelection)} />
						<AssignAgent ids={Object.keys(rowSelection)} />
					</Show.ShowIf>
				</div>
			</div>
			<div className='flex items-start gap-3'>
				<div className='flex-1'>
					<FieldSearch />
				</div>
				<div>
					<TagsFilter />
				</div>
			</div>

			<div className='w-full'>
				<div className='flex flex-wrap items-center justify-between px-2 mt-3'>
					<div className='inline-flex  flex-1 items-center flex-wrap gap-x-2'>
						<div className=' text-sm text-muted-foreground'>
							{table.getFilteredSelectedRowModel().rows.length} of{' '}
							{table.getFilteredRowModel().rows.length} row(s) selected.
						</div>
						<div className=' text-sm text-muted-foreground'>
							Total {Object.keys(rowSelection).length} row(s) selected.
						</div>
					</div>
					<div className='flex items-center space-x-3 lg:space-x-5'>
						<div className='flex items-center space-x-2'>
							<p className='text-sm font-medium'>Rows</p>
							<Select
								value={limit}
								onValueChange={(value) => {
									if (limit !== value) {
										const url = new URL((window as any).location);
										url.searchParams.set('limit', value);
										router.replace(url.toString());
									}
									table.setPageSize(Number(value));
								}}
							>
								<SelectTrigger className='h-8 w-[70px] text-black dark:text-white'>
									<SelectValue placeholder={limit} />
								</SelectTrigger>
								<SelectContent side='top'>
									{[10, 20, 50, 100, 200, 500].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className='text-sm font-medium'>
							Page {page} of {maxPage}
						</div>
						<div className='flex items-center space-x-2'>
							<Button
								variant='outline'
								className='hidden h-8 w-8 p-0 lg:flex'
								onClick={() => setPage(1)}
								disabled={page === 1}
							>
								<span className='sr-only'>Go to first page</span>
								<DoubleArrowLeftIcon className='h-4 w-4' />
							</Button>
							<Button
								variant='outline'
								className='h-8 w-8 p-0'
								onClick={() => setPage(page - 1)}
								disabled={page === 1}
							>
								<span className='sr-only'>Go to previous page</span>
								<ChevronLeftIcon className='h-4 w-4' />
							</Button>
							<Button
								variant='outline'
								className='h-8 w-8 p-0'
								onClick={() => setPage(page + 1)}
								disabled={page === maxPage}
							>
								<span className='sr-only'>Go to next page</span>
								<ChevronRightIcon className='h-4 w-4' />
							</Button>
							<Button
								variant='outline'
								className='hidden h-8 w-8 p-0 lg:flex'
								onClick={() => setPage(maxPage)}
								disabled={page === maxPage}
							>
								<span className='sr-only'>Go to last page</span>
								<DoubleArrowRightIcon className='h-4 w-4' />
							</Button>
						</div>
						<div>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='outline' className='ml-auto'>
										Columns <ChevronDownIcon className='ml-2 h-4 w-4' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									{table
										.getAllColumns()
										.filter((column) => column.getCanHide())
										.map((column) => {
											return (
												<DropdownMenuCheckboxItem
													key={column.id}
													className='capitalize'
													checked={column.getIsVisible()}
													onCheckedChange={(value) => column.toggleVisibility(!!value)}
												>
													{column.id.replace(/_/g, ' ')}
												</DropdownMenuCheckboxItem>
											);
										})}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>

				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => {
									const link = `?add-phonebook=${row.id}&data=${JSON.stringify(row.original)}`;
									return (
										<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
											{row.getVisibleCells().map((cell) => (
												<TableCellLink href={link} key={cell.id} className='p-2'>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCellLink>
											))}
										</TableRow>
									);
								})
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className='h-24 text-center'>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
			<Show.ShowIf condition={isOpenPhonebookDialog}>
				<PhonebookDialog defaultValues={phonebookData.data!} onSave={handlePhonebookInput} />
			</Show.ShowIf>
		</div>
	);
}
