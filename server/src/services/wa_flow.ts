import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import IAccount from '../../mongo/types/account';
import IWhatsappLink from '../../mongo/types/whatsappLink';
import MetaAPI from '../config/MetaAPI';
import { Path } from '../config/const';
import { CustomError } from '../errors';
import COMMON_ERRORS from '../errors/common-errors';
import { UpdateWhatsappFlowValidationResult } from '../modules/chatbot/chatbot.validator';
import FileUtils from '../utils/FileUtils';
import { convertToId } from '../utils/MessageHelper';
import WhatsappLinkService from './whatsappLink';

export default class WhatsappFlowService extends WhatsappLinkService {
	public constructor(user: IAccount, device: IWhatsappLink) {
		super(user, device);
	}

	public async listFlows() {
		try {
			const {
				data: { data },
			} = await MetaAPI(this.accessToken).get(`/${this.waid}/flows`);

			return data.map((item: any) => ({
				id: item.id,
				name: item.name,
				status: item.status as 'PUBLISHED' | 'DRAFT',
				categories: item.categories as string[],
			})) as {
				id: string;
				name: string;
				status: 'PUBLISHED' | 'DRAFT';
				categories: string[];
			}[];
		} catch (err) {
			return [];
		}
	}

	public async createFlow(data: { name: string; categories: string[] }) {
		try {
			const formData = new FormData();
			formData.append('name', data.name);
			for (let i = 0; i < data.categories.length; i++) {
				formData.append('categories', data.categories[i]);
			}
			const {
				data: { id },
			} = await MetaAPI(this.accessToken).post(`/${this.waid}/flows`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			return id;
		} catch (err) {
			return null;
		}
	}

	public async updateFlow(flow_id: string, data: { name: string; categories: string[] }) {
		try {
			const formData = new FormData();
			formData.append('name', data.name);
			for (let i = 0; i < data.categories.length; i++) {
				formData.append('categories', data.categories[i]);
			}
			await MetaAPI(this.accessToken).post(`/${flow_id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			return true;
		} catch (err) {
			return false;
		}
	}

	public async deleteFlow(flow_id: string) {
		try {
			await MetaAPI(this.accessToken).delete(`/${flow_id}`);
			return true;
		} catch (err) {
			return false;
		}
	}

	public async publishFlow(flow_id: string) {
		try {
			await MetaAPI(this.accessToken).post(`/${flow_id}/publish`);
			return true;
		} catch (err) {
			return false;
		}
	}

	public async updateFlowContents(id: string, data: UpdateWhatsappFlowValidationResult) {
		const object = {
			version: '3.1',
			screens: [] as {
				id: string;
				title: string;
				layout: {
					type: string;
					children: {
						type: string;
						name: string;
						children: any[];
					}[];
				};
			}[],
		};

		for (let i = 0; i < data.screens.length; i++) {
			const screen = data.screens[i];
			const screenObject: {
				id: string;
				title: string;
				terminal?: boolean;
				success?: boolean;
				data: Record<
					string,
					{
						type: string;
						__example__: string | boolean;
					}
				>;
				layout: {
					type: string;
					children: {
						type: string;
						name: string;
						children: any[];
					}[];
				};
			} = {
				id: convertToId(screen.title, '_'),
				title: screen.title,
				data: {},
				layout: {
					type: 'SingleColumnLayout',
					children: [
						{
							type: 'Form',
							name: 'flow_path',
							children: [],
						},
					],
				},
			};

			let extra_data = {} as Record<
				string,
				{
					type: string;
					__example__: string | boolean;
				}
			>;
			if (i !== 0) {
				object.screens[i - 1].layout.children[0].children.forEach((item) => {
					if (
						item.type === 'TextInput' ||
						item.type === 'TextArea' ||
						item.type === 'DatePicker' ||
						item.type === 'RadioButtonsGroup' ||
						item.type === 'CheckboxGroup' ||
						item.type === 'Dropdown'
					) {
						extra_data[item.name] = {
							type: 'string',
							__example__: 'value',
						};
					} else if (item.type === 'OptIn') {
						extra_data[item.name] = {
							type: 'boolean',
							__example__: true,
						};
					}
				});

				screenObject.data = extra_data;
			}
			if (i === data.screens.length - 1) {
				screenObject.terminal = true;
				screenObject.success = true;
			}

			const children = screen.children.map((child) => {
				if (
					[
						'TextBody',
						'TextCaption',
						'TextSubheading',
						'TextHeading',
						'Image',
						'TextInput',
						'TextArea',
						'DatePicker',
						'OptIn',
					].includes(child.type)
				) {
					return child;
				} else if (['RadioButtonsGroup', 'CheckboxGroup', 'Dropdown'].includes(child.type)) {
					return {
						...child,
						'data-source': ((child as any)['data-source'] as string[]).map((item) => ({
							id: convertToId(item, '_'),
							title: item,
						})),
					};
				} else if (child.type === 'Footer') {
					const keys = screen.children.reduce((acc, item) => {
						if (
							item.type === 'TextInput' ||
							item.type === 'TextArea' ||
							item.type === 'DatePicker' ||
							item.type === 'RadioButtonsGroup' ||
							item.type === 'CheckboxGroup' ||
							item.type === 'Dropdown'
						) {
							acc[item.name] = '${form.' + item.name + '}';
						} else if (item.type === 'OptIn') {
							acc[item.name] = '${form.' + item.name + '}';
						}
						return acc;
					}, {} as Record<string, string>);

					const _data = Object.keys(extra_data).reduce((acc, key) => {
						acc[key] = '${data.' + key + '}';
						return acc;
					}, {} as Record<string, string>);

					return {
						...child,
						'on-click-action': {
							name: i === data.screens.length - 1 ? 'complete' : 'navigate',
							payload: {
								...keys,
								..._data,
							},
							...(i !== data.screens.length - 1
								? {
										next: {
											type: 'screen',
											name: convertToId(data.screens[i + 1].title, '_'),
										},
								  }
								: {}),
						},
					};
				} else {
					throw new CustomError(COMMON_ERRORS.INVALID_FIELDS);
				}
			});

			screenObject.layout.children[0].children = children;
			object.screens.push(screenObject);
		}

		const filepath = `${__basedir}${Path.Misc}${id}.json`;

		await FileUtils.generateJSONFile(filepath, object);

		try {
			const form = new FormData();
			form.append('file', fs.createReadStream(filepath));
			form.append('name', 'flow.json');
			form.append('asset_type', 'FLOW_JSON');
			const { data: results } = await MetaAPI(this.accessToken).post(`/${id}/assets`, form, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			FileUtils.deleteFile(filepath);
			if (results.validation_errors.length > 0) {
				throw new CustomError(COMMON_ERRORS.INVALID_FIELDS);
			}
		} catch (err) {
			FileUtils.deleteFile(filepath);
			if (err instanceof CustomError) {
				throw err;
			}
			throw new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR);
		}
	}

	public async getWhatsappFlowContents(id: string) {
		let url = '';
		try {
			const {
				data: { data },
			} = await MetaAPI(this.accessToken).get(`/${id}/assets`);
			url = data[0].download_url;
		} catch (err) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		try {
			const { data } = await axios.get(url);
			const screens = data.screens.map((screen: any) => {
				const title = screen.title;
				const children = screen.layout.children[0].children.map((child: any) => {
					if (
						[
							'TextBody',
							'TextCaption',
							'TextSubheading',
							'TextHeading',
							'Image',
							'TextInput',
							'TextArea',
							'DatePicker',
							'OptIn',
						].includes(child.type)
					) {
						return child;
					} else if (['RadioButtonsGroup', 'CheckboxGroup', 'Dropdown'].includes(child.type)) {
						return {
							...child,
							'data-source': ((child as any)['data-source'] as any[]).map((item) => item.title),
						};
					} else if (child.type === 'Footer') {
						return child;
					} else {
						throw new CustomError(COMMON_ERRORS.INVALID_FIELDS);
					}
				});

				return {
					id: screen.id,
					title,
					children,
				};
			}) as (UpdateWhatsappFlowValidationResult['screens'][number] & {
				id: string;
			})[];

			return screens;
		} catch (err) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
	}
}
