export interface ITrainSchedule {
	DeviceId: String;
	DeviceName: String;
	TrainerId: String;
	TrainerName: String;
	listTrainSchedule: ITrainScheduleDeviceItem[];
}

export interface ITrainScheduleDeviceItem {
	ResultId: Number;
	ResearcherId: String;
	ResearcherName: String;
	TrainDate: String | Number | null;
	TrainTime: Number;
	Result: String;
	InstructorId: String;
	InstructorName: String;
	Note: String;
}

export interface ITrainRegister {
	listTrainDetail: ITrainRegisterDetail[];
	ResearcherId: String;
	Fullname: String;
	Birthday: String;
	Gender: String;
	Address: String;
	Email: String;
	PhoneNumber: String;
	Organization: String;
}

export interface ITrainRegisterDetail {
	ResultId: Number;
	DeviceId: String;
	DeviceName?: String;
	InstructorId: String;
	InstructorName?: String;
	TrainDate?: String | Number;
	TrainTime?: Number;
	Result?: String;
	TrainerId?: String;
	TrainerName?: String;
}

export interface ITrainDevice {
	DeviceId: String;
	DeviceName: String;
}

export interface ITrainInstructor {
	InstructorId: String;
	InstructorName: String;
}

export interface ITrainer {
	TrainerId: String;
	TrainerName: String;
}
