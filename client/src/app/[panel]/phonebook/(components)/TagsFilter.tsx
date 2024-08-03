'use client';
import TagsSelector from '@/components/elements/popover/tags';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TagsFilter() {
	const router = useRouter();
	const [tags, setSelectedTags] = useState<string[]>([]);

	useEffect(() => {
		const url = new URL((window as any).location);
		setSelectedTags(url.searchParams.getAll('tags') ?? []);
	}, []);

	const setSelected = (selected: string[]) => {
		setSelectedTags(selected);
		const url = new URL((window as any).location);
		url.searchParams.delete('tags');
		selected.forEach((tag) => {
			url.searchParams.append('tags', tag);
		});
		router.replace(url.toString());
	};

	return (
		<TagsSelector onChange={setSelected} selected={tags}>
			<Button variant='secondary' size={'icon'}>
				<ListFilter className='w-4 h-4' strokeWidth={3} />
			</Button>
		</TagsSelector>
	);
}
