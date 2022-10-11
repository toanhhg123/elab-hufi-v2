export interface IEmployeeType {
    EmployeeID?: String,
    Fullname: String,
    Birthday: number,
    Gender: "Nam" | "Nữ" | "Khác",
    Address: String,
    Email: String,
    PhoneNumber: String,
    DepartmentId: number,
    DepartmentName?: String,
    formatedBirthday?: String
}

export const dummyEmployeeData: IEmployeeType = { 
    "EmployeeID": "", 
    "Fullname": "", 
    "Birthday": 0, 
    "Gender": "Nam", 
    "Address": "", 
    "Email": "", 
    "PhoneNumber": "", 
    "DepartmentId": -1,
    "formatedBirthday": ""
}