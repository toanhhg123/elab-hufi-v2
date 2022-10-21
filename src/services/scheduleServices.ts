import config from "../configs/app"
import * as API from "../configs/apiHelper";
import { IScheduleType } from '../types/scheduleType';

const { isProd } = config;
const API_ENDPOINT = "https://www.aspsite.somee.com";

export const getSchedules = async () => {    
    const url = `${API_ENDPOINT}/api/schedules`;
	const subjects: IScheduleType[] = await API.get<IScheduleType[]>(url);
	return subjects;
}