import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '..';
import { LinkShortenerState } from '../types/LinkShortenerState';

const initialState: LinkShortenerState = {
	details: {
		id: '',
		type: 'whatsapp',
		title: '',
		link: '',
		number: '',
		message: '',
	},
	list: [],
	ui: {
		loading_links: false,
		shortening_link: false,
		link_copied: false,
	},
};

const LinkShortenerReducer = createSlice({
	name: StoreNames.LINK,
	initialState: initialState,
	reducers: {
		reset: (state) => {
			state.list = initialState.list;
			state.details = initialState.details;
			state.ui = initialState.ui;
		},
		resetDetails: (state) => {
			state.details = initialState.details;
		},
		setSelectedLink: (state, action: PayloadAction<string>) => {
			const details = state.list.find((link) => link.id === action.payload);
			if (!details) {
				return;
			}
			state.details.id = details.id;
			state.details.type = details.isWhatsappLink ? 'whatsapp' : 'link';
			state.details.title = details.title;
			state.details.link = details.link;
			state.details.number = details.number;
			state.details.message = details.message;
		},
		setLink: (state, action: PayloadAction<typeof initialState.details.link>) => {
			state.details.link = action.payload;
		},
		setLinkType: (state, action: PayloadAction<typeof initialState.details.type>) => {
			state.details.type = action.payload;
		},
		setNumber: (state, action: PayloadAction<typeof initialState.details.number>) => {
			if (isNaN(Number(action.payload))) {
				return;
			}
			state.details.number = action.payload;
		},
		setMessage: (state, action: PayloadAction<typeof initialState.details.message>) => {
			state.details.message = action.payload;
		},
		setShortenLinksList: (state, action: PayloadAction<typeof initialState.list>) => {
			state.list = action.payload;
		},
		addShortenLink: (state, action: PayloadAction<(typeof initialState.list)[number]>) => {
			state.details = initialState.details;
			state.list.push(action.payload);
		},
		setShortingLink: (state, action: PayloadAction<typeof initialState.ui.shortening_link>) => {
			state.ui.shortening_link = action.payload;
		},
		setTitle: (state, action: PayloadAction<typeof initialState.details.title>) => {
			state.details.title = action.payload;
		},
		setLoadingLinks: (state, action: PayloadAction<typeof initialState.ui.loading_links>) => {
			state.ui.loading_links = action.payload;
		},
		setLinkCopied: (state, action: PayloadAction<typeof initialState.ui.link_copied>) => {
			state.ui.link_copied = action.payload;
		},
		deleteShortenLink: (state, action: PayloadAction<string>) => {
			state.list = state.list.filter((link) => link.id !== action.payload);
		},
		updateShortenLink: (
			state,
			action: PayloadAction<{
				id: string;
				data: Omit<(typeof initialState.list)[number], 'id'>;
			}>
		) => {
			state.list = state.list.map((element) =>
				element.id === action.payload.id
					? { ...action.payload.data, id: action.payload.id }
					: element
			);
		},
	},
});

export const {
	reset,
	setLink,
	setMessage,
	setNumber,
	setShortenLinksList,
	addShortenLink,
	setLinkCopied,
	setShortingLink,
	setTitle,
	resetDetails,
	deleteShortenLink,
	updateShortenLink,
	setLoadingLinks,
	setSelectedLink,
	setLinkType,
} = LinkShortenerReducer.actions;

export default LinkShortenerReducer.reducer;
