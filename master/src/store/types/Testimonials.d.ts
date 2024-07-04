export type TestimonialState = {
	list: Testimonial[];
	details: Testimonial;
	ui: {
		isLoading: boolean;
		isAdding: boolean;
		isDeleting: boolean;
	};
};

export type Testimonial = {
	title: string;
	name: string;
	photo_url: string;
	description: string;
};
