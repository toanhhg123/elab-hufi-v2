import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { IScheduleType } from '../types/scheduleType';

const { isProd } = config;
const API_ENDPOINT = isProd
	? config.production.api_endpoint
	: config.development.api_endpoint;

export const getSchedules = async () => {
	const role = JSON.parse(localStorage.getItem("user") || "");
	const url = `${API_ENDPOINT}/api/schedules/${role?.type.toString()}`;
	const schedules: IScheduleType[] | [] = await API.get<IScheduleType[]>(url);

	if (schedules.length > 0) {
		let formatedSchedules = schedules.map(x => {
			return {
				...x,
				DateStudy: Number((Number(x.DateStudy) / (24 * 60 * 60)).toFixed()) * (24 * 60 * 60),
			};
		});

		return formatedSchedules;
	} else return [];
};

export const autoSchedule = async (semester: string, schoolyear: string) => {
	const url = `${API_ENDPOINT}/api/schedules/reschedule/${semester}/${schoolyear}`;
	const res = await API.post<any, any>(url, {});
	return res;
};
