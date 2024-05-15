import api from '@/lib/api';

export async function productDetails(code: string) {
	try {
		const { data } = await api.get(`/products/product-code/${code}`);
		const products = data.products as {
			id: string;
			productCode: string;
			name: string;
			description: string;
			details: string;
			pricing_bifurcation: string;
			images: string[];
			videos: string[];
			tags: string[];
			size: string | null;
			metal_color: string;
			metal_type: string;
			metal_quality: string;
			diamond_type: string | null;
			price: number;
			discount: number;
			discontinued: boolean;
			listedOn: Date;
		}[];
		return products;
	} catch (err) {
		return [];
	}
}

export type ProductsQuery = {
	price_max: string;
	price_min: string;
	metals: string;
	purity: string;
	collection_ids: string;
	tags: string;
	skip: string;
	limit: string;
	sort: string;
};
export async function products(query: ProductsQuery) {
	try {
		const { data } = await api.get(`/products`, {
			params: query,
		});
		const products = data.products as {
			id: string;
			productCode: string;
			price: number;
			discount: number;
			images: string[];
			videos: string[];
		}[];
		return products.map((item) => ({
			...item,
			image: item.images.length > 0 ? item.images[0] : '',
			video: item.videos.length > 0 ? item.videos[0] : '',
		}));
	} catch (err) {
		return [];
	}
}

export async function similarProducts(code: string) {
	try {
		const { data } = await api.delete(`/product-group/similar-products/${code}`);
		const products = data.products as {
			productCode: string;
			image: string;
			discount: number;
			price: number;
		}[];
		return products;
	} catch (err) {
		return [];
	}
}

export async function getCollections() {
	try {
		const { data } = await api.get(`/collections`);
		const collections = data.collections as {
			id: string;
			name: string;
			image: string;
			tags: string[];
			visibleAtHome: boolean;
			productCodes: string[];
		}[];
		return collections;
	} catch (err) {
		return [];
	}
}

export async function homeCollections() {
	try {
		const { data } = await api.get(`/collections/home-collections`);
		const collections = data.collections as {
			id: string;
			name: string;
			image: string;
			tags: string[];
			visibleAtHome: boolean;
			productCodes: string[];
		}[];
		return collections;
	} catch (err) {
		return [];
	}
}

export async function getBestSellers() {
	try {
		const { data } = await api.get(`/products/best-sellers`);

		const products = data.products as {
			productCode: string;
			image: string;
		}[];
		return products;
	} catch (err) {
		return [];
	}
}
