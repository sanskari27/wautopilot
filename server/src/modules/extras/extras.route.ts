import express from 'express';
import Controller from './extras.controller';
import { FAQValidator, TestimonialValidator } from './extras.validator';

const router = express.Router();

router.route('/faqs').post(FAQValidator, Controller.setFaqs).get(Controller.listFaqs);
router.route('/testimonials').post(TestimonialValidator, Controller.setTestimonials).get(Controller.listTestimonials);

export default router;
