export interface IChemicalsBelongingToLessonLabType {
    ChemicalId: string,
    ChemicalName: string,
    Specifications: string,
    Unit: string,
    Amount: number,
    Note: string
}

export interface IDevicesBelongingToLessonLab {
    DeviceId: string,
    DeviceName: string,
    Standard: string,
    Unit: string,
    Quantity: number,
    Note: string
}

export interface IInstrumentBelongingToLessonLab {

}

export interface ILessonLabType {
    LessonId?: Number,
    LessonName: String,
    SubjectId: String,
    SubjectName?: String,
    listChemical: IChemicalsBelongingToLessonLabType[] | [],
    listDevice: IDevicesBelongingToLessonLab[] | [],
    listInstrument: IDevicesBelongingToLessonLab[] | [],
}

export const dummyLessonLabData: ILessonLabType = {
    "LessonId": 0,
    "LessonName": "",
    "SubjectId": "",
    "SubjectName": "",
    "listChemical": [],
    "listDevice": [],
    "listInstrument": []
}