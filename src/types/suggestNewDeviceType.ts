export interface IListDeviceInSuggestNewDeviceType {
    "SuggestDetailId": string | number,
    "DeviceId": string,
    "DeviceName": string,
    "Unit": string,
    "QuantityAvailable": number,
    "Quantitysuggest": number,
    "Price": string | number,
    "NewStandard": string,
    "ExplainUsage": string,
    "Note": string
}

export interface ISuggestNewDeviceType {
    "SuggestId"?: string,
    "EmployeeId": string,
    "EmployeeName": string,
    "DepartmentId": string | number,
    "DepartmentName": string,
    "Stage": number,
    "StartYear": string | number,
    "EndYear": string | number,
    "ListDevice": IListDeviceInSuggestNewDeviceType[]
}

export interface IListAcceptType {
    "AcceptId": number | string,
    "AcceptDate": string,
    "Status": string,
    "EmployeeId": string,
    "EmployeeName": string
}

export interface IAcceptNewDevicesType {
    "SuggestId": string,
    "listAccept": IListAcceptType[]
}

export const dummyListDeviceInSuggestNewDeviceData: IListDeviceInSuggestNewDeviceType ={
    "SuggestDetailId": "",
    "DeviceId": "",
    "DeviceName": "",
    "Unit": "",
    "QuantityAvailable": 0,
    "Quantitysuggest": 0,
    "Price": 0,
    "NewStandard": "",
    "ExplainUsage": "",
    "Note": ""
} 

export const dummySuggestNewDeviceData: ISuggestNewDeviceType = {
    "SuggestId": "",
    "EmployeeId": "",
    "EmployeeName": "",
    "DepartmentId": -1,
    "DepartmentName": "",
    "Stage": 1,
    "StartYear": 2022,
    "EndYear": 2025,
    "ListDevice": []
}