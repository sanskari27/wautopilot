export type TemplatesState = {
	list: Template[];
	details: Template & {
		components: Record[];
	};
	uiDetails: {
		isSaving: boolean;
		isFetching: boolean;
		error: string;
	};
};

type Template = {
	id: string;
	name: string;
	status: string;
	category: string;
};
