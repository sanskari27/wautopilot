import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { countOccurrences } from '../../utils/templateHelper';
import { StoreNames } from '../config';
import { ChatBotState } from '../types/ChatBotState';
import { Template } from '../types/TemplateState';

const initState: ChatBotState = {
	list: [],
	details: {
		id: '',
		isActive: true,
		respond_to: 'ALL',
		response_delay_seconds: 1,
		trigger_gap_seconds: 1,
		trigger: '',
		options: 'INCLUDES_IGNORE_CASE',
		startAt: '00:01',
		endAt: '23:59',
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
			type: '',
			link: '',
			media_id: '',
		},
		forward: {
			number: '',
			message: '',
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
	template_header_file: null,
	ui: {
		isAddingBot: false,
		isEditingBot: false,
		isLoading: false,
	},
};

const Slice = createSlice({
	name: StoreNames.CHATBOT,
	initialState: initState,
	reducers: {
		reset: (state) => {
			state.details = initState.details;
			state.response_delay = initState.response_delay;
			state.trigger_gap = initState.trigger_gap;
			state.ui = initState.ui;
			state.template_header_file = initState.template_header_file;
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
		updateBot: (state, action: PayloadAction<typeof initState.details>) => {
			state.list = state.list.map((bot) => {
				if (bot.id === action.payload.id) {
					return action.payload;
				}
				return bot;
			});
		},
		setChatbot: (state, action: PayloadAction<string>) => {
			state.ui.isEditingBot = true;
			state.details = state.list.find((bot) => bot.id === action.payload) ?? initState.details;
		},
		setTrigger: (state, action: PayloadAction<string>) => {
			state.details.trigger = action.payload;
		},
		setRespondTo: (state, action: PayloadAction<typeof initState.details.respond_to>) => {
			state.details.respond_to = action.payload;
		},
		setCondition: (state, action: PayloadAction<typeof initState.details.options>) => {
			state.details.options = action.payload;
		},
		setResponseDelayTime: (state, action: PayloadAction<number>) => {
			if (action.payload < 0 || isNaN(action.payload)) return;
			state.response_delay.time = action.payload;
			state.details.response_delay_seconds =
				state.response_delay.time *
				(state.response_delay.type === 'HOUR'
					? 3600
					: state.response_delay.type === 'MINUTE'
					? 60
					: 1);
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
		},
		setTriggerGapTime: (state, action: PayloadAction<number>) => {
			if (action.payload < 0 || isNaN(action.payload)) return;
			state.trigger_gap.time = action.payload;
			state.details.trigger_gap_seconds =
				state.trigger_gap.time *
				(state.trigger_gap.type === 'HOUR' ? 3600 : state.trigger_gap.type === 'MINUTE' ? 60 : 1);
		},
		setTriggerGapType: (state, action: PayloadAction<string>) => {
			state.trigger_gap.type = action.payload;
			state.details.trigger_gap_seconds =
				state.trigger_gap.time *
				(state.trigger_gap.type === 'HOUR' ? 3600 : state.trigger_gap.type === 'MINUTE' ? 60 : 1);
		},
		setStartAt: (state, action: PayloadAction<typeof initState.details.startAt>) => {
			state.details.startAt = action.payload;
		},
		setEndAt: (state, action: PayloadAction<typeof initState.details.endAt>) => {
			state.details.endAt = action.payload;
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
		clearSelectedTemplate: (state) => {
			state.details.template_id = '';
			state.details.template_name = '';
			state.details.template_body = [];
			state.details.template_header = {
				link: '',
				media_id: '',
				type: '',
			};
		},
		setSelectedNurturingTemplate: (
			state,
			action: PayloadAction<{ index: number; template: Template }>
		) => {
			const template = action.payload.template;
			state.details.nurturing[action.payload.index].template_id = template.id;
			state.details.nurturing[action.payload.index].template_name = template.name;

			const body = template.components.find((c) => c.type === 'BODY');
			const variables = countOccurrences(body?.text ?? '');
			state.details.nurturing[action.payload.index].template_body = Array.from({
				length: variables,
			}).map(() => ({
				custom_text: '',
				phonebook_data: '',
				variable_from: 'custom_text',
				fallback_value: '',
			}));
			const header = template.components.find((c) => c.type === 'HEADER');
			if (!header) {
				state.details.nurturing[action.payload.index].template_header = {
					type: '',
					link: '',
					media_id: '',
				};
			} else {
				state.details.nurturing[action.payload.index].template_header = {
					type: header.format,
					link: header.link,
					media_id: header.media_id,
				};
			}
		},
		setNurturingTemplateHeaderLink: (
			state,
			action: PayloadAction<{ index: number; link: string }>
		) => {
			state.details.nurturing[action.payload.index].template_header.link = action.payload.link;
		},
		setNurturingTemplateBody: (
			state,
			action: PayloadAction<{
				index: number;
				body: {
					index: number;
					custom_text: string;
					phonebook_data: string;
					variable_from: 'custom_text' | 'phonebook_data';
					fallback_value: string;
				};
			}>
		) => {
			state.details.nurturing[action.payload.index].template_body[action.payload.body.index] = {
				custom_text: action.payload.body.custom_text,
				phonebook_data: action.payload.body.phonebook_data,
				variable_from: action.payload.body.variable_from,
				fallback_value: action.payload.body.fallback_value,
			};
		},
		setNurturingTemplateHeaderMediaId: (
			state,
			action: PayloadAction<{ index: number; media_id: string }>
		) => {
			state.details.nurturing[action.payload.index].template_header.media_id =
				action.payload.media_id;
		},
		setMessage: (state, action: PayloadAction<string>) => {
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
			if (!state.details.template_header) return;
			state.details.template_header.media_id = action.payload;
		},
		setAddingBot: (state, action: PayloadAction<boolean>) => {
			state.ui.isAddingBot = action.payload;
		},
		setTemplateHeaderLink: (state, action: PayloadAction<string>) => {
			if (!state.details.template_header) return;
			state.details.template_header.link = action.payload;
		},
		setTemplateHeaderMediaId: (state, action: PayloadAction<string>) => {
			if (!state.details.template_header) return;
			state.details.template_header.media_id = action.payload;
		},
		setTemplateBodyCustomText: (
			state,
			action: PayloadAction<{ index: number; custom_text: string }>
		) => {
			state.details.template_body[action.payload.index].custom_text = action.payload.custom_text;
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
		setTemplateBodyFallbackValue: (
			state,
			action: PayloadAction<{ index: number; fallback_value: string }>
		) => {
			state.details.template_body[action.payload.index].fallback_value =
				action.payload.fallback_value;
		},
		setHeaderFile: (state, action: PayloadAction<File | null>) => {
			state.template_header_file = action.payload;
		},
		setRespondType: (state, action: PayloadAction<'template' | 'normal'>) => {
			state.details.respond_type = action.payload;
		},
		setGroupRespond: (state, action: PayloadAction<boolean>) => {
			state.details.group_respond = action.payload;
		},
		createEmptyNurturing: (state) => {
			state.details.nurturing.push({
				after: {
					value: '1',
					type: 'minutes',
				},
				start_from: '00:01',
				end_at: '23:59',
				template_id: '',
				template_name: '',
				template_body: [],
				template_header: {
					type: '',
					link: '',
					media_id: '',
				},
			});
		},
		removeNurturing: (state, action: PayloadAction<number>) => {
			state.details.nurturing.splice(action.payload, 1);
		},
		setNurturingStartFrom: (
			state,
			action: PayloadAction<{ index: number; start_from: string }>
		) => {
			state.details.nurturing[action.payload.index].start_from = action.payload.start_from;
		},
		setNurturingEndAt: (state, action: PayloadAction<{ index: number; end_at: string }>) => {
			state.details.nurturing[action.payload.index].end_at = action.payload.end_at;
		},
		setNurturingAfterValue: (state, action: PayloadAction<{ index: number; value: string }>) => {
			state.details.nurturing[action.payload.index].after.value = action.payload.value;
		},
		setNurturingAfterType: (
			state,
			action: PayloadAction<{ index: number; type: 'minutes' | 'hours' | 'days' }>
		) => {
			state.details.nurturing[action.payload.index].after.type = action.payload.type;
		},
		setNurturingTemplateId: (
			state,
			action: PayloadAction<{ index: number; template_id: string }>
		) => {
			state.details.nurturing[action.payload.index].template_id = action.payload.template_id;
		},
		setNurturingTemplateDetails: (
			state,
			action: PayloadAction<{
				index: number;
				template_body: {
					custom_text: string;
					phonebook_data: string;
					variable_from: 'custom_text' | 'phonebook_data';
					fallback_value: string;
				}[];
				template_header: {
					type: 'IMAGE' | 'TEXT' | 'VIDEO' | 'DOCUMENT';
					link: string;
					media_id: string;
				};
			}>
		) => {
			state.details.nurturing[action.payload.index].template_body = action.payload.template_body;
			state.details.nurturing[action.payload.index].template_header =
				action.payload.template_header;
		},
		setChatbotLoading: (state, action: PayloadAction<boolean>) => {
			state.ui.isLoading = action.payload;
		},
		setForwardMessage: (state, action: PayloadAction<string>) => {
			state.details.forward.message = action.payload;
		},
		setForwardNumber: (state, action: PayloadAction<string>) => {
			state.details.forward.number = action.payload;
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
	createEmptyNurturing,
	setSelectedTemplate,
	removeNurturing,
	setNurturingStartFrom,
	setNurturingEndAt,
	setNurturingAfterValue,
	setNurturingAfterType,
	setNurturingTemplateId,
	setNurturingTemplateDetails,
	setSelectedNurturingTemplate,
	setRespondTo,
	setNurturingTemplateHeaderLink,
	setNurturingTemplateBody,
	setNurturingTemplateHeaderMediaId,
	setCondition,
	setResponseDelayTime,
	setResponseDelayType,
	setTriggerGapTime,
	setTriggerGapType,
	setEndAt,
	setStartAt,
	clearSelectedTemplate,
	setTemplateHeaderLink,
	setTemplateHeaderMediaId,
	setTemplateBodyCustomText,
	setTemplateBodyPhonebookData,
	setTemplateBodyVariableFrom,
	setTemplateBodyFallbackValue,
	setHeaderFile,
	setRespondType,
	setGroupRespond,
	setMessage,
	setImages,
	setVideos,
	setAudios,
	setDocuments,
	setContacts,
	setAddingBot,
	setHeaderMediaId,
	reset,
	setChatbotLoading,
	setForwardMessage,
	setForwardNumber,
} = Slice.actions;

export default Slice.reducer;
