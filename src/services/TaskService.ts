import api from '@/services/api.ts';
import type { Task } from '@/types.ts';
import type { AxiosResponse } from 'axios';

interface ITaskService {
	getTasks(): Promise<Task[]>;

	createTask(data: Task): Promise<Task>;

	updateTask(id: string, data: Partial<Task>): Promise<Task>;

	deleteTask(id: string): Promise<void>;

	toggleTaskDone(id: string, done: boolean): Promise<Task>;
}

export const TaskService: ITaskService = {
	async getTasks(): Promise<Task[]> {
		try {
			const response: AxiosResponse<Task[]> = await api.get<Task[]>('/tasks');
			return response.data;
		} catch (e) {
			console.error('Fetching tasks failed', e);
			throw e;
		}
	},
	async createTask(data: Task): Promise<Task> {
		try {
			const response: AxiosResponse<Task> = await api.post<Task>('/tasks', data);
			return response.data;
		} catch (e) {
			console.error('Create Task failed', e);
			throw e;
		}
	},
	async updateTask(id: string, data: Partial<Task>): Promise<Task> {
		try {
			const response: AxiosResponse<Task> = await api.put<Task>(`/tasks/${id}`, data);
			return response.data;
		} catch (e) {
			console.error('Update Task failed', e);
			throw e;
		}
	},
	async deleteTask(id: string): Promise<void> {
		try {
			await api.delete<Task>(`/tasks/${id}`);
		} catch (e) {
			console.error('Delete Task failed', e);
			throw e;
		}
	},
	async toggleTaskDone(id: string, done: boolean): Promise<Task> {
		try {
			const response: AxiosResponse<Task> = await api.patch<Task>(`/tasks/${id}`, { done });
			return response.data;
		} catch (e) {
			console.error('Done Updated failed', e);
			throw e;
		}
	}
};
