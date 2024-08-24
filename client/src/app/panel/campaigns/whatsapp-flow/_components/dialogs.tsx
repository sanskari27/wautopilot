'use client';
import { createWhatsappFlow, updateWhatsappFlow } from '@/app/panel/campaigns/whatsapp-flow/action';
import { Button } from '@/components/ui/button';
import ComboboxMultiselect from '@/components/ui/combobox-multiselect';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const Categories = [
	'SIGN_UP',
	'SIGN_IN',
	'APPOINTMENT_BOOKING',
	'LEAD_GENERATION',
	'CONTACT_US',
	'CUSTOMER_SUPPORT',
	'SURVEY',
	'OTHER',
] as (
	| 'SIGN_UP'
	| 'SIGN_IN'
	| 'APPOINTMENT_BOOKING'
	| 'LEAD_GENERATION'
	| 'CONTACT_US'
	| 'CUSTOMER_SUPPORT'
	| 'SURVEY'
	| 'OTHER'
)[];

export function WhatsappFlowDialog() {
	const searchParams = useSearchParams();
	const whatsapp_flow = searchParams.get('flow');
	const whatsapp_flow_id = searchParams.get('id');
	const whatsapp_flow_name = searchParams.get('name') ?? '';
	const whatsapp_flow_categories = searchParams.get('categories') ?? '';
	if (whatsapp_flow === 'create') {
		return <WhatsappFlowDetails />;
	} else if (whatsapp_flow === 'edit') {
		return (
			<WhatsappFlowDetails
				id={whatsapp_flow_id ?? ''}
				details={{
					name: whatsapp_flow_name,
					categories: whatsapp_flow_categories.split(',') as typeof Categories,
				}}
			/>
		);
	} else {
		return null;
	}
}

function WhatsappFlowDetails({
	details,
	id,
}: {
	id?: string;
	details?: {
		name: string;
		categories: typeof Categories;
	};
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [name, setName] = useState('');
	const [categories, setCategories] = useState<typeof Categories>([]);

	useEffect(() => {
		setName(details?.name ?? '');
		setCategories(details?.categories ?? []);
	}, [details]);

	async function handleSave() {
		const promise = id
			? updateWhatsappFlow(id, { name, categories })
			: createWhatsappFlow({ name, categories });

		toast.promise(promise, {
			loading: 'Saving...',
			success: () => {
				router.replace(pathname);
				return 'Whatsapp flow saved successfully.';
			},
			error: 'Error saving whatsapp flow Please try again.',
		});
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
			<DialogContent className='sm:max-w-[425px] md:max-w-xl lg:max-w-3xl'>
				<DialogHeader>
					<DialogTitle className='text-center'>Whatsapp flow details</DialogTitle>
				</DialogHeader>
				<div className='grid gird-cols-1 gap-4'>
					<div>
						<Input placeholder='Title' value={name} onChange={(e) => setName(e.target.value)} />
					</div>
					<ComboboxMultiselect
						items={Categories.map((category) => ({
							value: category,
							label: category,
						}))}
						onChange={(value) => setCategories(value as typeof Categories)}
						placeholder='Select Category'
						value={categories}
					/>
				</div>
				<DialogFooter>
					<Button
						variant={'ghost'}
						onClick={() => {
							router.replace(pathname);
						}}
					>
						Close
					</Button>
					<Button onClick={handleSave}>Create Whatsapp Flow</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
