import express from 'express';
import MessageRoute from './message/message.route';

const router = express.Router();

// Next routes will be webhooks routes

router.use('/message', MessageRoute);
export default router;
