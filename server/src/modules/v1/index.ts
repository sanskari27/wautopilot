import express from 'express';
import FlowsRoute from './flows/flows.route';
import MediaRoute from './media/media.route';
import MessageRoute from './message/message.route';
import TemplateRoute from './template/template.route';

const router = express.Router();

// Next routes will be webhooks routes

router.use('/message', MessageRoute);
router.use('/media', MediaRoute);
router.use('/templates', TemplateRoute);
router.use('/flows', FlowsRoute);

export default router;
