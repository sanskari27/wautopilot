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
import { parseToObject } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createFAQs } from '../action';

const DEFAULT_VALUE = {
	title: '',
	info: '',
};

export default function FAQDialog({ list }: { list: { title: string; info: string }[] }) {
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

	return <FAQDetails onSave={onSave} onClose={onClose} details={raw ?? DEFAULT_VALUE} />;
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
				<div>Title</div>
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
				<div>Info</div>
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
