'use server';

import { Template } from '@/schema/template';
import TemplateService from '@/services/template.service';
import { revalidatePath } from 'next/cache';

export const createTemplate = async (details: Template) => {
	await TemplateService.addTemplate(details);
	revalidatePath('/panel/campaigns/templates', 'page');
};

export const editTemplate = async (details: Template, id: string) => {
	await TemplateService.editTemplate({ ...details, id });
	revalidatePath('/panel/campaigns/templates', 'page');
};

export const removeTemplate = async (id: string, name: string) => {
	await TemplateService.removeTemplate(id, name);
	revalidatePath('/panel/campaigns/templates', 'page');
};
