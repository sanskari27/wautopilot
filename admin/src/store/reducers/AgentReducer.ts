import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { AgentState } from '../types/Agent';

const initState: AgentState = {
	list: [],
	details: {
		id: '',
		name: '',
		email: '',
		phone: '',
        password: '',
	},
	selectedAgent: [],
	ui: {
		loading: false,
	},
};

const Slice = createSlice({
	name: StoreNames.AGENT,
	initialState: initState,
	reducers: {
		setAgentList: (state, action: PayloadAction<typeof initState.list>) => {
			state.list = action.payload;
		},
		setAgentDetails: (state, action: PayloadAction<typeof initState.details>) => {
			state.details = action.payload;
		},
		selectAll: (state) => {
			state.selectedAgent = state.list.map((record) => record.id);
		},
		addSelectedAgent: (state, action: PayloadAction<string>) => {
			state.selectedAgent.push(action.payload);
		},
		removeSelectedAgent: (state, action: PayloadAction<string>) => {
			state.selectedAgent = state.selectedAgent.filter((id) => id !== action.payload);
		},
		clearSelectedAgent: (state) => {
			state.selectedAgent = [];
		},
		setAgentLoading: (state, action: PayloadAction<boolean>) => {
			state.ui.loading = action.payload;
		},
		setAgentName: (state, action: PayloadAction<string>) => {
			state.details.name = action.payload;
		},
		setAgentEmail: (state, action: PayloadAction<string>) => {
			state.details.email = action.payload;
		},
		setAgentPhone: (state, action: PayloadAction<string>) => {
			state.details.phone = action.payload;
		},
        setPassword: (state, action: PayloadAction<string>) => {
            state.details.password = action.payload;
        }
	},
});

export const {
	setAgentList,
	setAgentDetails,
	addSelectedAgent,
	clearSelectedAgent,
	removeSelectedAgent,
	setAgentLoading,
	selectAll,
	setAgentEmail,
	setAgentName,
	setAgentPhone,
} = Slice.actions;

export default Slice.reducer;
