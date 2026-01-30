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
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        // Handle errors
        throw error;
    }
);

export default axiosClient;
