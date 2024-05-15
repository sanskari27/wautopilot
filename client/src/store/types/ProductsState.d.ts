export type ProductsState = {
	list: Product[];
	customizations: ProductDetails[];
	productDetails: ProductDetails;
	uiDetails: {
		isSaving: boolean;
		isFetching: boolean;
		isDeleting: boolean;
		isCreating: boolean;
		isUpdating: boolean;
		error: string;
	};
	pricing_bifurcation: string;
	productGroups: ProductGroup[];
	selectedProductGroup: ProductGroup;
};

type ProductGroup = {
	id: string;
	name: string;
	productCodes: string[];
};
type Product = {
	id: string;
	productCode: string;
	name: string;
	price: number;
	isBestSeller: boolean;
};

type ProductDetails = {
	id: string;
	productCode: string;
	name: string;
	description: string;
	details: string;
	pricing_bifurcation: string;
	images: string[];
	videos: string[];
	tags: string[];
	size: string;
	metal_color: string;
	metal_type: string;
	metal_quality: string;
	diamond_type: string;
	price: number;
	discount: number;
	discontinued: boolean;
	listedOn: string;
};
