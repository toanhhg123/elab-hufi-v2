interface IListChemicalType {
    "Purpose": string,
    "ChemicalId": string,
    "ChemicalName": string,
    "Specifications": string,
    "Unit": string,
    "Amount": number,
    "Note": string
}

interface IListDeviceType {
    "Purpose": string,
    "DeviceId": string,
    "DeviceName": string,
    "Standard": string,
    "Unit": string,
    "Quantity": number,
    "Note": string
}

interface IListInstrumentType {
}

interface IListToolType {
}

export interface IRegisterGeneralType {
    "ListChemical": IListChemicalType[] | [],
    "ListDevice": IListDeviceType[] | [],
    "ListInstrument": IListInstrumentType[] | [],
    "ListTool": IListToolType[] | [],
    "RegisterGeneralId": string | Number,
    "DateCreate": string,
    "Instructor": string,
    "ThesisName": string,
    "ResearchSubject": string,
    "StartDate": string,
    "EndDate": string,
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
    "Instructor": "",
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