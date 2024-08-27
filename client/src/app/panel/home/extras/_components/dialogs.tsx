'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseToObject } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createFAQs, createTestimonials } from '../action';

const DEFAULT_VALUE_FAQ = {
	title: '',
	info: '',
};

const DEFAULT_VALUE_TESTIMONIAL = {
	title: '',
	name: '',
	photo_url: '',
	description: '',
};

export function FAQDialog({ list }: { list: { title: string; info: string }[] }) {
	const pathName = usePathname();
	const router = useRouter();
	const id = useSearchParams().get('faq');
	const raw = parseToObject(useSearchParams().get('data')) as { title: string; info: string };

	const onClose = () => {
		router.replace(pathName);
	};

	const onSave = (details: { title: string; info: string }) => {
		let newList: { title: string; info: string }[] = [];
		if (id === 'create') {
			newList = [...list, details];
		} else {
			newList = list.map((item, i) => {
				if (i === Number(id)) {
					return details;
				}
				return item;
			});
		}
		toast.promise(createFAQs(newList), {
			loading: 'Creating FAQ',
			success: () => {
				onClose();
				return 'FAQ Created';
			},
			error: () => {
				return 'Error while creating FAQ';
			},
		});
	};

	if (!id) {
		return null;
	}

	return <FAQDetails onSave={onSave} onClose={onClose} details={raw ?? DEFAULT_VALUE_FAQ} />;
}

function FAQDetails({
	onClose,
	details: _details,
	onSave,
}: {
	onSave: (details: { title: string; info: string }) => void;
	onClose: () => void;
	details: { title: string; info: string };
}) {
	const [details, setDetails] = useState<{
		title: string;
		info: string;
	}>(_details);

	return (
		<Dialog open={true} onOpenChange={(value) => !value && onClose()}>
			<DialogContent>
				<DialogHeader>FAQ Details</DialogHeader>
				<Label>
					Title<span className='ml-[0.2rem] text-red-800'>*</span>
				</Label>
				<Input
					value={details.title}
					onChange={(e) =>
						setDetails((prev) => {
							return {
								...prev,
								title: e.target.value,
							};
						})
					}
				/>
				<Label>
					Info<span className='ml-[0.2rem] text-red-800'>*</span>
				</Label>
				<Input
					value={details.info}
					onChange={(e) =>
						setDetails((prev) => {
							return {
								...prev,
								info: e.target.value,
							};
						})
					}
				/>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant={'destructive'}>Delete</Button>
					</DialogClose>
					<Button onClick={() => onSave(details)} disabled={!details.title || !details.info}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
export function TestimonialDialog({
	list,
}: {
	list: {
		title: string;
		name: string;
		photo_url: string;
		description: string;
	}[];
}) {
	const pathName = usePathname();
	const router = useRouter();
	const id = useSearchParams().get('testimonial');
	const raw = parseToObject(useSearchParams().get('data')) as {
		title: string;
		name: string;
		photo_url: string;
		description: string;
	};

	const onClose = () => {
		router.replace(pathName);
	};

	const onSave = (details: {
		title: string;
		name: string;
		photo_url: string;
		description: string;
	}) => {
		if (details.description.length < 300 || details.description.length > 400) {
			toast.error('Description should be between 300 and 400 characters');
			return;
		}
		let newList: {
			title: string;
			name: string;
			photo_url: string;
			description: string;
		}[] = [];
		if (id === 'create') {
			newList = [...list, details];
		} else {
			newList = list.map((item, i) => {
				if (i === Number(id)) {
					return details;
				}
				return item;
			});
		}
		toast.promise(createTestimonials(newList), {
			loading: 'Creating Testimonial',
			success: () => {
				onClose();
				return 'Testimonial Created';
			},
			error: () => {
				return 'Error while creating Testimonial';
			},
		});
	};

	if (!id) {
		return null;
	}

	return (
		<TestimonialDetails
			onSave={onSave}
			onClose={onClose}
			details={raw ?? DEFAULT_VALUE_TESTIMONIAL}
		/>
	);
}

function TestimonialDetails({
	onClose,
	details: _details,
	onSave,
}: {
	onSave: (details: {
		title: string;
		name: string;
		photo_url: string;
		description: string;
	}) => void;
	onClose: () => void;
	details: {
		title: string;
		name: string;
		photo_url: string;
		description: string;
	};
}) {
	const [details, setDetails] = useState<{
		title: string;
		name: string;
		photo_url: string;
		description: string;
	}>(_details);

	return (
		<Dialog open={true} onOpenChange={(value) => !value && onClose()}>
			<DialogContent>
				<DialogHeader>Testimonial Details</DialogHeader>
				<Label>
					Title<span className='ml-[0.2rem] text-red-800'>*</span>
				</Label>
				<Input
					placeholder='eg. Love it...'
					value={details.title}
					onChange={(e) =>
						setDetails((prev) => {
							return {
								...prev,
								title: e.target.value,
							};
						})
					}
				/>
				<Label>
					Name<span className='ml-[0.2rem] text-red-800'>*</span>
				</Label>
				<Input
					placeholder='eg. John Doe'
					value={details.name}
					onChange={(e) =>
						setDetails((prev) => {
							return {
								...prev,
								name: e.target.value,
							};
						})
					}
				/>
				<Label>
					Description ({details.description.length} words)
					<span className='ml-[0.2rem] text-red-800'>*</span>
				</Label>
				<Input
					placeholder='eg. I love the product...'
					value={details.description}
					onChange={(e) =>
						setDetails((prev) => {
							return {
								...prev,
								description: e.target.value,
							};
						})
					}
				/>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant={'destructive'}>Delete</Button>
					</DialogClose>
					<Button
						onClick={() => onSave(details)}
						disabled={!details.title || !details.description || !details.name}
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
