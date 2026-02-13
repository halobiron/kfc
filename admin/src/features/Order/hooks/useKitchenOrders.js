import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import orderApi from '../../../api/orderApi';

const useKitchenOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const getErrorMessage = (error, fallback) => {
        return error?.response?.data?.message || error?.message || fallback;
    };
    
    const fetchOrders = useCallback(async () => {
        try {
            const data = await orderApi.getAll();
            setOrders(data.data || []);
        } catch (error) {
            console.error('Lỗi khi tải đơn hàng:', error);
            toast.error(getErrorMessage(error, 'Không thể tải danh sách đơn hàng.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
        // Refresh every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    const handleStatusChange = useCallback(async (orderId, newStatus) => {
        try {
            setOrders(prevOrders => 
                prevOrders.map(o => 
                    o._id === orderId ? { ...o, status: newStatus } : o
                )
            );

            await orderApi.updateStatus(orderId, { status: newStatus });
            toast.success('Cập nhật trạng thái thành công');
            fetchOrders(); 
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
            toast.error(getErrorMessage(error, 'Không thể cập nhật trạng thái'));
            fetchOrders(); // Revert lại nếu lỗi
        }
    }, [fetchOrders]);

    const getOrdersByStatus = useCallback((status) => {
        return orders.filter(order => order.status === status);
    }, [orders]);

    return {
        orders,
        loading,
        refreshOrders: fetchOrders,
        handleStatusChange,
        getOrdersByStatus
    };
};

export default useKitchenOrders;
