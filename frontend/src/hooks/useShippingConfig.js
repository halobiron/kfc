import { useState, useEffect } from 'react';
import orderApi from '../api/orderApi';
import { DEFAULT_SHIPPING_CONFIG } from '../utils/shipping';

/**
 * Hook to fetch shipping configuration
 * Returns config, loading state, and error
 */
const useShippingConfig = () => {
    const [config, setConfig] = useState(DEFAULT_SHIPPING_CONFIG);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await orderApi.getShippingConfig();

                if (response.data?.status && response.data?.data) {
                    setConfig(response.data.data);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể tải cấu hình phí ship');
                // Keep default config on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchConfig();
    }, []);

    return {
        config,
        isLoading,
        error
    };
};

export default useShippingConfig;
