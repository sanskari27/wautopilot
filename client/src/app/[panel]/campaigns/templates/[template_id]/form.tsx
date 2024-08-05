'use client';

import { templateSchema } from '@/schema/template';
import TemplateService from '@/services/template.service';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import DataForm from '../_components/data-form';

export default function TemplateForm({
	id,
	template,
}: {
	id: string;
	template: z.infer<typeof templateSchema>;
}) {
	function handleSave(details: z.infer<typeof templateSchema>) {
		toast.promise(TemplateService.editTemplate({ ...details, id }), {
			success: 'Template saved successfully',
			error: (err) => {
				return err.message || 'Failed to save template';
			},
			loading: 'Saving Template',
		});
	}

	return <DataForm onSave={handleSave} defaultValues={template} />;
}
