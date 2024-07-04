import { Request, Response } from 'express';
import { StorageDB } from '../../../mongo';
import { Respond } from '../../utils/ExpressUtils';
import { FAQValidationResult, TestimonialsValidationResult } from './extras.validator';

const FAQS = 'faqs';
const TESTIMONIALS = 'testimonials';

async function setFaqs(req: Request, res: Response) {
	const data = req.locals.data as FAQValidationResult;

	await StorageDB.setObject(FAQS, data);
	return Respond({
		res,
		status: 200,
	});
}

async function listFaqs(req: Request, res: Response) {
	const data = await StorageDB.getObject(FAQS);
	return Respond({
		res,
		status: 200,
		data: {
			list: Array.isArray(data) ? data : [],
		},
	});
}

async function setTestimonials(req: Request, res: Response) {
	const data = req.locals.data as TestimonialsValidationResult;

	await StorageDB.setObject(TESTIMONIALS, data);
	return Respond({
		res,
		status: 200,
	});
}

async function listTestimonials(req: Request, res: Response) {
	const data = await StorageDB.getObject(TESTIMONIALS);
	return Respond({
		res,
		status: 200,
		data: {
			list: Array.isArray(data) ? data : [],
		},
	});
}

const Controller = {
	setFaqs,
	listFaqs,
	setTestimonials,
	listTestimonials,
};

export default Controller;
