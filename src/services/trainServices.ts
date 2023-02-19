import axios from 'axios';
import * as API from '../configs/apiHelper';
import config from '../configs/app';
import { ITrainDevice, ITrainer, ITrainInstructor, ITrainRegister, ITrainSchedule } from '../types/trainType';
const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

//TRAIN SCHEDULE
export const getTrainSchedules = async (type: String) => {
	const url = `${API_ENDPOINT}/api/TrainSchedules/${type}`;
	const trainSchedules: ITrainSchedule[] = await API.get<ITrainSchedule[]>(url);
	return trainSchedules;
};

export const getTrainScheduleById = async (type: String, id: String) => {
	const url = `${API_ENDPOINT}/api/TrainSchedules/${type}/${id}`;
	const trainSchedule: ITrainSchedule = await API.get<ITrainSchedule>(url);
	return trainSchedule;
};

export const updateTrainSchedules = async (type: String, updatedData: ITrainSchedule[]) => {
	const url = `${API_ENDPOINT}/api/TrainSchedules/${type}`;
	const trainSchedule: ITrainSchedule[] = await API.put<ITrainSchedule[], ITrainSchedule[]>(url, updatedData);
	return trainSchedule;
};

export const deleteTrainSchedule = async (type: String, deletedData: ITrainSchedule) => {
	const url = `${API_ENDPOINT}/api/TrainSchedules/${type}`;
	const res = await axios.delete(url, { data: deletedData });
	return res;
};

export const getTrainer = async () => {
	const url = `${API_ENDPOINT}/api/TrainSchedules/trainer`;
	const trainer: ITrainer[] = await API.get<ITrainer[]>(url);
	return trainer;
};

//TRAIN REGISTER
export const getTrainRegister = async (type: String) => {
	const url = `${API_ENDPOINT}/api/TrainRegisters/${type}`;
	const trainRegister: ITrainRegister[] = await API.get<ITrainRegister[]>(url);
	return trainRegister;
};

export const updateTrainRegister = async (type: String, updatedData: ITrainRegister) => {
	const url = `${API_ENDPOINT}/api/TrainRegisters/${type}`;
	const trainRegister: ITrainRegister = await API.put<ITrainRegister, ITrainRegister>(url, updatedData);
	return trainRegister;
};

export const postTrainRegister = async (type: String ,newData: ITrainRegister) => {
	const url = `${API_ENDPOINT}/api/TrainRegisters/${type}`;
	const trainRegister = await API.post<ITrainRegister, ITrainRegister>(url, newData);
	return trainRegister;
};

export const deleteTrainRegister = async (type: String, deletedData: ITrainRegister) => {
	const url = `${API_ENDPOINT}/api/TrainRegisters/${type}`;
	const res = await axios.delete(url, { data: deletedData });
	return res;
};

export const getTrainDevices = async () => {
	const url = `${API_ENDPOINT}/api/TrainRegisters/device`;
	const trainDevices: ITrainDevice[] = await API.get<ITrainDevice[]>(url);
	return trainDevices;
};

export const getTrainInstructors = async () => {
	const url = `${API_ENDPOINT}/api/TrainRegisters/instructor`;
	const trainInstructors: ITrainInstructor[] = await API.get<ITrainInstructor[]>(url);
	return trainInstructors;
};
