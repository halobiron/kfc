import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import useGeoLocation from './useGeoLocation';
import mapApi from '../api/mapApi';

const useAddressSelection = (savedAddresses = []) => {
    const { getCurrentLocation, isLoading: isGettingCurrentLocation } = useGeoLocation();
    const [selectedLocation, setSelectedLocation] = useState(null); // { lat, lng, address, type: 'current' | 'saved', id }
    const [isResolving, setIsResolving] = useState(false);

    // Standardized Options for CustomSelect
    const options = useMemo(() => [
        { value: 'current', label: 'Vị trí hiện tại (GPS)', icon: 'bi bi-crosshair text-danger' },
        ...(savedAddresses.length > 0 ? [
            {
                label: 'Từ địa chỉ đã lưu',
                options: savedAddresses.map((addr, idx) => ({
                    value: `saved-${idx}`,
                    label: `${addr.label} - ${addr.fullAddress}`,
                    icon: 'bi bi-house'
                }))
            }
        ] : [])
    ], [savedAddresses]);

    const handleSelect = async (value) => {
        setIsResolving(true);
        setSelectedLocation(null);

        try {
            let locationData = null;

            if (value === 'current') {
                const coords = await getCurrentLocation();
                if (coords) {
                    locationData = { ...coords, type: 'current', address: 'Vị trí hiện tại' };
                }
            } 
            else if (typeof value === 'string' && value.startsWith('saved-')) {
                const index = parseInt(value.split('-')[1]);
                const saved = savedAddresses[index];
                
                if (saved) {
                    let { latitude: lat, longitude: lng } = saved;

                    // Auto-fill missing coordinates
                    if (!lat || !lng) {
                        toast.info("Đang tìm tọa độ cho địa chỉ này...");
                        const geoData = await mapApi.geocodeAddress(saved.fullAddress);
                        
                        if (!geoData) throw new Error("Không tìm thấy tọa độ của địa chỉ này.");
                        
                        lat = geoData.lat;
                        lng = geoData.lng;
                    }

                    locationData = {
                        lat,
                        lng,
                        type: 'saved',
                        id: saved._id || index,
                        address: saved.fullAddress
                    };
                }
            }

            if (locationData) {
                setSelectedLocation(locationData);
                return locationData;
            }

        } catch (error) {
            console.error("Address selection error:", error);
            toast.error(error.message || "Có lỗi xảy ra khi chọn địa chỉ.");
        } finally {
            setIsResolving(false);
        }
        return null;
    };

    return {
        options,
        selectedLocation,
        handleSelect,
        isLoading: isResolving || isGettingCurrentLocation
    };
};

export default useAddressSelection;
