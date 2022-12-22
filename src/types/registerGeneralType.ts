export interface IRegisterGeneralType {
    "RegisterGeneralId"?: Number,
    "DateCreate": number,
    "Instructor": String,
    "ThesisName": String,
    "ResearchSubject": String,
    "StartDate": number,
    "EndDate": number,
    "Status": String,
    "ResearcherID": String,
    "EmployeeId": String,
}

export const dummyWarehouseRegisterGeneralData: IRegisterGeneralType = {
    "RegisterGeneralId": -1,
    "DateCreate": 0,
    "Instructor": "",
    "ThesisName": "",
    "ResearchSubject": "",
    "StartDate": 0,
    "EndDate": 0,
    "Status": "",
    "ResearcherID": "",
    "EmployeeId": "",
}