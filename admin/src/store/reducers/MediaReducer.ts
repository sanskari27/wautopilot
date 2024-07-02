import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { Media, MediaState } from '../types/MediaState';

const initialState: MediaState = {
	list: [],
	uiDetails: {
		isSaving: false,
		isFetching: false,
		error: '',
	},
	details: {
		id: '',
		filename: '',
		file_length: 0,
		mime_type: '',
		media_id: '',
		media_url: '',
	},
	file: null,
	size: '',
	url: '',
	type: '',
	filename: '',
};

const Slice = createSlice({
	name: StoreNames.BROADCAST,
	initialState,
	reducers: {
		reset: (state) => {
			state.list = initialState.list;
			state.details = initialState.details;
			state.uiDetails = initialState.uiDetails;
			state.file = initialState.file;
			state.size = initialState.size;
			state.url = initialState.url;
			state.type = initialState.type;
		},
		setMediaList: (state, action: PayloadAction<Media[]>) => {
			state.list = action.payload;
		},
		setDetails: (state, action: PayloadAction<Media>) => {
			state.details = action.payload;
		},
		setFile: (
			state,
			action: PayloadAction<{
				file: typeof initialState.file;
				type: string;
				size: string;
				url: string;
			}>
		) => {
			state.file = action.payload.file;
			state.type = action.payload.type;
			state.url = action.payload.url;
			state.size = action.payload.size;
		},
		removeFile: (state) => {
			state.file = null;
			state.type = '';
			state.url = '';
			state.size = '';
		},
		addMedia: (state, action: PayloadAction<Media>) => {
			state.list.push(action.payload);
		},
		setSaving: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isSaving = action.payload;
		},
		setMediaFetching: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isFetching = action.payload;
		},
		deleteMedia: (state, action: PayloadAction<string>) => {
			state.list = state.list.filter((m) => m.id !== action.payload);
		},
		setError: (state, action: PayloadAction<string>) => {
			state.uiDetails.error = action.payload;
		},
		setFilename: (state, action: PayloadAction<string>) => {
			state.filename = action.payload;
		},
	},
});

export const {
	reset,
	setMediaList,
	setDetails,
	setFile,
	setSaving,
	setMediaFetching,
	deleteMedia,
	setError,
	removeFile,
	addMedia,
	setFilename,
} = Slice.actions;

export default Slice.reducer;
