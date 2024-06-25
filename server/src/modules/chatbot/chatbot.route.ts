import express from 'express';
import { IDValidator } from '../../middleware';
import Controller from './chatbot.controller';
import { CreateBotValidator } from './chatbot.validator';

const router = express.Router();

router
	.route('/:id')
	.all(IDValidator)
	.delete(Controller.deleteBot)
	.put(Controller.toggleActive)
	.all(CreateBotValidator)
	.patch(Controller.updateBot);

router.route('/').get(Controller.listBots).all(CreateBotValidator).post(Controller.createBot);

export default router;
