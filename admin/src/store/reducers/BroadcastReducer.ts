import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { BroadcastState } from '../types/BroadcastState';

const initialState: BroadcastState = {
	name: '',
	template_id: '',
	description: '',
	to: [],
	labels: [],

	recipients_from: 'numbers' as 'numbers' | 'phonebook',

	broadcast_options: {
		broadcast_type: 'instant',
		startDate: '',
		startTime: '',
		endTime: '',
		daily_messages_count: 0,
	},

	body: [],
	header_file: null,
	header_link: '',

	error: {
		type: '',
		message: '',
	},
};

const Slice = createSlice({
	name: StoreNames.BROADCAST,
	initialState,
	reducers: {
		resetBroadcast: (state) => {
			state.name = initialState.name;
			state.template_id = initialState.template_id;
			state.description = initialState.description;
			state.to = initialState.to;
			state.recipients_from = initialState.recipients_from;
			state.broadcast_options = initialState.broadcast_options;
			state.body = initialState.body;
			state.header_file = initialState.header_file;
			state.header_link = initialState.header_link;
		},
		setHeaderFile: (state, action: PayloadAction<File | null>) => {
			state.error = initialState.error;
			state.header_file = action.payload;
			state.header_link = '';
		},
		setHeaderLink: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.header_link = action.payload;
			state.header_file = null;
		},
		setName: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.name = action.payload;
		},
		setTemplateId: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.template_id = action.payload;
		},
		setDescription: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.description = action.payload;
		},
		setTo: (state, action: PayloadAction<string[]>) => {
			state.error = initialState.error;
			state.to = action.payload;
		},
		setLabels: (state, action: PayloadAction<string[]>) => {
			state.error = initialState.error;
			state.labels = action.payload;
		},
		setRecipientsFrom: (state, action: PayloadAction<'numbers' | 'phonebook'>) => {
			state.error = initialState.error;
			state.recipients_from = action.payload;
			state.to = [];
		},
		setBroadcastType: (state, action: PayloadAction<'instant' | 'scheduled'>) => {
			state.error = initialState.error;
			state.broadcast_options.broadcast_type = action.payload;
		},
		setStartDate: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.broadcast_options.startDate = action.payload;
		},
		setStartTime: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.broadcast_options.startTime = action.payload;
		},
		setEndTime: (state, action: PayloadAction<string>) => {
			state.error = initialState.error;
			state.broadcast_options.endTime = action.payload;
		},
		setDailyMessagesCount: (state, action: PayloadAction<number>) => {
			state.error = initialState.error;
			state.broadcast_options.daily_messages_count = action.payload;
		},
		setBodyParameterCount: (state, action: PayloadAction<number>) => {
			state.error = initialState.error;
			state.body = Array.from({ length: action.payload }).map(() => ({
				custom_text: '',
				phonebook_data: '',
				variable_from: 'custom_text',
				fallback_value: '',
			}));
		},
		setBodyParameter: (
			state,
			action: PayloadAction<{
				index: number;
				key: keyof BroadcastState['body'][0];
				value: string;
			}>
		) => {
			state.error = initialState.error;
			if (action.payload.key === 'variable_from') {
				state.body[action.payload.index].variable_from = action.payload.value as
					| 'custom_text'
					| 'phonebook_data';
			} else {
				state.body[action.payload.index][action.payload.key] = action.payload.value;
			}
		},
		setError: (state, action: PayloadAction<typeof initialState.error>) => {
			state.error = action.payload;
		},
	},
});

export const {
	resetBroadcast,
	setBodyParameter,
	setBodyParameterCount,
	setBroadcastType,
	setDailyMessagesCount,
	setDescription,
	setEndTime,
	setName,
	setRecipientsFrom,
	setStartDate,
	setStartTime,
	setTemplateId,
	setTo,
	setLabels,
	setHeaderFile,
	setHeaderLink,
	setError,
} = Slice.actions;

export default Slice.reducer;
