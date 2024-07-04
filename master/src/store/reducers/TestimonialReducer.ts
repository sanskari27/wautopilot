import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { TestimonialState } from '../types/Testimonials';

const initState: TestimonialState = {
	list: [],
	details: {
		title: '',
		name: '',
		photo_url: '',
		description: '',
	},
	ui: {
		isLoading: true,
		isAdding: false,
		isDeleting: false,
	},
};

const Slice = createSlice({
	name: 'Testimonial',
	initialState: initState,
	reducers: {
		setTestimonialList: (state, action: PayloadAction<typeof initState.list>) => {
			state.list = action.payload;
		},
		setTestimonialDetails: (state, action: PayloadAction<typeof initState.details>) => {
			state.details = action.payload;
		},
		setTitle: (state, action: PayloadAction<string>) => {
			state.details.title = action.payload;
		},
		setName: (state, action: PayloadAction<string>) => {
			state.details.name = action.payload;
		},
		setPhotoUrl: (state, action: PayloadAction<string>) => {
			state.details.photo_url = action.payload;
		},
		setDescription: (state, action: PayloadAction<string>) => {
			state.details.description = action.payload;
		},
		setTestimonialLoading: (state, action: PayloadAction<boolean>) => {
			state.ui.isLoading = action.payload;
		},
		setTestimonialAdding: (state, action: PayloadAction<boolean>) => {
			state.ui.isAdding = action.payload;
		},
		setTestimonialDeleting: (state, action: PayloadAction<boolean>) => {
			state.ui.isDeleting = action.payload;
		},
	},
});

export const {
	setTestimonialList,
	setTestimonialDetails,
	setTestimonialLoading,
	setTestimonialAdding,
	setTestimonialDeleting,
	setDescription,
	setName,
	setPhotoUrl,
	setTitle,
} = Slice.actions;

export default Slice.reducer;
