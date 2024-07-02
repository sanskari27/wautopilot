import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { ChatbotFlowState } from '../types/ChatbotFlow';

const initState: ChatbotFlowState = {
	list: [],
	details: {
		id: '',
		name: '',
		trigger: '',
		respond_to: 'ALL',
		options: 'INCLUDES_IGNORE_CASE',
		isActive: true,
	},
	ui: {
		isAddingBot: false,
		isEditingBot: false,
		isLoading: true,
	},
};

const Slice = createSlice({
	name: StoreNames.CHATBOT_FLOW,
	initialState: initState,
	reducers: {
		reset: (state) => {
			state.details = initState.details;
			state.ui = initState.ui;
		},
		setChatbotFlow: (state, action: PayloadAction<typeof initState.list>) => {
			state.list = action.payload;
		},
		setName: (state, action: PayloadAction<string>) => {
			state.details.name = action.payload;
		},
		setTrigger: (state, action: PayloadAction<string>) => {
			state.details.trigger = action.payload;
		},
		setRespondTo: (state, action: PayloadAction<typeof initState.details.respond_to>) => {
			state.details.respond_to = action.payload;
		},
		setOptions: (state, action: PayloadAction<typeof initState.details.options>) => {
			state.details.options = action.payload;
		},
		setChatbotFlowDetails: (state, action: PayloadAction<string>) => {
			state.ui.isEditingBot = true;
			state.details = state.list.find((item) => item.id === action.payload) || initState.details;
		},
		addChatbotFlow: (state, action: PayloadAction<typeof initState.details>) => {
			state.list.push(action.payload);
		},
		setAddingBot: (state, action: PayloadAction<boolean>) => {
			state.ui.isAddingBot = action.payload;
		},
		setEditingBot: (state, action: PayloadAction<boolean>) => {
			state.ui.isEditingBot = action.payload;
		},
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.ui.isLoading = action.payload;
		},
	},
});

export const {
	reset,
	setChatbotFlow,
	setName,
	setTrigger,
	setRespondTo,
	setOptions,
	setChatbotFlowDetails,
	addChatbotFlow,
	setAddingBot,
	setEditingBot,
	setLoading,
} = Slice.actions;

export default Slice.reducer;
