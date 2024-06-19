import { Document, Types } from 'mongoose';
import { Permissions } from '../../src/config/const';

type Features = {
	[feature in Permissions]: boolean;
};

export default interface IPlan extends Document {
	_id: Types.ObjectId;
	plan_name: string;
	plan_description: string;
	plan_price: number;
	plan_duration: number;
	features: Features;
	no_of_agents: number;
	no_of_devices: number;
}
