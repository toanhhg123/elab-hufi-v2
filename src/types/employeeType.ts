export interface IEmployeeType {
    EmployeeId?: String,
    Fullname: String,
    Birthdate: String | number,
    Gender: "Nam" | "Nữ" | "Khác",
    Address: String,
    Email: String,
    PhoneNumber: String,
    DepartmentId: number,
    DepartmentName?: String,
    formatedBirthdate?: String,
}

export const dummyEmployeeData: IEmployeeType = {
    "EmployeeId": "",
    "Fullname": "",
    "Birthdate": 0,
    "Gender": "Nam",
    "Address": "",
    "Email": "",
    "PhoneNumber": "",
    "DepartmentId": -1,
    "formatedBirthdate": ""
}