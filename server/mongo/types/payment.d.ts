import { Document, Types } from 'mongoose';

export default interface IPayment extends Document {
	_id: Types.ObjectId;
	linked_to: Types.ObjectId;

	plan_id: Types.ObjectId;
	quantity: number;

	billing_details: {
		name: string;
		phone_number: string;
		email: string;

		billing_address: {
			street: string;
			city: string;
			district: string;
			state: string;
			country: string;
			pincode: string;
			gstin: string;
		};
	};

	transaction_status: TRANSACTION_STATUS;
	gross_amount: number;
	discount: number;
	total_amount: number;
	tax: number;

	invoice_date: Date;
	payment_id: string;
	order_id: string;
	invoice_id: string;

	invoice_generated: boolean;
}
