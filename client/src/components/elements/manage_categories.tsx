'use client';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import OrganizationService from '@/services/organization.service';
import { Loader2, Plus, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Each from '../containers/each';
import { useOrganizationDetails } from '../context/organization-details';
import { Badge } from '../ui/badge';

export function ManageCategoriesDialog() {
	const searchParams = useSearchParams();
	const modal = searchParams.get('manage_categories');

	if (!modal) return null;

	return <ManageCategoriesForm />;
}

export function ManageCategoriesForm() {
	const pathname = usePathname();
	const org_id = pathname.split('/')[2];
	const { categories, is_owner } = useOrganizationDetails();
	const [isLoading, setLoading] = useState(false);
	const [text, setText] = useState('');
	const [categoriesList, setCategoriesList] = useState(categories);

	useEffect(() => {
		if (!is_owner) {
			toast.error(`You don't have permission to update categories.`);
		}
	}, [is_owner]);

	const router = useRouter();

	async function handleSave() {
		setLoading(true);
		const success = await OrganizationService.updateCategories(org_id, categoriesList);
		setLoading(false);
		if (success) {
			toast.success('Categories updated successfully.');
			router.replace(pathname);
		} else {
			toast.error(`You don't have permission to update categories.`);
		}
	}

	if (!is_owner) {
		return null;
	}

	return (
		<Dialog
			defaultOpen={true}
			onOpenChange={(value) => {
				if (!value) {
					router.replace(pathname);
				}
			}}
		>
			<DialogContent className='max-w-sm md:max-w-lg lg:max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Manage Categories</DialogTitle>
					<DialogDescription>
						Removing a category will remove it from all find of filters and reports.
					</DialogDescription>
					<DialogDescription>Note: Tasks under the category will not be deleted.</DialogDescription>
				</DialogHeader>
				<div className='flex justify-between gap-3 items-end'>
					<div className='grid gap-2 flex-1'>
						<Label htmlFor='category'>Add Category</Label>
						<Input
							id='category'
							type='text'
							placeholder='Ex. Accounts'
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
					</div>
					<Button
						variant={'outline'}
						size={'icon'}
						className={cn(
							'rounded-full',
							!text || categoriesList.includes(text) ? 'cursor-not-allowed' : 'cursor-pointer'
						)}
						disabled={!text || categoriesList.includes(text)}
						onClick={() => {
							setCategoriesList([...categoriesList, text]);
							setText('');
						}}
					>
						<Plus />
					</Button>
				</div>

				<div className='flex flex-wrap gap-y-2 gap-x-3'>
					<Each
						items={categoriesList}
						render={(category) => (
							<CategoryItem
								category={category}
								onRemove={() => {
									setCategoriesList(categoriesList.filter((c) => c !== category));
								}}
							/>
						)}
					/>
				</div>

				<DialogFooter>
					<Button className='w-full' disabled={isLoading} onClick={handleSave}>
						{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function CategoryItem({ category, onRemove }: { category: string; onRemove: () => void }) {
	return (
		<Badge className='inline-flex gap-2'>
			{category}
			<X size={'1rem'} className='cursor-pointer' onClick={(e) => onRemove()} />
		</Badge>
	);
}
