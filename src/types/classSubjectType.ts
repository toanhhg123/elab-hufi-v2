export interface IClassSubjectType {
    ClassId?: String,
    ClassName: String,
    NumOfStudent: Number,
    TeacherName: String,
    Semester: Number,
    Schoolyear: String,
    SubjectId: String,
    SubjectName?: String
}

export const dummyClassSubjectData: IClassSubjectType = {
    "ClassId": "",
    "ClassName": "",
    "NumOfStudent": 0,
    "TeacherName": "",
    "Semester": 0,
    "Schoolyear": "",
    "SubjectId": ""
}