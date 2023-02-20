import { IExportChemicalType } from './exportChemicalType';
import { IExportDeviceType } from './exportDeviceType';

export interface IExportType {
	ExportId?: String;
	ExpSubjectId?: String;
	ExportLabId?: String;
	ExportDate: number;
	Content: String;
	Note?: String;
	EmployeeId: String;
	EmployeeInCharge?: String;
	EmployeeCreate?: String;
	EmployeeCreateName?: String;
	DepartmentId?: Number;
	Accept?: String;
	UserAccept?: String;
	listChemicalExport?: IExportChemicalType[];
	listDeviceExport?: IExportDeviceType[];
	formatedExportDate?: String;
	UserAcceptName?: String;
	ExpRegGeneralId?: String;
	Semester?: Number;
	Schoolyear?: String;
	SubjectId?: String;
	SubjectName?: String;
	RegisterGeneralId?: Number;
	EmployeeInChargeName?: String;

	// "Status": String,
	EmployeeName?: String;
	// "formatedExportDate"?: String,
	ThesisName?: String;
	Instructor?: String;
	ResearchSubject?: String;
	DepartmentName?: String;
	LabId?: Number;
	LabName?: String;
	listDevice?: IExportDeviceType[];
	listInstrument?: IExportDeviceType[];
	listInstrumentExport?: IExportDeviceType[];
	listSub?: IExportChemicalType[];
	// "SessionId"?: Number,
	// "RegisterGeneralId"?: Number,
	// "TeacherName"?: String,
	// "ClassId"?: String,
	// "ClassName"?: String
	// "DayOfWeek"?: Number,
	// "StartTime"?: Number,
	// "EndTime"?: Number,
	// "LessonName"?: String,
	// "SubjectName"?: String,
	// "fortmatDateStudy"?: String,
	// "DateStudy"?: number,
}

export const dummyExportData: IExportType = {
	// "ExportId"?: String,
	// "ExportDate": number,
	// "Content": String,
	// "Note": String,
	// "EmployeeId": String,
	// "DepartmentId": Number,
	// "Accept": boolean,
	// "UserAccept": String,
	// "listChemicalExport": IExportChemicalType[],
	// "listDeviceExport": IExportDeviceType[],

	ExportId: '',
	ExpSubjectId: '',
	ExportLabId: '',
	ExportDate: Math.floor(Number(new Date()) / 1000),
	Content: '',
	Note: '',
	EmployeeId: '',
	EmployeeInCharge: '',
	EmployeeInChargeName: '',
	EmployeeCreate: '',
	EmployeeCreateName: '',
	DepartmentId: -1,
	Accept: "",
	UserAccept: '',
	listChemicalExport: [],
	listDeviceExport: [],
	listInstrumentExport: [],
	ExpRegGeneralId: '',
	Semester: 1,
	Schoolyear: '',
	RegisterGeneralId: 0,
	listSub: [],
	SubjectName: '',
	// "Status": "",
	// "EmployeeId": "",
	EmployeeName: '',
	// "formatedExportDate": "",
	// "ThesisName": "",
	// "Instructor": "",
	// "ResearchSubject": "",
	DepartmentName: '',
	UserAcceptName: '',
	LabId: -1,
	LabName: '',
	// "SessionId": -1,
	// "RegisterGeneralId": -1,
	// "TeacherName": "",
	// "ClassId": "",
	// "ClassName": "",
	// "DayOfWeek": -1,
	// "StartTime": -1,
	// "EndTime": -1,
	// "LessonName": "",
	// "SubjectName": "",
	// "fortmatDateStudy": "",
	// "DateStudy": Number(new Date())
};
