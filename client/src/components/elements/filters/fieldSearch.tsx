'use client';

import Each from '@/components/containers/each';
import { useFields } from '@/components/context/tags';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CircleMinus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type Fields = {
	[key: string]: string;
};

export default function FieldSearch() {
	const loaded = useRef(false);
	const router = useRouter();
	const fieldsList = useFields();
	const [fieldName, setFieldName] = useState('all');
	const [search, setSearch] = useState('');
	const [fields, setFields] = useState<Fields>({});

	useEffect(() => {
		const url = new URL((window as any).location);
		const fields: Fields = {};
		url.searchParams.forEach((value, key) => {
			if (key.startsWith('search_')) {
				fields[key.replace('search_', '')] = value;
			}
		});
		setFields(fields);
	}, []);

	function addToSearchParams(key: string, value: string) {
		setFields((fields) => ({ ...fields, [key]: value }));

		const url = new URL((window as any).location);
		url.searchParams.forEach((_, _key) => {
			if (!_key.startsWith('search_')) {
				return;
			}
			const key = _key.replace('search_', '') as keyof Fields;
			if (!fields[key]) {
				url.searchParams.delete(_key);
			} else {
				url.searchParams.set(_key, fields[key]);
			}
		});
		(Object.keys(fields) as Array<keyof Fields>).forEach((key) => {
			if (!url.searchParams.has(`search_${key}`)) {
				url.searchParams.set(`search_${key}`, fields[key]);
			}
		});
		if (!url.searchParams.has(`search_${key}`)) {
			url.searchParams.set(`search_${key}`, value);
		}
		router.push(url.toString());
	}

	function removeFromSearchParams(key: keyof Fields) {
		setFields((fields) => {
			const newFields = { ...fields };
			delete newFields[key];
			return newFields;
		});

		const url = new URL((window as any).location);
		url.searchParams.forEach((_, _key) => {
			if (!_key.startsWith('search_')) {
				return;
			}
			const key2 = _key.replace('search_', '') as keyof Fields;
			if (!fields[key2] || key2 === key) {
				url.searchParams.delete(_key);
			} else {
				url.searchParams.set(_key, fields[key2]);
			}
		});
		(Object.keys(fields) as Array<keyof Fields>).forEach((_key) => {
			if (!url.searchParams.has(`search_${_key}`) && _key !== key) {
				url.searchParams.set(`search_${_key}`, fields[_key]);
			}
		});
		router.push(url.toString());
	}

	const handleSearch = () => {
		if (search && fieldName) {
			addToSearchParams(fieldName, search);
			setFieldName('');
			setSearch('');
		}
	};

	return (
		<div>
			<div className='flex flex-col justify-center gap-2'>
				<div className='w-full border rounded-md inline-flex '>
					<div className='w-1/4 h-full'>
						<Combobox
							items={fieldsList}
							placeholder='Filter by'
							value={fieldName}
							onChange={setFieldName}
							buttonVariant='ghost'
						/>
					</div>
					<div className='flex-1 w-3/4 flex gap-2 items-center'>
						<div className='flex-1'>
							<Input
								placeholder='Search'
								value={search}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && search && fieldName) {
										addToSearchParams(fieldName, search);
										setFieldName('');
										setSearch('');
									}
								}}
								onChange={(e) => setSearch(e.target.value.replace('=', ''))}
							/>
						</div>
						<Button size={'icon'} variant={'outline'} onClick={handleSearch}>
							<Search className='w-4 h-4' />
						</Button>
					</div>
				</div>
				<div
					className={cn(
						'flex flex-wrap items-center border border-dashed border-gray-400 rounded-md overflow-hidden gap-x-2 gap-y-1',
						Object.keys(fields).length === 0 ? 'p-0' : 'p-2'
					)}
				>
					<Each
						items={Object.keys(fields) as Array<keyof Fields>}
						render={(key) => (
							<Badge className='text-sm font-normal'>
								<span className='capitalize'>{key.toString().replaceAll('_', ' ')}</span>
								<span className='mx-1'>:</span>
								<span>{fields[key]}</span>
								<CircleMinus
									className='w-3 h-3 ml-2 cursor-pointer'
									onClick={() => removeFromSearchParams(key)}
								/>
							</Badge>
						)}
					/>
				</div>
			</div>
		</div>
	);
}
