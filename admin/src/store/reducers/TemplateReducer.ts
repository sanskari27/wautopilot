/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { StoreNames } from '../config';
import { Template, TemplatesState } from '../types/TemplateState';

const initialState: TemplatesState = {
	list: [],
	details: {
		id: '',
		name: '',
		status: '',
		category: 'MARKETING',
		components: [] as Record<string, unknown>[],
	},
	uiDetails: {
		isSaving: false,
		isFetching: false,
		error: '',
	},
	file: null,
};

const Slice = createSlice({
	name: StoreNames.TEMPLATES,
	initialState,
	reducers: {
		reset: (state) => {
			state.list = initialState.list;
			state.details = initialState.details;
			state.uiDetails = initialState.uiDetails;
			state.file = initialState.file;
		},
		setDetails: (
			state,
			action: PayloadAction<
				Template & {
					components: Record<string, unknown>[];
				}
			>
		) => {
			state.details = action.payload;
		},
		resetDetails: (state) => {
			state.details = initialState.details;
		},
		setFile: (state, action: PayloadAction<File | null>) => {
			state.file = action.payload;
		},
		setTemplatesList: (state, action: PayloadAction<Template[]>) => {
			state.list = action.payload;
		},
		setSaving: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isSaving = action.payload;
		},
		setTemplateFetching: (state, action: PayloadAction<boolean>) => {
			state.uiDetails.isFetching = action.payload;
		},
		setError: (state, action: PayloadAction<string>) => {
			state.uiDetails.error = action.payload;
		},
		setTemplateCategory: (state, action: PayloadAction<string>) => {
			state.details.category = action.payload;
		},
		setTemplateName: (state, action: PayloadAction<string>) => {
			state.details.name = action.payload.replace(/ /g, '_');
		},
		setHeaderType: (state, action: PayloadAction<string>) => {
			state.details.components = state.details.components.filter(
				(c: { type: string }) => c.type !== 'HEADER'
			);

			if (action.payload !== 'none') {
				state.details.components.push({
					type: 'HEADER',
					format: action.payload,
				});
			}
			if (action.payload === 'TEXT' || action.payload === 'none') {
				state.file = null;
			}
		},
		setHeaderText: (state, action: PayloadAction<string>) => {
			state.details.components = state.details.components.filter(
				(c: { type: string }) => c.type !== 'HEADER'
			);

			if (action.payload) {
				state.details.components.push({
					type: 'HEADER',
					format: 'TEXT',
					text: action.payload,
				});
			}
		},
		setBodyText: (state, action: PayloadAction<string>) => {
			state.details.components = state.details.components.filter(
				(c: { type: string }) => c.type !== 'BODY'
			);

			if (action.payload) {
				state.details.components.push({
					type: 'BODY',
					text: action.payload,
				});
			}
		},
		setBodyExample: (state, action: PayloadAction<string>) => {
			state.details.components = state.details.components.map(
				(c: { type: string; text: string }) => {
					if (c.type !== 'BODY') return c;
					return {
						type: 'BODY',
						text: c.text,
						example: {
							body_text: [action.payload.split(',').map((text) => text.trim())],
						},
					};
				}
			);
		},
		setFooterText: (state, action: PayloadAction<string>) => {
			state.details.components = state.details.components.filter(
				(c: { type: string }) => c.type !== 'FOOTER'
			);

			if (action.payload) {
				state.details.components.push({
					type: 'FOOTER',
					text: action.payload,
				});
			}
		},
		removeButtonComponent: (state, action: PayloadAction<string>) => {
			state.details.components = state.details.components.map((c: any) => {
				if (c.type !== 'BUTTONS') return c;
				return {
					type: 'BUTTONS',
					buttons: c.buttons.filter((b: { text: string }) => b.text !== action.payload),
				};
			});
		},
		addQuickReply: (state, action: PayloadAction<string>) => {
			state.details.components = state.details.components.map((c: any) => {
				if (c.type !== 'BUTTONS') return c;
				return {
					type: 'BUTTONS',
					buttons: [
						...c.buttons,
						{
							text: action.payload,
							type: 'QUICK_REPLY',
						},
					],
				};
			});
		},
		addPhoneNumberButton: (
			state,
			action: PayloadAction<{
				text: string;
				phoneNumber: string;
			}>
		) => {
			state.details.components = state.details.components.map((c: any) => {
				if (c.type !== 'BUTTONS') return c;
				return {
					type: 'BUTTONS',
					buttons: [
						...c.buttons,
						{
							text: action.payload.text,
							phone_number: action.payload.phoneNumber,
							type: 'PHONE_NUMBER',
						},
					],
				};
			});
		},
		addURLButton: (
			state,
			action: PayloadAction<{
				text: string;
				url: string;
			}>
		) => {
			state.details.components = state.details.components.map((c: any) => {
				if (c.type !== 'BUTTONS') return c;
				return {
					type: 'BUTTONS',
					buttons: [
						...c.buttons,
						{
							text: action.payload.text,
							url: action.payload.url,
							type: 'URL',
						},
					],
				};
			});
		},
	},
});

export const {
	reset,
	setFile,
	setTemplatesList,
	setError,
	setTemplateFetching,
	setSaving,
	setDetails,
	setHeaderType,
	setTemplateName,
	setTemplateCategory,
	setBodyText,
	setFooterText,
	removeButtonComponent,
	setHeaderText,
	addQuickReply,
	addPhoneNumberButton,
	setBodyExample,
	addURLButton,
	resetDetails,
} = Slice.actions;

export default Slice.reducer;
