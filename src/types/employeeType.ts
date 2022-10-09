export interface IEmployeeType {
    EmployeeID?: String,
    Fullname: String,
    Birthday: any,
    Gender: "Nam" | "Nữ" | "Khác",
    Address: String,
    Email: String,
    PhoneNumber: String,
    DepartmentId: number
}

export const dummyEmployeeData: IEmployeeType = { 
    "EmployeeID": "", 
    "Fullname": "", 
    "Birthday": Date.now(), 
    "Gender": "Nam", 
    "Address": "", 
    "Email": "", 
    "PhoneNumber": "", 
    "DepartmentId": -1
}