export interface IChemicalsBelongingToSubjectType {
    ChemicalId: string,
    ChemicalName: string,
    Specifications: string,
    Unit: string,
    Amount: number,
    Note: string
}

export interface IDevicesBelongingToSubjectType {
    DeviceId: string,
    DeviceName: string,
    Standard: string,
    Unit: string,
    Quantity: number,
    Note: string
}

export interface IInstrumentBelongingToSubjectType {

}

export interface ISubjectType {
    SubjectId?: String,
    SubjectName: String,
    Credits: Number,
    DepartmentId: Number,
    DepartmentName?: String,
    listChemical: IChemicalsBelongingToSubjectType[] | [],
    listDevice: IDevicesBelongingToSubjectType[] | [],
    listInstrument: IDevicesBelongingToSubjectType[] | [],
}

export const dummySubjectData: ISubjectType = {
    "SubjectId": "",
    "SubjectName": "",
    "Credits": 0,
    "DepartmentId": -1,
    "listChemical": [],
    "listDevice": [],
    "listInstrument": []
}