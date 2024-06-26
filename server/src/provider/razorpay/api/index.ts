import Customers from './customers';
import Emandate from './emandate';
import Orders from './orders';
import Payments from './payments';
import Refunds from './refunds';
import Subscription from './subscription';
import Validations from './validator';

const RazorpayProvider = {
	customers: Customers,
	orders: Orders,
	emandate: Emandate,
	payments: Payments,
	subscription: Subscription,
	refunds: Refunds,
	validations: Validations,
};

export default RazorpayProvider;
