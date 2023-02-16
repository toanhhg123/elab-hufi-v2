import { dummyEmployeeData, IEmployeeType } from './employeeType';

export interface IUserLogin {
	UserName: String;
	AccessToken: String;
	RefreshToken: String;
}

export interface IUserOwner extends IEmployeeType {
	DepartmentName: String;
	Status: String;
	Birthdate: String
}

export const dummyUserOwner: IUserOwner = {
	...dummyEmployeeData,
	Status: '',
	DepartmentName: '',
	Birthdate: '',
};
