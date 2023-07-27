export interface IEmployeeType {
    EmployeeId?: string,
    Fullname: string,
    Birthdate: string | number,
    Gender: "Nam" | "Nữ" | "Khác",
    Address: string,
    Email: string,
    PhoneNumber: string,
    DepartmentId: number,
    DepartmentName?: string,
    formatedBirthdate?: string,
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