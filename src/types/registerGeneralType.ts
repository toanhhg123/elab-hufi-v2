export interface IListChemicalRegisterGeneralType {
    "Purpose": string,
    "ChemicalId": string,
    "ChemicalName": string,
    "Specifications": string,
    "Unit": string,
    "Amount": number,
    "Note": string
}

export interface IListDeviceRegisterGeneralType {
    "Purpose": string,
    "DeviceId": string,
    "DeviceName": string,
    "Standard": string,
    "Unit": string,
    "Quantity": number,
    "Note": string
}

interface IListInstrumentRegisterGeneralType {
    "Purpose": string,
    "DeviceId": string,
    "DeviceName": string,
    "Standard": string,
    "Unit": string,
    "Quantity": number,
    "Note": string
}

interface IListToolRegisterGeneralType {
    "Purpose": string,
    "DeviceId": string,
    "DeviceName": string,
    "Standard": string,
    "Unit": string,
    "Quantity": number,
    "Note": string
}

export interface IRegisterGeneralType {
    "ListChemical": IListChemicalRegisterGeneralType[] | [],
    "ListDevice": IListDeviceRegisterGeneralType[] | [],
    "ListInstrument": IListInstrumentRegisterGeneralType[] | [],
    "ListTool": IListToolRegisterGeneralType[] | [],
    "RegisterGeneralId": string | Number,
    "DateCreate": string,
    "formatedDateCreate"?: string,
    "InstructorId": string,
    "InstructorName": string,
    "ThesisName": string,
    "ResearchSubject": string,
    "StartDate": string,
    "formatedStartDate"?: string,
    "EndDate": string,
    "formatedEndDate"?: string,
    "ResearcherId": string,
    "ResearcherName": string,
    "EmployeeId": string,
    "EmployeeName": string,
    "DepartmentId": Number
}

export const dummyRegisterGeneralData: IRegisterGeneralType = {
    "ListChemical": [],
    "ListDevice": [],
    "ListInstrument": [],
    "ListTool": [],
    "RegisterGeneralId": -1,
    "DateCreate": "",
    "InstructorId":"",
    "InstructorName":"",
    "ThesisName": "",
    "ResearchSubject": "",
    "StartDate": "",
    "EndDate": "",
    "ResearcherId": "",
    "ResearcherName": "",
    "EmployeeId": "",
    "EmployeeName": "",
    "DepartmentId": -1
}

interface IlistParameterType {
    "ParameterValue": string,
    "ParameterId": number,
    "Describe": string
}
interface IlistDeviceInRegisterSessionType {
    "listParameter": IlistParameterType[] | [],
    "DeviceId": string,
    "DeviceName": string,
    "DeviceType": string,
    "Standard": string,
    "Unit": string,
    "HasTrain": number
}

export interface IRegisterSessionType {
    "RegisterSessionId": string,
    "RegisterGeneralId": string,
    "DateCreate": string,
    "NumberOfMem": number,
    "ResearcherId": string,
    "ResearcherName": string,
    "Email": string,
    "PhoneNumber": string,
    "TeamId": string,
    "ThesisName": string,
    "Instructor": string,
    "DepartmentId": string,
    "listDevice": IlistDeviceInRegisterSessionType[] | []
}