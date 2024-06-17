import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { RecipientsState } from '../types/RecipientsState';

const initialState: RecipientsState = {
	list: [],
	pinnedConversations: [],
	unpinnedConversations: [],

	uiDetails: {
		loading: false,
	},
	label_filter: [],
	selected_recipient: {
		_id: '',
		recipient: '',
		profile_name: '',
		origin: '',
		expiration_timestamp: '',
		labels: [],
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
	},
});

export const {
	setRecipientsList,
	setRecipientsLoading,
	setSelectedRecipient,
	setRecipientLabels,
	addToPin,
	removeFromPin,
} = Slice.actions;

export default Slice.reducer;
