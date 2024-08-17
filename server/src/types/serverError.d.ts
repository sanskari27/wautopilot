export default interface IServerError {
	STATUS: number;
	TITLE: string;
	MESSAGE: string;
	OBJECT?: Record<string, any>;
}
