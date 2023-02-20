import { dummyEmployeeData, IEmployeeType } from './employeeType';

export interface IUserLogin {
	UserName: String;
	AccessToken: String;
	RefreshToken: String;
}

export interface IUserOwner extends IEmployeeType {
	DepartmentName: String;
	Status: String;
	Birthdate: String;
	StudentId: String;
	ClassName: String;
	GroupId: Number;
	GroupName: String;
	ReseacherId: Number;
	Organization: String;
}

export const dummyUserOwner: IUserOwner = {
	...dummyEmployeeData,
	Status: '',
	DepartmentName: '',
	Birthdate: '',
	StudentId: '',
	ClassName: '',
	GroupId: -1,
	GroupName: '',
	ReseacherId: -1,
	Organization: '',
};
