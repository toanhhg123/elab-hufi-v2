export interface IScheduleType {
    SessionId?: Number,
    ClassId: String,
    SubjectName: String,
    LessonName: String,
    Credits: Number,
    ClassName: String,
    DayOfWeek: Number,
    StartTime: Number,
    EndTime: Number,
    ScheduleType: String,
    TotalTime: Number,
    NumOfStudent: Number,
    DateStudy: String | Number,
    LabName: String,
    TeacherName: String,
    Semester: Number,
    Schoolyear: String
}

export const dummyScheduleData: IScheduleType ={
    "SessionId":1,
    "ClassId":"01022233301",
    "SubjectName":"Phân tích thực phẩm",
    "LessonName":"Bài 1: Pha chế rượu",
    "Credits":2,
    "ClassName":"11DHTP2",
    "DayOfWeek":3,
    "StartTime":1,
    "EndTime":3,
    "ScheduleType":"TH",
    "TotalTime":30,
    "NumOfStudent":31,
    "DateStudy":"1652331600",
    "LabName":"PTN204",
    "TeacherName":"01001011-Nguyễn Văn Lễ",
    "Semester":1,
    "Schoolyear":"2022-2023"
}