import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { countOccurrences } from '../../utils/templateHelper';
import { StoreNames } from '../config';
import { RecurringState } from '../types/RecurringState';
import { Template } from '../types/TemplateState';

const initState: RecurringState = {
	list: [],
	details: {
		id: '',
		name: '',
		description: '',
		wish_from: 'birthday',
		labels: [],
		template_id: '',
		template_name: '',
		template_body: [
			{
				custom_text: '',
				phonebook_data: '',
				variable_from: 'custom_text',
				fallback_value: '',
			},
		],
		template_header: {
			type: '',
			link: '',
			media_id: '',
		},
		delay: 0,
		startTime: '10:00',
		endTime: '18:00',
		active: 'ACTIVE',
	},
	ui: {
		isLoading: true,
		isAddingRecurring: false,
		isEditingRecurring: false,
	},
};

const Slice = createSlice({
	name: StoreNames.RECURRING,
	initialState: initState,
	reducers: {
		reset(state) {
			state.details = initState.details;
			state.ui.isEditingRecurring = false;
		},
		setRecurringList(state, action: PayloadAction<typeof initState.list>) {
			state.ui.isLoading = false;
			state.list = action.payload;
		},
		setRecurring: (state, action: PayloadAction<string>) => {
			state.ui.isEditingRecurring = true;
			state.details =
				state.list.find((recurring) => recurring.id === action.payload) ?? initState.details;
		},
		setRecurringLoading(state, action: PayloadAction<boolean>) {
			state.ui.isLoading = action.payload;
		},
		setRecurringName(state, action: PayloadAction<string>) {
			state.details.name = action.payload;
		},
		setRecurringDescription(state, action: PayloadAction<string>) {
			state.details.description = action.payload;
		},
		setRecurringWishFrom(state, action: PayloadAction<typeof initState.details.wish_from>) {
			state.details.wish_from = action.payload;
		},
		addRecurringLabels(state, action: PayloadAction<string>) {
			state.details.labels.push(action.payload);
		},
		removeRecurringLabels(state, action: PayloadAction<string>) {
			state.details.labels = state.details.labels.filter((label) => label !== action.payload);
		},
		clearRecurringLabels(state) {
			state.details.labels = [];
		},
		setRecurringDelay(state, action: PayloadAction<string>) {
			state.details.delay = Number(action.payload);
		},
		setRecurringStartTime(state, action: PayloadAction<string>) {
			state.details.startTime = action.payload;
		},
		setRecurringEndTime(state, action: PayloadAction<string>) {
			state.details.endTime = action.payload;
		},
		clearSelectedTemplate(state) {
			state.details.template_id = '';
			state.details.template_name = '';
			state.details.template_body = initState.details.template_body;
			state.details.template_header = initState.details.template_header;
		},
		setSelectedTemplate: (state, action: PayloadAction<Template>) => {
			const template = action.payload;
			state.details.template_id = template.id;
			state.details.template_name = template.name;

			const body = template.components.find((c) => c.type === 'BODY');
			const variables = countOccurrences(body?.text ?? '');
			state.details.template_body = Array.from({ length: variables }).map(() => ({
				custom_text: '',
				phonebook_data: '',
				variable_from: 'custom_text',
				fallback_value: '',
			}));

			const header = template.components.find((c) => c.type === 'HEADER');
			if (!header) {
				state.details.template_header = {
					link: '',
					media_id: '',
					type: '',
				};
			} else {
				state.details.template_header = {
					type: header.format,
					link: header.link,
					media_id: header.media_id,
				};
			}
		},
		setTemplateHeaderMediaId(state, action: PayloadAction<string>) {
			state.details.template_header.media_id = action.payload;
		},
		setTemplateBodyCustomText: (
			state,
			action: PayloadAction<{ index: number; custom_text: string }>
		) => {
			state.details.template_body[action.payload.index].custom_text = action.payload.custom_text;
		},
		setTemplateBodyFallbackValue: (
			state,
			action: PayloadAction<{ index: number; fallback_value: string }>
		) => {
			state.details.template_body[action.payload.index].fallback_value =
				action.payload.fallback_value;
		},
		setTemplateBodyPhonebookData: (
			state,
			action: PayloadAction<{ index: number; phonebook_data: string }>
		) => {
			state.details.template_body[action.payload.index].phonebook_data =
				action.payload.phonebook_data;
		},
		setTemplateBodyVariableFrom: (
			state,
			action: PayloadAction<{ index: number; variable_from: 'custom_text' | 'phonebook_data' }>
		) => {
			state.details.template_body[action.payload.index].variable_from =
				action.payload.variable_from;
		},
		setAddingRecurring: (state, action: PayloadAction<boolean>) => {
			state.ui.isAddingRecurring = action.payload;
		},
		addRecurringMessage: (state, action: PayloadAction<typeof initState.details>) => {
			state.list.push(action.payload);
		},
		toggleRecurring: (state, action: PayloadAction<string>) => {
			const recurring = state.list.find((recurring) => recurring.id === action.payload);
			if (recurring) {
				recurring.active = recurring.active === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
			}
		},
		removeRecurring: (state, action: PayloadAction<string>) => {
			state.list = state.list.filter((recurring) => recurring.id !== action.payload);
		},
		editRecurring: (state, action: PayloadAction<typeof initState.details>) => {
			const index = state.list.findIndex((recurring) => recurring.id === action.payload.id);
			state.list[index] = action.payload;
		},
	},
});

export const {
	reset,
	setRecurringList,
	setRecurring,
	addRecurringLabels,
	removeRecurringLabels,
	clearRecurringLabels,
	setRecurringDescription,
	setRecurringLoading,
	setRecurringName,
	setRecurringWishFrom,
	setRecurringDelay,
	setRecurringEndTime,
	setRecurringStartTime,
	clearSelectedTemplate,
	setSelectedTemplate,
	setTemplateBodyCustomText,
	setTemplateBodyFallbackValue,
	setTemplateBodyPhonebookData,
	setTemplateBodyVariableFrom,
	setTemplateHeaderMediaId,
	setAddingRecurring,
	addRecurringMessage,
	toggleRecurring,
	removeRecurring,
	editRecurring,
} = Slice.actions;

export default Slice.reducer;
