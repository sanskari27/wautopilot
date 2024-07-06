import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { RecipientsState } from '../types/RecipientsState';

const initialState: RecipientsState = {
	unReadConversations: [],

	list: [],
	pinnedConversations: [],
	unpinnedConversations: [],
	selected_recipient_list: [],
	uiDetails: {
		loading: false,
	},
	label_filter: [],
	selected_recipient: {
		_id: '',
		recipient: '',
		profile_name: '',
		origin: '',
		labels: [],
		expiry: 'EXPIRED',
	},
};

const Slice = createSlice({
	name: StoreNames.RECIPIENT,
	initialState,
	reducers: {
		setRecipientsList: (state, action: PayloadAction<typeof initialState.list>) => {
			state.list = action.payload;
			const pinnedIds = JSON.parse(localStorage.getItem('pinned') || '[]') as string[];
			state.pinnedConversations = action.payload.filter((item) => pinnedIds.includes(item._id));
			state.unpinnedConversations = action.payload.filter((item) => !pinnedIds.includes(item._id));
		},
		setRecipientsLoading: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.loading = action.payload;
		},
		setSelectedRecipient: (
			state,
			action: PayloadAction<typeof initialState.selected_recipient>
		) => {
			state.selected_recipient = action.payload;
		},
		setRecipientLabels: (state, action: PayloadAction<{ labels: string[]; id: string }>) => {
			const { labels, id } = action.payload;
			state.list = state.list.map((item) => {
				if (item._id === id) {
					return { ...item, labels };
				}
				return item;
			});
			const pinnedIds = JSON.parse(localStorage.getItem('pinned') || '[]') as string[];
			state.pinnedConversations = state.list.filter((item) => pinnedIds.includes(item._id));
			state.unpinnedConversations = state.list.filter((item) => !pinnedIds.includes(item._id));
		},
		addToPin: (state, action: PayloadAction<string>) => {
			const pinnedIds = JSON.parse(localStorage.getItem('pinned') || '[]') as string[];
			const data = [action.payload, ...pinnedIds];
			localStorage.setItem('pinned', JSON.stringify(data));
			state.pinnedConversations = state.list.filter((item) => pinnedIds.includes(item._id));
			state.unpinnedConversations = state.list.filter((item) => !pinnedIds.includes(item._id));
		},
		removeFromPin: (state, action: PayloadAction<string>) => {
			const pinnedIds = JSON.parse(localStorage.getItem('pinned') || '[]') as string[];
			const newPinnedIds = pinnedIds.filter((item) => item !== action.payload);
			localStorage.setItem('pinned', JSON.stringify(newPinnedIds));
			state.pinnedConversations = state.list.filter((item) => newPinnedIds.includes(item._id));
			state.unpinnedConversations = state.list.filter((item) => !newPinnedIds.includes(item._id));
		},
		setLabelFilter: (state, action: PayloadAction<string[]>) => {
			state.label_filter = action.payload;
		},
		addUnreadConversation: (state, action: PayloadAction<string>) => {
			if (state.selected_recipient._id !== action.payload) {
				state.unReadConversations = [action.payload, ...state.unReadConversations];
			}

			const others = state.list.filter((item) => item._id !== action.payload);
			const convo = state.list.filter((item) => item._id === action.payload);
			state.list = [...convo, ...others];
			const pinnedIds = JSON.parse(localStorage.getItem('pinned') || '[]') as string[];
			state.pinnedConversations = state.list.filter((item) => pinnedIds.includes(item._id));
			state.unpinnedConversations = state.list.filter((item) => !pinnedIds.includes(item._id));
		},
		removeUnreadConversation: (state, action: PayloadAction<string>) => {
			state.unReadConversations = state.unReadConversations.filter(
				(item) => item !== action.payload
			);
		},
		setExpiry: (state, action: PayloadAction<'EXPIRED' | number>) => {
			state.selected_recipient.expiry = action.payload;
		},
		addRemoveRecipientList: (state, action: PayloadAction<string>) => {
			if (state.selected_recipient_list.includes(action.payload)) {
				state.selected_recipient_list = state.selected_recipient_list.filter(
					(item) => item !== action.payload
				);
			} else {
				state.selected_recipient_list.push(action.payload);
			}
		},
	},
});

export const {
	setRecipientsList,
	setRecipientsLoading,
	setSelectedRecipient,
	setRecipientLabels,
	addToPin,
	removeFromPin,
	addUnreadConversation,
	removeUnreadConversation,
	setLabelFilter,
	setExpiry,
	addRemoveRecipientList,
} = Slice.actions;

export default Slice.reducer;
