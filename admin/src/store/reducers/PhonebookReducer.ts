import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { PhonebookState } from '../types/PhonebookState';

const initialState: PhonebookState = {
	list: [],
	details: {
		id: '',
		salutation: '',
		first_name: '',
		last_name: '',
		middle_name: '',
		phone_number: '',
		email: '',
		birthday: '',
		anniversary: '',
		others: {},
		labels: [],
	},
	csv: {
		file: null,
		labels: [],
	},
	uiDetails: {
		isSaving: false,
		isFetching: false,
		error: '',
	},
	selected: [],
	pagination: {
		page: 1,
		maxPage: 1,
	},
	field_name: '',
	label_input: '',
	labels: [],
};

const Slice = createSlice({
	name: StoreNames.PHONEBOOK,
	initialState,
	reducers: {
		reset: (state) => {
			state.list = initialState.list;
			state.details = initialState.details;
			state.selected = initialState.selected;
			state.uiDetails = initialState.uiDetails;
			state.field_name = initialState.field_name;
			state.csv = initialState.csv;
		},
		setPhonebookList: (state, action: PayloadAction<PhonebookState['list']>) => {
			state.list = action.payload;
			state.selected = [];
		},
		selectPhonebook: (state, action: PayloadAction<string>) => {
			state.details =
				state.list.find((record) => record.id === action.payload) || initialState.details;
		},
		updatePhonebookRecord: (
			state,
			action: PayloadAction<{
				id: string;
				details: PhonebookState['list'][0];
			}>
		) => {
			state.list = state.list.map((record) =>
				record.id === action.payload.id ? action.payload.details : record
			);
		},
		addPhonebookRecord: (state, action: PayloadAction<PhonebookState['list'][0]>) => {
			state.list = [action.payload, ...state.list];
		},
		clearDetails: (state) => {
			state.details = initialState.details;
		},
		setSalutation: (state, action: PayloadAction<string>) => {
			state.details.salutation = action.payload;
		},
		setFirstName: (state, action: PayloadAction<string>) => {
			state.details.first_name = action.payload;
		},
		setLastName: (state, action: PayloadAction<string>) => {
			state.details.last_name = action.payload;
		},
		setMiddleName: (state, action: PayloadAction<string>) => {
			state.details.middle_name = action.payload;
		},
		setPhoneNumber: (state, action: PayloadAction<string>) => {
			if (isNaN(Number(action.payload))) {
				return;
			}
			state.details.phone_number = action.payload;
		},
		setEmail: (state, action: PayloadAction<string>) => {
			state.details.email = action.payload;
		},
		setBirthday: (state, action: PayloadAction<string>) => {
			state.details.birthday = action.payload;
		},
		setAnniversary: (state, action: PayloadAction<string>) => {
			state.details.anniversary = action.payload;
		},
		setOthers: (state, action: PayloadAction<{ key: string; value: string }>) => {
			state.details.others[action.payload.key] = action.payload.value;
		},
		removeOtherKey: (state, action: PayloadAction<string>) => {
			delete state.details.others[action.payload];
		},
		setDetailLabels: (state, action: PayloadAction<string[]>) => {
			state.details.labels = action.payload;
		},
		addDetailsLabel: (state, action: PayloadAction<string>) => {
			if (!state.details.labels.includes(action.payload)) {
				state.details.labels.push(action.payload);
			}
		},
		addDetailsLabels: (state, action: PayloadAction<string[]>) => {
			action.payload.forEach((label) => {
				if (!state.details.labels.includes(label)) {
					state.details.labels.push(label);
				}
			});
		},
		addLabelInput: (state, action: PayloadAction<string>) => {
			state.label_input = action.payload;
			if (state.label_input.includes(' ')) {
				const label = state.label_input.split(' ')[0];
				if (!state.details.labels.includes(label) && label.trim().length !== 0) {
					state.details.labels.push(label);
				}
				state.label_input = '';
			}
		},
		removeDetailsLabel: (state, action: PayloadAction<string>) => {
			state.details.labels = state.details.labels.filter((label) => label !== action.payload);
		},
		setSaving: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isSaving = action.payload;
		},
		setFetching: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isFetching = action.payload;
		},
		setError: (state, action: PayloadAction<string>) => {
			state.uiDetails.error = action.payload;
		},
		setMaxPage: (state, action: PayloadAction<number>) => {
			state.pagination.maxPage = action.payload;
		},
		nextPage: (state) => {
			state.pagination.page = Math.min(state.pagination.page + 1, state.pagination.maxPage);
		},
		prevPage: (state) => {
			state.pagination.page = Math.max(state.pagination.page - 1, 1);
		},
		setFieldName: (state, action: PayloadAction<string>) => {
			state.field_name = action.payload;
		},
		setFile: (state, action: PayloadAction<typeof initialState.csv.file>) => {
			state.csv.file = action.payload;
		},
		setCSVLabels: (state, action: PayloadAction<string[]>) => {
			state.csv.labels = action.payload;
		},
		addSelected: (state, action: PayloadAction<string>) => {
			state.selected.push(action.payload);
		},
		removeSelected: (state, action: PayloadAction<string>) => {
			state.selected = state.selected.filter((id) => id !== action.payload);
		},
		setLabels: (state, action: PayloadAction<string[]>) => {
			state.labels = action.payload;
		},
	},
});

export const {
	reset,
	setPhonebookList,
	selectPhonebook,
	clearDetails,
	setSalutation,
	setFirstName,
	setLastName,
	setMiddleName,
	setPhoneNumber,
	setEmail,
	setBirthday,
	setAnniversary,
	setOthers,
	removeOtherKey,
	setSaving,
	setFetching,
	setError,
	setMaxPage,
	nextPage,
	prevPage,
	setFieldName,
	setDetailLabels,
	setFile,
	setCSVLabels,
	addSelected,
	removeSelected,
	addDetailsLabels,
	removeDetailsLabel,
	addDetailsLabel,
	addLabelInput,
	setLabels,
	addPhonebookRecord,
	updatePhonebookRecord,
} = Slice.actions;

export default Slice.reducer;
