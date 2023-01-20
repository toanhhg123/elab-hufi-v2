import axios from 'axios';
import * as API from '../configs/apiHelper';
import config from '../configs/app';
import { ITrainDevice, ITrainer, ITrainInstructor, ITrainRegister, ITrainSchedule } from '../types/trainType';
const { isProd } = config;
const API_ENDPOINT = 'https://www.aspsite.somee.com';

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

//TRAIN SCHEDULE
export const getTrainSchedules = async () => {
	const url = `${API_ENDPOINT}/api/TrainSchedules`;
	const trainSchedules: ITrainSchedule[] = await API.get<ITrainSchedule[]>(url);
	return trainSchedules;
};

export const getTrainScheduleById = async (id: String) => {
	const url = `${API_ENDPOINT}/api/TrainSchedules/${id}`;
	const trainSchedule: ITrainSchedule = await API.get<ITrainSchedule>(url);
	return trainSchedule;
};

export const updateTrainSchedules = async (updatedData: ITrainSchedule[]) => {
	const url = `${API_ENDPOINT}/api/TrainSchedules`;
	const trainSchedule: ITrainSchedule[] = await API.put<ITrainSchedule[], ITrainSchedule[]>(url, updatedData);
	return trainSchedule;
};

export const deleteTrainSchedule = async (deletedData: ITrainSchedule) => {
	const url = `${API_ENDPOINT}/api/TrainSchedules`;
	const res = await axios.delete(url, { data: deletedData });
	return res;
};

export const getTrainer = async () => {
	const url = `${API_ENDPOINT}/api/TrainSchedules/trainer`;
	const trainer: ITrainer[] = await API.get<ITrainer[]>(url);
	return trainer;
};

//TRAIN REGISTER
export const getTrainRegister = async (id: String) => {
	const url = `${API_ENDPOINT}/api/TrainRegisters/${id}`;
	const trainRegister: ITrainRegister = await API.get<ITrainRegister>(url);
	return trainRegister;
};

export const updateTrainRegister = async (updatedData: ITrainRegister) => {
	const url = `${API_ENDPOINT}/api/TrainRegisters`;
	const trainRegister: ITrainRegister = await API.put<ITrainRegister, ITrainRegister>(url, updatedData);
	return trainRegister;
};

export const postTrainRegister = async (newData: ITrainRegister) => {
	const url = `${API_ENDPOINT}/api/TrainRegisters`;
	const trainRegister = await API.post<ITrainRegister, ITrainRegister>(url, newData);
	return trainRegister;
};

export const deleteTrainRegister = async (deletedData: ITrainRegister) => {
	const url = `${API_ENDPOINT}/api/TrainRegisters`;
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
