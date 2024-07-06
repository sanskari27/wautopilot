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
			create_recurring_broadcast: false,
			view_broadcast_reports: false,
			create_broadcast: false,
			create_phonebook: false,
			update_phonebook: false,
			delete_phonebook: false,
			auto_assign_chats: false,
			create_template: false,
			update_template: false,
			delete_template: false,
		},
	},
	agentPermissions: {
		create_recurring_broadcast: false,
		assigned_labels: [],
		create_broadcast: false,
		view_broadcast_report: false,
		can_manipulate_phonebook: {
			access: false,
			create_phonebook: false,
			update_phonebook: false,
			delete_phonebook: false,
		},
		auto_assign_chats: false,
		can_manipulate_template: {
			access: false,
			create_template: false,
			update_template: false,
			delete_template: false,
		},
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
				state.details = agent;
				state.agentPermissions = {
					create_recurring_broadcast: agent.permissions.create_recurring_broadcast,
					assigned_labels: agent.permissions.assigned_labels,
					create_broadcast: agent.permissions.create_broadcast,
					view_broadcast_report: agent.permissions.view_broadcast_reports,
					auto_assign_chats: agent.permissions.auto_assign_chats,
					can_manipulate_phonebook: {
						access:
							agent.permissions.create_phonebook ||
							agent.permissions.update_phonebook ||
							agent.permissions.delete_phonebook,
						create_phonebook: agent.permissions.create_phonebook,
						update_phonebook: agent.permissions.update_phonebook,
						delete_phonebook: agent.permissions.delete_phonebook,
					},
					can_manipulate_template: {
						access:
							agent.permissions.create_template ||
							agent.permissions.update_template ||
							agent.permissions.delete_template,
						create_template: agent.permissions.create_template,
						update_template: agent.permissions.update_template,
						delete_template: agent.permissions.delete_template,
					},
				};
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
		changeBroadcastAccess: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.create_broadcast = action.payload;
		},
		changeViewBroadcastReport: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.view_broadcast_report = action.payload;
		},
		changeAutoAssignChats: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.auto_assign_chats = action.payload;
		},
		changeCanManipulateTemplate: (state, action: PayloadAction<boolean>) => {
			if (action.payload) {
				state.agentPermissions.can_manipulate_template.create_template = true;
				state.agentPermissions.can_manipulate_template.update_template = true;
				state.agentPermissions.can_manipulate_template.delete_template = true;
			} else {
				state.agentPermissions.can_manipulate_template.create_template = false;
				state.agentPermissions.can_manipulate_template.update_template = false;
				state.agentPermissions.can_manipulate_template.delete_template = false;
			}
			state.agentPermissions.can_manipulate_template.access = action.payload;
		},
		changeCanManipulatePhonebook: (state, action: PayloadAction<boolean>) => {
			if (action.payload) {
				state.agentPermissions.can_manipulate_phonebook.create_phonebook = true;
				state.agentPermissions.can_manipulate_phonebook.update_phonebook = true;
				state.agentPermissions.can_manipulate_phonebook.delete_phonebook = true;
			} else {
				state.agentPermissions.can_manipulate_phonebook.create_phonebook = false;
				state.agentPermissions.can_manipulate_phonebook.update_phonebook = false;
				state.agentPermissions.can_manipulate_phonebook.delete_phonebook = false;
			}
			state.agentPermissions.can_manipulate_phonebook.access = action.payload;
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
		createPhonebook: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.can_manipulate_phonebook.create_phonebook = action.payload;
		},
		updatePhonebook: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.can_manipulate_phonebook.update_phonebook = action.payload;
		},
		deletePhonebook: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.can_manipulate_phonebook.delete_phonebook = action.payload;
		},
		createTemplate: (state, action: PayloadAction<boolean>) => {
			if (
				!action.payload &&
				!state.agentPermissions.can_manipulate_template.update_template &&
				!state.agentPermissions.can_manipulate_template.delete_template
			) {
				state.agentPermissions.can_manipulate_template.access = false;
			}
			state.agentPermissions.can_manipulate_template.create_template = action.payload;
		},
		updateTemplate: (state, action: PayloadAction<boolean>) => {
			if (
				!state.agentPermissions.can_manipulate_template.create_template &&
				!action.payload &&
				!state.agentPermissions.can_manipulate_template.delete_template
			) {
				state.agentPermissions.can_manipulate_template.access = false;
			}
			state.agentPermissions.can_manipulate_template.update_template = action.payload;
		},
		deleteTemplate: (state, action: PayloadAction<boolean>) => {
			if (
				!state.agentPermissions.can_manipulate_template.create_template &&
				!state.agentPermissions.can_manipulate_template.update_template &&
				!action.payload
			) {
				state.agentPermissions.can_manipulate_template.access = false;
			}
			state.agentPermissions.can_manipulate_template.delete_template = action.payload;
		},
		changeRecurringBroadcast: (state, action: PayloadAction<boolean>) => {
			state.agentPermissions.create_recurring_broadcast = action.payload;
		},
		updateAgentPermission: (
			state,
			action: PayloadAction<{
				id: string;
				permission: {
					assigned_labels: string[];
					view_broadcast_reports: boolean;
					create_broadcast: boolean;
					create_phonebook: boolean;
					update_phonebook: boolean;
					delete_phonebook: boolean;
					auto_assign_chats: boolean;
					create_template: boolean;
					update_template: boolean;
					delete_template: boolean;
					create_recurring_broadcast: boolean;
				};
			}>
		) => {
			const index = state.list.findIndex((record) => record.id === action.payload.id);
			if (index !== -1) {
				state.list[index].permissions = action.payload.permission;
			}
		},
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
	changeBroadcastAccess,
	changeViewBroadcastReport,
	changeAutoAssignChats,
	changeCanManipulateTemplate,
	changeCanManipulatePhonebook,
	addLabels,
	removeLabels,
	clearLabels,
	createPhonebook,
	updatePhonebook,
	deletePhonebook,
	createTemplate,
	updateTemplate,
	deleteTemplate,
	updateAgentPermission,
	changeRecurringBroadcast,
} = Slice.actions;

export default Slice.reducer;
