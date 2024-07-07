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
		permissions: {
			assigned_labels: [],
			auto_assign_chats: false,
			broadcast: {
				create: false,
				update: false,
				report: false,
				export: false,
			},
			recurring: {
				create: false,
				update: false,
				delete: false,
				export: false,
			},
			media: {
				create: false,
				update: false,
				delete: false,
			},
			phonebook: {
				create: false,
				update: false,
				delete: false,
				export: false,
			},
			chatbot: {
				create: false,
				update: false,
				delete: false,
				export: false,
			},
			chatbot_flow: {
				create: false,
				update: false,
				delete: false,
				export: false,
			},
			contacts: {
				create: false,
				update: false,
				delete: false,
			},
			template: {
				create: false,
				update: false,
				delete: false,
			},
			buttons: {
				read: false,
				export: false,
			},
		},
	},
	agentPermissions: {
		broadcast: {
			create: false,
			update: false,
			report: false,
			export: false,
		},
		recurring: {
			create: false,
			update: false,
			delete: false,
			export: false,
		},
		media: {
			create: false,
			update: false,
			delete: false,
		},
		phonebook: {
			create: false,
			update: false,
			delete: false,
			export: false,
		},
		chatbot: {
			create: false,
			update: false,
			delete: false,
			export: false,
		},
		chatbot_flow: {
			create: false,
			update: false,
			delete: false,
			export: false,
		},
		contacts: {
			create: false,
			update: false,
			delete: false,
		},
		template: {
			create: false,
			update: false,
			delete: false,
		},
		buttons: {
			read: false,
			export: false,
		},
		assigned_labels: [],
		auto_assign_chats: false,
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
		addSingleSelectedAgent: (state, action: PayloadAction<string>) => {
			state.selectedAgent = [action.payload];
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
		setAgentPassword: (state, action: PayloadAction<string>) => {
			state.details.password = action.payload;
		},
		addAgent: (state, action: PayloadAction<typeof initState.details>) => {
			state.list.push(action.payload);
		},
		setAgentDetails: (state, action: PayloadAction<string>) => {
			const agent = state.list.find((record) => record.id === action.payload);
			if (agent) {
				state.details.id = agent.id;
				state.details.name = agent.name;
				state.details.email = agent.email;
				state.details.phone = agent.phone;
				state.details.permissions = agent.permissions;
				state.agentPermissions = agent.permissions;
			}
		},
		removeAgent: (state, action: PayloadAction<string>) => {
			state.list = state.list.filter((record) => record.id !== action.payload);
		},
		updateAgent: (state, action: PayloadAction<typeof initState.details>) => {
			const index = state.list.findIndex((record) => record.id === action.payload.id);
			if (index !== -1) {
				state.list[index] = action.payload;
			}
		},
		toggleBroadcastCreate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.broadcast.create = action.payload;
		},
		toggleBroadcastUpdate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.broadcast.update = action.payload;
		},
		toggleBroadcastReport: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.broadcast.report = action.payload;
		},
		toggleBroadcastExport: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.broadcast.export = action.payload;
		},
		toggleRecurringCreate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.recurring.create = action.payload;
		},
		toggleRecurringUpdate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.recurring.update = action.payload;
		},
		toggleRecurringDelete: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.recurring.delete = action.payload;
		},
		toggleRecurringExport: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.recurring.export = action.payload;
		},
		toggleMediaCreate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.media.create = action.payload;
		},
		toggleMediaUpdate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.media.update = action.payload;
		},
		toggleMediaDelete: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.media.delete = action.payload;
		},
		togglePhonebookCreate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.phonebook.create = action.payload;
		},
		togglePhonebookUpdate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.phonebook.update = action.payload;
		},
		togglePhonebookDelete: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.phonebook.delete = action.payload;
		},
		togglePhonebookExport: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.phonebook.export = action.payload;
		},
		toggleChatbotCreate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.chatbot.create = action.payload;
		},
		toggleChatbotUpdate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.chatbot.update = action.payload;
		},
		toggleChatbotDelete: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.chatbot.delete = action.payload;
		},
		toggleChatbotExport: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.chatbot.export = action.payload;
		},
		toggleChatbotFlowCreate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.chatbot_flow.create = action.payload;
		},
		toggleChatbotFlowUpdate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.chatbot_flow.update = action.payload;
		},
		toggleChatbotFlowDelete: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.chatbot_flow.delete = action.payload;
		},
		toggleChatbotFlowExport: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.chatbot_flow.export = action.payload;
		},
		toggleContactsCreate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.contacts.create = action.payload;
		},
		toggleContactsUpdate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.contacts.update = action.payload;
		},
		toggleContactsDelete: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.contacts.delete = action.payload;
		},
		toggleTemplateCreate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.template.create = action.payload;
		},
		toggleTemplateUpdate: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.template.update = action.payload;
		},
		toggleTemplateDelete: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.template.delete = action.payload;
		},
		toggleAutoAssignChats: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.auto_assign_chats = action.payload;
		},
		addLabels: (state, action: PayloadAction<string>) => {
			state.agentPermissions.assigned_labels.push(action.payload);
		},
		removeLabels: (state, action: PayloadAction<string>) => {
			state.agentPermissions.assigned_labels = state.agentPermissions.assigned_labels.filter(
				(label) => label !== action.payload
			);
		},
		clearLabels: (state) => {
			state.agentPermissions.assigned_labels = [];
		},
		toggleButtonRead: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.buttons.read = action.payload;
		},
		toggleButtonExport: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.buttons.export = action.payload;
		},
		toggleAllPhonebookPermissions: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.phonebook.create = action.payload;
			state.agentPermissions.phonebook.update = action.payload;
			state.agentPermissions.phonebook.delete = action.payload;
			state.agentPermissions.phonebook.export = action.payload;
		},
		toggleAllBroadcastPermissions: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.broadcast.create = action.payload;
			state.agentPermissions.broadcast.update = action.payload;
			state.agentPermissions.broadcast.report = action.payload;
			state.agentPermissions.broadcast.export = action.payload;
		},
		toggleAllRecurringPermissions: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.recurring.create = action.payload;
			state.agentPermissions.recurring.update = action.payload;
			state.agentPermissions.recurring.delete = action.payload;
			state.agentPermissions.recurring.export = action.payload;
		},
		toggleAllMediaPermissions: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.media.create = action.payload;
			state.agentPermissions.media.update = action.payload;
			state.agentPermissions.media.delete = action.payload;
		},
		toggleAllChatbotPermissions: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.chatbot.create = action.payload;
			state.agentPermissions.chatbot.update = action.payload;
			state.agentPermissions.chatbot.delete = action.payload;
			state.agentPermissions.chatbot.export = action.payload;
		},
		toggleAllChatbotFlowPermissions: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.chatbot_flow.create = action.payload;
			state.agentPermissions.chatbot_flow.update = action.payload;
			state.agentPermissions.chatbot_flow.delete = action.payload;
			state.agentPermissions.chatbot_flow.export = action.payload;
		},
		toggleAllContactsPermissions: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.contacts.create = action.payload;
			state.agentPermissions.contacts.update = action.payload;
			state.agentPermissions.contacts.delete = action.payload;
		},
		toggleAllTemplatePermissions: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.template.create = action.payload;
			state.agentPermissions.template.update = action.payload;
			state.agentPermissions.template.delete = action.payload;
		},
		toggleAllButtonsPermissions: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.buttons.read = action.payload;
			state.agentPermissions.buttons.export = action.payload;
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
	setAgentPassword,
	addAgent,
	removeAgent,
	updateAgent,
	addSingleSelectedAgent,
	toggleBroadcastCreate,
	toggleBroadcastUpdate,
	toggleBroadcastReport,
	toggleBroadcastExport,
	toggleRecurringCreate,
	toggleRecurringUpdate,
	toggleRecurringDelete,
	toggleRecurringExport,
	toggleMediaCreate,
	toggleMediaUpdate,
	toggleMediaDelete,
	togglePhonebookCreate,
	togglePhonebookUpdate,
	togglePhonebookDelete,
	togglePhonebookExport,
	toggleChatbotCreate,
	toggleChatbotUpdate,
	toggleChatbotDelete,
	toggleChatbotExport,
	toggleChatbotFlowCreate,
	toggleChatbotFlowUpdate,
	toggleChatbotFlowDelete,
	toggleChatbotFlowExport,
	toggleContactsCreate,
	toggleContactsUpdate,
	toggleContactsDelete,
	toggleTemplateCreate,
	toggleTemplateUpdate,
	toggleTemplateDelete,
	toggleAutoAssignChats,
	toggleButtonRead,
	toggleButtonExport,
	toggleAllPhonebookPermissions,
	toggleAllBroadcastPermissions,
	toggleAllChatbotFlowPermissions,
	toggleAllChatbotPermissions,
	toggleAllContactsPermissions,
	toggleAllMediaPermissions,
	toggleAllRecurringPermissions,
	toggleAllTemplatePermissions,
	toggleAllButtonsPermissions,
	addLabels,
	clearLabels,
	removeLabels,
} = Slice.actions;

export default Slice.reducer;
