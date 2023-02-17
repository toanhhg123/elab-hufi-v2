import config from '../configs/app';
import * as API from '../configs/apiHelper';
import { ILessonLabType } from '../types/lessonLabType';

const { isProd } = config;
const API_ENDPOINT = process.env.REACT_APP_DEVELOPMENT_API_ENDPOINT;

// isProd
//   ? config.production.api_endpoint
//   : config.development.api_endpoint;

// define type params: APIRequestParams

export const getLessonLabs = async () => {
	const url = `${API_ENDPOINT}/api/lessonLabs`;
	const lessonLabs: ILessonLabType[] = await API.get<ILessonLabType[]>(url);
	return lessonLabs;
};

export const getLessonLabById = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/lessonLabs/${id}`;
	const lab: ILessonLabType = await API.get<ILessonLabType>(url);
	return lab;
};

export const updateLessonLab = async (updatedData: ILessonLabType) => {
	const url = `${API_ENDPOINT}/api/lessonLabs/${updatedData?.LessonId}`;
	const lab: ILessonLabType = await API.put<ILessonLabType, ILessonLabType>(url, updatedData);
	return lab;
};

export const deleteLessonLab = async (id: Number) => {
	const url = `${API_ENDPOINT}/api/lessonLabs/${id}`;
	await API.deleteResource(url);
};

export const postLessonLab = async (newLabData: ILessonLabType) => {
	const url = `${API_ENDPOINT}/api/lessonLabs`;
	const newLab = await API.post<ILessonLabType, ILessonLabType>(url, newLabData);
	return newLab;
};
