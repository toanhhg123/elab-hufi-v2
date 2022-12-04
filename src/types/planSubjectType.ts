export interface IChemicalsBelongingToPlanSubjectType {
    AmountTotal: number,
    ChemicalId: string,
    ChemicalName: string,
    Specifications: string,
    Unit: string,
    Amount: number,
    Note: string
}

export interface IDevicesBelongingToPlanSubjectType {
    DeviceId: string,
    DeviceName: string,
    Standard: string,
    Unit: string,
    Quantity: number,
    Note: string
}

export interface IInstrumentBelongingToPlanSubjectType {
    DeviceId: string,
    DeviceName: string,
    Standard: string,
    Unit: string,
    Quantity: number,
    Note: string
}

export interface IPlanSubjectType {
    PlanId?: string,
    Semester: number,
    Schoolyear: string,
    Content: string,
    NumClass: number,
    NumGroupOfClass: number,
    Note: string,
    EmployeeId: string,
    SubjectId: string,
    EmployeeName?: string,
    SubjectName?: string,
    listChemical: IChemicalsBelongingToPlanSubjectType[] | [],
    listDevice: IDevicesBelongingToPlanSubjectType[] | [],
    listInstrument: IDevicesBelongingToPlanSubjectType[] | [],
}

export const dummyPlanSubjectData: IPlanSubjectType = {
    "PlanId": "",
    "Semester": 1,
    "Schoolyear": "",
    "Content": "",
    "NumClass": 0,
    "NumGroupOfClass": 0,
    "Note": "",
    "EmployeeId": "",
    "SubjectId": "",
    "listChemical": [],
    "listDevice": [],
    "listInstrument": []
}

export interface IChemicalSubjectType {
    PlanId: string,
    SubjectName: string,
    AmountSubTotal: number
}

export interface IDeptSummaryType {
    ChemicalId: string,
    ChemicalName: string,
    Specifications: string,
    Unit: string,
    AmountTotal: number,
    listSubject: IChemicalSubjectType[] | []
}