import { dummyEmployeeData, IEmployeeType } from "./employeeType";
import { dummyToken, IToken } from "./tokenType";

export interface IUserLogin {
  UserName: string;
  AccessToken: string;
  RefreshToken: string;
}

export interface IUserOwner extends IEmployeeType, IToken {
  DepartmentName: string;
  Status: string;
  Birthdate: string;
  StudentId: string;
  ClassName: string;
  GroupId: Number;
  GroupName: string;
  ReseacherId: Number;
  Organization: string;
}

export const isUserOwner = (pet: any): pet is IUserOwner =>
  Object.keys(pet).includes("UserName") &&
  Object.keys(pet).includes("AccessToken") &&
  Object.keys(pet).includes("RefreshToken");

export const dummyUserOwner: IUserOwner = {
  ...dummyEmployeeData,
  ...dummyToken,
  Status: "",
  DepartmentName: "",
  Birthdate: "",
  StudentId: "",
  ClassName: "",
  GroupId: -1,
  GroupName: "",
  ReseacherId: -1,
  Organization: "",
};

export const GroupNames = {
  Admin: "Admin",
  "Ban giám hiệu": "Ban giám hiệu",
  "Trưởng phòng QTTB": "Trưởng phòng QTTB",
  "Chuyên viên phòng QTTB": "Chuyên viên phòng QTTB",
  "Trưởng phòng TT TNTH": "Trưởng phòng TT TNTH",
  "Chuyên viên TT TNTH": "Chuyên viên TT TNTH",
  "Trưởng đơn vị sử dụng": "Trưởng đơn vị sử dụng",
  "Chuyên viên đơn vị sử dụng": "Chuyên viên đơn vị sử dụng",
};
