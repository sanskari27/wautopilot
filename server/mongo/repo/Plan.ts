import mongoose from 'mongoose';
import IPlan from '../types/plan';

export const PlanDB_name = 'Plan';

const schema = new mongoose.Schema<IPlan>({
	plan_name: {
		type: String,
		required: true,
	},
	plan_description: String,
	plan_price: {
		type: Number,
		required: true,
	},
	plan_duration: {
		type: Number,
		required: true,
	},
	features: {
		type: Object,
		default: {},
	},
	no_of_agents: Number,
	no_of_devices: Number,
});

const PlanDB = mongoose.model<IPlan>(PlanDB_name, schema);

export default PlanDB;
