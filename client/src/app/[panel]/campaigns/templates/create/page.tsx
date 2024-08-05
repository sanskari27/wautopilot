'use client';
import { templateSchema } from '@/schema/template';
import TemplateService from '@/services/template.service';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import DataForm from '../_components/data-form';

export default function CreateTemplate() {
	function handleSave(details: z.infer<typeof templateSchema>) {
		toast.promise(TemplateService.addTemplate(details), {
			success: 'Template created successfully',
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
