export interface ISubjectType {
    SubjectId?: String,
    SubjectName: String,
    Credits: Number,
    DepartmentId: Number,
    DepartmentName?: String
}

export const dummySubjectData: ISubjectType = {
    "SubjectId": "",
    "SubjectName": "",
    "Credits": 0,
    "DepartmentId": -1
}