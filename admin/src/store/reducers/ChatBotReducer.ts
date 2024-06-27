import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { ChatBotState } from '../types/ChatBot';

const initState: ChatBotState = {
	list: [],
	details: {
		id: '',
		isActive: true,
		respond_to: 'All',
		response_delay_seconds: 1,
		trigger_gap_seconds: 1,
		trigger: '',
		options: 'INCLUDES_IGNORE_CASE',
		startAt: '',
		endAt: '',
		respond_type: 'template',
		message: '',
		images: [],
		videos: [],
		audios: [],
		documents: [],
		contacts: [],
		template_id: '',
		template_name: '',
		template_body: [],
		group_respond: true,
		nurturing: [],
		template_header: {
			type: 'IMAGE',
			link: '',
			media_id: '',
		},
	},
	trigger_gap: {
		time: 1,
		type: '',
	},
	response_delay: {
		time: 1,
		type: '',
	},
	ui: {
		isAddingBot: false,
		isEditingBot: false,
		triggerError: '',
		messageError: '',
		respondToError: '',
		optionsError: '',
		contactCardsError: '',
		attachmentError: '',
		triggerGapError: '',
		responseGapError: '',
		startAtError: '',
		endAtError: '',
	},
};

const Slice = createSlice({
	name: StoreNames.CHATBOT,
	initialState: initState,
	reducers: {
		reset: (state) => {
			state.details = initState.details;
			state.list = initState.list;
			state.response_delay = initState.response_delay;
			state.trigger_gap = initState.trigger_gap;
			state.ui = initState.ui;
		},
		setChatBotList: (state, action: PayloadAction<typeof initState.list>) => {
			state.list = action.payload;
		},
		addBot: (state, action: PayloadAction<typeof initState.details>) => {
			state.list.push(action.payload);
		},
		removeBot: (state, action: PayloadAction<string>) => {
			state.list = state.list.filter((bot) => bot.id !== action.payload);
		},
		updateBot: (state, action: PayloadAction<{ id: string; data: typeof initState.details }>) => {
			state.list = state.list.map((bot) =>
				bot.id === action.payload.id ? action.payload.data : bot
			);
		},
		setChatbot: (state, action: PayloadAction<typeof initState.details>) => {
			state.ui.isEditingBot = true;
			state.details = action.payload;
		},
		setTrigger: (state, action: PayloadAction<string>) => {
			state.ui = initState.ui;
			state.details.trigger = action.payload;
		},
		setRespondTo: (state, action: PayloadAction<typeof initState.details.respond_to>) => {
			state.ui = initState.ui;
			state.details.respond_to = action.payload;
		},
		setCondition: (state, action: PayloadAction<typeof initState.details.options>) => {
			state.ui = initState.ui;
			state.details.options = action.payload;
		},
		setResponseDelayTime: (state, action: PayloadAction<number>) => {
			state.response_delay.time = action.payload;
			state.details.response_delay_seconds =
				state.response_delay.time *
				(state.response_delay.type === 'HOUR'
					? 3600
					: state.response_delay.type === 'MINUTE'
					? 60
					: 1);

			state.ui.responseGapError = '';
		},
		setResponseDelayType: (state, action: PayloadAction<string>) => {
			state.response_delay.type = action.payload;
			state.details.response_delay_seconds =
				state.response_delay.time *
				(state.response_delay.type === 'HOUR'
					? 3600
					: state.response_delay.type === 'MINUTE'
					? 60
					: 1);
			state.ui.responseGapError = '';
		},
		setTriggerGapTime: (state, action: PayloadAction<number>) => {
			state.trigger_gap.time = action.payload;
			state.details.trigger_gap_seconds =
				state.trigger_gap.time *
				(state.trigger_gap.type === 'HOUR' ? 3600 : state.trigger_gap.type === 'MINUTE' ? 60 : 1);
			state.ui.triggerGapError = '';
		},
		setTriggerGapType: (state, action: PayloadAction<string>) => {
			state.trigger_gap.type = action.payload;
			state.details.trigger_gap_seconds =
				state.trigger_gap.time *
				(state.trigger_gap.type === 'HOUR' ? 3600 : state.trigger_gap.type === 'MINUTE' ? 60 : 1);
			state.ui.triggerGapError = '';
		},
		setStartAt: (state, action: PayloadAction<typeof initState.details.startAt>) => {
			state.ui = initState.ui;
			state.details.startAt = action.payload;
		},
		setEndAt: (state, action: PayloadAction<typeof initState.details.endAt>) => {
			state.ui = initState.ui;
			state.details.endAt = action.payload;
		},
		setTemplateId: (state, action: PayloadAction<string>) => {
			state.ui = initState.ui;
			state.details.template_id = action.payload;
		},
		setBodyParameterCount: (state, action: PayloadAction<number>) => {
			state.ui = initState.ui;
			state.details.template_body = Array.from({ length: action.payload }).map(() => ({
				custom_text: '',
				phonebook_data: '',
				variable_from: 'custom_text',
				fallback_value: '',
			}));
		},
		setMessage: (state, action: PayloadAction<string>) => {
			state.ui = initState.ui;
			state.details.message = action.payload;
		},
		setImages: (state, action: PayloadAction<string[]>) => {
			state.details.images = action.payload;
		},
		setVideos: (state, action: PayloadAction<string[]>) => {
			state.details.videos = action.payload;
		},
		setAudios: (state, action: PayloadAction<string[]>) => {
			state.details.audios = action.payload;
		},
		setDocuments: (state, action: PayloadAction<string[]>) => {
			state.details.documents = action.payload;
		},
		setContacts: (state, action: PayloadAction<string[]>) => {
			state.details.contacts = action.payload;
		},
		setHeaderMediaId: (state, action: PayloadAction<string>) => {
			state.details.template_header.media_id = action.payload;
		},
		setAddingBot: (state, action: PayloadAction<boolean>) => {
			state.ui.isAddingBot = action.payload;
		},
		setError: (
			state,
			action: PayloadAction<{
				type:
					| 'triggerError'
					| 'messageError'
					| 'respondToError'
					| 'optionsError'
					| 'contactCardsError'
					| 'attachmentError'
					| 'triggerGapError'
					| 'responseGapError'
					| 'startAtError'
					| 'endAtError';

				error: string;
			}>
		) => {
			state.ui[action.payload.type] = action.payload.error;
		},
	},
});

export const {
	addBot,
	removeBot,
	updateBot,
	setChatbot,
	setChatBotList,
	setTrigger,
	setError,
	setRespondTo,
	setCondition,
	setResponseDelayTime,
	setResponseDelayType,
	setTriggerGapTime,
	setTriggerGapType,
	setEndAt,
	setTemplateId,
	setStartAt,
	setBodyParameterCount,
	setMessage,
	setImages,
	setVideos,
	setAudios,
	setDocuments,
	setContacts,
	setAddingBot,
	setHeaderMediaId,
	reset,
} = Slice.actions;

export default Slice.reducer;
