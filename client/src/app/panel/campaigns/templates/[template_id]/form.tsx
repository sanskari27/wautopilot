'use client';

import { Template } from '@/schema/template';
import TemplateService from '@/services/template.service';
import { toast } from 'react-hot-toast';
import DataForm from '../_components/data-form';

export default function TemplateForm({ id, template }: { id: string; template: Template }) {
	function handleSave(details: Template) {
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
