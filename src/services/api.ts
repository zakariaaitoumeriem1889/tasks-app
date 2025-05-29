import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:5000',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json'
	}
});

api.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error('Api error', error);
		return Promise.reject(error);
	}
);

export default api;
