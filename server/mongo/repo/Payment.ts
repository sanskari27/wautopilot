import mongoose, { Schema } from 'mongoose';
import converter from 'number-to-words';
import { Path, TRANSACTION_STATUS } from '../../src/config/const';
import DateUtils from '../../src/utils/DateUtils';
import { generateInvoiceID } from '../../src/utils/ExpressUtils';
import FileUtils from '../../src/utils/FileUtils';
import InvoiceGenerator, { IGSTBill, NonGSTBill, SGSTBill } from '../../src/utils/InvoiceGenerator';
import IPayment from '../types/payment';
import { AccountDB_name } from './Account';
import { PlanDB_name } from './Plan';

export const PaymentDB_name = 'Payment';

const schema = new mongoose.Schema<IPayment>({
	linked_to: {
		type: Schema.Types.ObjectId,
		ref: AccountDB_name,
		required: true,
	},
	plan_id: {
		type: Schema.Types.ObjectId,
		ref: PlanDB_name,
		required: true,
	},
	quantity: {
		type: Number,
		default: 1,
	},
	billing_details: {
		name: String,
		phone_number: String,
		email: String,
		billing_address: {
			type: {
				street: String,
				city: String,
				district: String,
				state: String,
				country: String,
				pincode: String,
				gstin: String,
			},
		},
	},

	transaction_status: {
		type: String,
		enum: Object.values(TRANSACTION_STATUS),
		default: TRANSACTION_STATUS.PENDING,
		required: true,
	},
	gross_amount: {
		type: Number,
		required: true,
	},
	discount: {
		type: Number,
		required: true,
		default: 0,
	},
	total_amount: {
		type: Number,
		required: true,
	},
	tax: {
		type: Number,
		required: true,
	},

	invoice_date: {
		type: Date,
		default: Date.now,
	},
	payment_id: String,
	order_id: String,
	invoice_id: String,

	invoice_generated: {
		type: Boolean,
		default: false,
	},
});

schema.pre('save', async function (next) {
	if (this.transaction_status !== TRANSACTION_STATUS.SUCCESS) {
		return next();
	}
	if (!this.invoice_id) {
		const count = (await PaymentDB.countDocuments()) + 1;
		this.invoice_id = generateInvoiceID(count.toString());
	}
	const destination = __basedir + Path.Invoice + this._id + '.pdf';
	if (this.payment_id && !FileUtils.exists(destination)) {
		const generator = new InvoiceGenerator(destination);
		generator.addHeader(this.invoice_id);
		generator.addBillingDetails({
			...this.billing_details,
			payment_details: {
				invoice_date: DateUtils.getMoment(this.invoice_date).format('DD/MMM/YYYY'),
				order_id: this.order_id,
				payment_id: this.payment_id,
			},
		});

		generator.addProduct({
			id: '1',
			service: 'Wautopilot.com Subscription',
			plan: this.plan_id.toString(),
			sac: '997331',
			start: DateUtils.getMoment(this.invoice_date).format('DD/MMM/YYYY'),
			end: 'Based on plans',
			qty: '1',
			rate: this.gross_amount.toFixed(2),
			amount: this.total_amount.toFixed(2),
		});

		let amountDetails = {
			discount: this.discount.toFixed(2),
			sub_total: (this.gross_amount - this.discount).toFixed(2),
			total: this.total_amount.toFixed(2),
			total_in_words: converter.toWords(this.total_amount),
			gst_bill: true,
			isIGST: false,
			igst: 0,
			sgst: 0,
			cgst: 0,
		};

		if (this.billing_details.billing_address.country.toLowerCase() === 'india') {
			if (this.billing_details.billing_address.state.toLowerCase() === 'delhi') {
				amountDetails.isIGST = true;
				amountDetails.igst = this.tax;
			} else {
				amountDetails.cgst = this.tax / 2;
				amountDetails.sgst = this.tax / 2;
			}
		} else {
			amountDetails.gst_bill = false;
		}
		generator.addAmountDetails(amountDetails as IGSTBill | SGSTBill | NonGSTBill);
		generator.addFooter({
			invoice_date: DateUtils.getMoment(this.invoice_date).format('DD/MMM/YYYY'),
		});
		await generator.build();
		this.invoice_generated = true;
	}
	next();
});

const PaymentDB = mongoose.model<IPayment>(PaymentDB_name, schema);

export default PaymentDB;
