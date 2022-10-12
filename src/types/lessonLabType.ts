export interface ILessonLabType {
    LessonId?: Number,
    LessonName: String,
    SubjectId: String,
    SubjectName?: String
}

export const dummyLessonLabData: ILessonLabType = {
    "LessonId": 0,
    "LessonName": "",
    "SubjectId": "",
    "SubjectName": ""
}