import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:9000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptors
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        throw error;
    }
);

export default axiosClient;
