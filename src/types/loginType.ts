export interface IloginType {
	username: String;
	password: String;
	type: String;
}

export const dummyLoginData: IloginType = {
	username: '',
	password: '',
	type: 'employee',
};
