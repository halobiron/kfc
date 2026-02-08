import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import useGeoLocation from './useGeoLocation';
import { geocodeAddress } from '../utils/geoUtils';

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

    /**
     * Handles selection from the dropdown.
     * Returns a promise that resolves to the location object { lat, lng, ... } or null if failed.
     */
    const handleSelect = async (value) => {
        setIsResolving(true);
        setSelectedLocation(null);

        try {
            if (value === 'current') {
                const coords = await getCurrentLocation(); // Should handle errors/toasts internally
                const locationData = {
                    ...coords,
                    type: 'current',
                    address: 'Vị trí hiện tại'
                };
                setSelectedLocation(locationData);
                return locationData;
            }
            else if (typeof value === 'string' && value.startsWith('saved-')) {
                const index = parseInt(value.split('-')[1]);
                const saved = savedAddresses[index];

                if (!saved) {
                    setIsResolving(false);
                    return null;
                }

                let lat = saved.latitude;
                let lng = saved.longitude;

                // Check if coords exist, if not, fallback to geocoding
                if (!lat || !lng) {
                    toast.info("Đang tìm tọa độ cho địa chỉ này...");
                    const geoData = await geocodeAddress(saved.fullAddress);

                    if (geoData) {
                        lat = geoData.lat;
                        lng = geoData.lng;
                    } else {
                        toast.error("Không tìm thấy tọa độ của địa chỉ này.");
                        setIsResolving(false);
                        return null;
                    }
                }

                const locationData = {
                    lat,
                    lng,
                    type: 'saved',
                    id: saved._id || index,
                    address: saved.fullAddress
                };
                setSelectedLocation(locationData);
                return locationData;
            }
        } catch (error) {
            console.error("Address selection error:", error);
            // Error usually handled by sub-functions (getCurrentLocation) or UI
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
