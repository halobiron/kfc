import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:9000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for API calls
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;
