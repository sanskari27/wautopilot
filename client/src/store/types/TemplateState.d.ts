export type TemplatesState = {
	list: Template[];
	details: Template;
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
	components: Record[];
};
