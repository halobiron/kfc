import axiosClient from './axiosClient';

const orderApi = {
    createOrder: (orderData) => {
        const url = '/order/new';
        return axiosClient.post(url, orderData);
    },
    getShippingConfig: () => {
        const url = '/config/shipping';
        return axiosClient.get(url);
    },
    lookupOrder: (data) => {
        const url = '/order/lookup';
        return axiosClient.post(url, data);
    },
    getOrderById: (orderId, verifyPayment = false) => {
        const url = `/order/${orderId}${verifyPayment ? '/verify-payment' : ''}`;
        return axiosClient.get(url);
    },
    getMyOrders: () => {
        const url = '/user/orders';
        return axiosClient.get(url);
    },
    cancelOrder: (orderId, data) => {
        const url = `/order/${orderId}/cancel`;
        return axiosClient.post(url, data);
    }
};

export default orderApi;
