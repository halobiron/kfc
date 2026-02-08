import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const useGeoLocation = () => {
    const [location, setLocation] = useState(null); // { lat, lng }
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getCurrentLocation = useCallback(() => {
        setIsLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            const errorMsg = "Trình duyệt không hỗ trợ Geolocation.";
            setError(errorMsg);
            toast.error(errorMsg);
            setIsLoading(false);
            return Promise.reject(errorMsg);
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setLocation(coords);
                    setIsLoading(false);
                    resolve(coords);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    let errorMsg = "Không thể lấy vị trí của bạn.";
                    if (err.code === err.PERMISSION_DENIED) {
                        errorMsg = "Bạn đã từ chối quyền truy cập vị trí.";
                    }
                    setError(errorMsg);
                    toast.error(errorMsg);
                    setIsLoading(false);
                    reject(errorMsg);
                }
            );
        });
    }, []);

    return { location, error, isLoading, getCurrentLocation };
};

export default useGeoLocation;
