'use client';
import { Template } from '@/schema/template';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import DataForm from '../_components/data-form';
import { createTemplate } from '../action';

export default function CreateTemplate() {
	const router = useRouter();
	function handleSave(details: Template) {
		toast.promise(createTemplate(details), {
			success: () => {
				router.replace('/panel/campaigns/templates');
				return 'Template created successfully';
			},
			error: (err) => {
				return err.message || 'Failed to create template';
			},
			loading: 'Saving Template',
		});
	}

	return (
		<div className='p-4'>
			<h2 className='font-bold text-2xl'>Meta Template</h2>
			<div className='mt-4'>
				<DataForm onSave={handleSave} />
			</div>
		</div>
	);
}
