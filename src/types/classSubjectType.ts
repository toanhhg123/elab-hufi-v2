export interface IClassSubjectType {
    ClassId?: String,
    ClassCode?:  String,
    ClassName: String,
    NumOfStudent: Number,
    EmployeeId: String,
    EmployeeName: String,
    Semester: String,
    Schoolyear: String,
    SubjectId: String,
    SubjectName?: String
}

export const dummyClassSubjectData: IClassSubjectType = {
    "ClassId": "",
    "ClassCode": "",
    "ClassName": "",
    "NumOfStudent": 0,
    "EmployeeId": "",
    "EmployeeName": "",
    "Semester": "1",
    "Schoolyear": "",
    "SubjectId": ""
}