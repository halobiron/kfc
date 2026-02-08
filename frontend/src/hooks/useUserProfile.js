import { useState, useEffect, useCallback } from 'react';
import userApi from '../api/userApi';

/**
 * Hook to fetch and manage user profile data
 * Returns profile data, addresses, loading state, error, and refetch function
 */
const useUserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await userApi.getProfile();

            if (response.data?.status && response.data?.data) {
                const userData = response.data.data;
                setProfile(userData);
                setAddresses(userData.addresses || []);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể tải thông tin người dùng');
            setProfile(null);
            setAddresses([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        addresses,
        isLoading,
        error,
        refetch: fetchProfile
    };
};

export default useUserProfile;
