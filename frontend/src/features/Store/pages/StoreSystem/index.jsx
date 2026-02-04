import React, { useState, useEffect } from 'react';
import storeApi from '../../../../api/storeApi';
import axiosClient from '../../../../api/axiosClient';
import CustomSelect from '../../../../components/CustomSelect';
import './StoreSystem.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Constants
const CITIES = [
    { id: 'all', name: 'Tất cả thành phố' },
    { id: 'hcm', name: 'TP. Hồ Chí Minh' },
    { id: 'hn', name: 'Hà Nội' },
    { id: 'dn', name: 'Đà Nẵng' },
    { id: 'hp', name: 'Hải Phòng' },
    { id: 'ct', name: 'Cần Thơ' },
];

const SERVICE_MAP = {
    'dine-in': 'Tại chỗ',
    'takeaway': 'Mang đi',
    'delivery': 'Giao hàng',
    'drive-through': 'Drive-thru',
    'wifi': 'Wifi',
    'kids': 'Khu vui chơi trẻ em'
};

// Helpers
const deg2rad = (deg) => deg * (Math.PI / 180);

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const createKfcIcon = (isActive, index) => L.divIcon({
    className: 'custom-kfc-marker',
    html: `<div class="kfc-sprite" style="
            width: 50px;
            height: 65px;
            background-position: ${isActive ? '-120px -50px' : '-70px -50px'};
            transform: scale(1.1);
            transform-origin: bottom center;
            position: relative;
        ">
            ${!isActive ? `<span style="
                color: #fff;
                font-weight: bold;
                font-size: 14px;
                position: absolute;
                top: 10px;
                left: 10px;
                font-family: Arial, sans-serif;
            ">${index}</span>` : ''}
        </div>`,
    iconSize: [50, 65],
    iconAnchor: [25, 65],
    popupAnchor: [0, -65]
});

const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) map.flyTo([center.lat, center.lng], 15);
    }, [center, map]);
    return null;
};

const StoreSystem = () => {
    const [stores, setStores] = useState([]);
    const [selectedCity, setSelectedCity] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedStore, setExpandedStore] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [sortedStores, setSortedStores] = useState([]);
    const [locationError, setLocationError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [mapCenter, setMapCenter] = useState({ lat: 10.7718, lng: 106.6015 }); // Default HCM
    const [savedAddresses, setSavedAddresses] = useState([]);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const { data } = await storeApi.getAll();
                if (data?.status) {
                    setStores(data.data.map(store => ({
                        ...store,
                        id: store._id,
                        location: { lat: store.latitude, lng: store.longitude }
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch stores", error);
            }
        };

        const fetchSavedAddresses = async () => {
            try {
                const response = await axiosClient.get('/users/profile');
                if (response.data?.status) {
                    setSavedAddresses(response.data.data.addresses || []);
                }
            } catch (error) {
                // Ignore if not logged in
            }
        };

        fetchStores();
        fetchSavedAddresses();
    }, []);

    const handleFindNearest = () => {
        if (!navigator.geolocation) {
            setLocationError("Trình duyệt không hỗ trợ Geolocation.");
            return;
        }

        setIsSearching(true);
        setLocationError(null);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                setUserLocation({ lat, lng });
                setMapCenter({ lat, lng });
                setSelectedCity('all'); // Show all stores to find nearest across data
                setSearchTerm('');

                // Reverse Geocoding to show address
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
                    const data = await response.json();
                    if (data && data.display_name) {
                        setSearchTerm(data.display_name); // Fill search box with address
                    }
                } catch (err) {
                    console.error("Reverse geocoding error", err);
                } finally {
                    setIsSearching(false);
                }
            },
            (err) => {
                console.error("Error getting location:", err);
                setLocationError("Không thể lấy vị trí của bạn.");
                setIsSearching(false);
            }
        );
    };

    const handleFindFromSaved = async (index) => {
        if (index === 'current') {
            handleFindNearest();
            return;
        }

        const selected = savedAddresses[index];
        if (!selected) return;

        setIsSearching(true);
        let lat, lng;

        try {
            if (selected.latitude && selected.longitude) {
                lat = selected.latitude;
                lng = selected.longitude;
            } else {
                // Fallback fetch if no coords
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(selected.fullAddress)}&countrycodes=vn&limit=1`);
                const data = await res.json();
                if (data?.length > 0) {
                    lat = parseFloat(data[0].lat);
                    lng = parseFloat(data[0].lon);
                }
            }

            if (lat && lng) {
                setUserLocation({ lat, lng });
                setMapCenter({ lat, lng });
                setSelectedCity('all');
                setSearchTerm(selected.fullAddress);
            } else {
                setLocationError("Không tìm thấy tọa độ địa chỉ này.");
            }
        } catch (e) {
            setLocationError("Lỗi khi tìm vị trí.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = async (e) => {
        if (e.key !== 'Enter' && e.type !== 'click') return;

        e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsSearching(true);
        setLocationError(null);

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&countrycodes=vn&limit=1`);
            const data = await res.json();

            if (data?.length > 0) {
                const { lat, lon } = data[0];
                const location = { lat: parseFloat(lat), lng: parseFloat(lon) };
                setUserLocation(location);
                setMapCenter(location);
                setSelectedCity('all');
            } else {
                setLocationError("Không tìm thấy địa chỉ này.");
                setUserLocation(null);
            }
        } catch (error) {
            console.error("Search error:", error);
            setLocationError("Lỗi kết nối tìm kiếm.");
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        let results = stores.map(store => ({
            ...store,
            distance: userLocation ? calculateDistance(
                userLocation.lat, userLocation.lng,
                store.location.lat, store.location.lng
            ) : null
        }));

        if (selectedCity !== 'all') {
            results = results.filter(s => s.city === selectedCity);
        }

        if (!userLocation && searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(s =>
                s.name.toLowerCase().includes(term) ||
                s.address.toLowerCase().includes(term)
            );
        }

        if (userLocation) {
            results.sort((a, b) => a.distance - b.distance);
        }

        setSortedStores(results);
    }, [userLocation, selectedCity, searchTerm, stores]);


    const toggleStore = (id) => {
        if (expandedStore === id) {
            setExpandedStore(null);
        } else {
            setExpandedStore(id);
            const store = stores.find(s => s.id === id);
            if (store && store.location) {
                setMapCenter(store.location);
            }
        }
    };

    return (
        <div className="store-system-container">
            {/* Sidebar */}
            <div className="store-sidebar">
                <div className="sidebar-header">
                    <h2 className="sidebar-title">HỆ THỐNG NHÀ HÀNG</h2>

                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Tìm theo địa chỉ, quận tên nhà hàng..."
                            className="store-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        <button
                            className="search-btn-trigger"
                            onClick={handleSearch}
                            disabled={isSearching}
                            title="Tìm kiếm vị trí"
                        >
                            {isSearching ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                <i className="bi bi-search"></i>
                            )}
                        </button>
                    </div>

                    <div className="search-hint">
                        <i className="bi bi-info-circle me-1"></i>
                        Nhấn Enter hoặc nút tìm kiếm để xem cửa hàng gần bạn nhất
                    </div>

                    <div className="filter-wrapper mb-3">
                        <CustomSelect
                            options={[
                                { value: 'all', label: 'Tất cả khu vực' },
                                {
                                    label: 'Tìm quanh vị trí',
                                    options: [
                                        { value: 'current', label: 'Vị trí hiện tại (GPS)' },
                                        ...savedAddresses.map((addr, idx) => ({
                                            value: `saved_${idx}`,
                                            label: `${addr.label} - ${addr.fullAddress}`
                                        }))
                                    ]
                                },
                                {
                                    label: 'Lọc theo Thành phố',
                                    options: CITIES.filter(c => c.id !== 'all').map(city => ({
                                        value: city.id,
                                        label: city.name
                                    }))
                                }
                            ]}
                            value={selectedCity}
                            onChange={(val) => {
                                if (val === 'all') setSelectedCity('all');
                                else if (val === 'current') handleFindNearest();
                                else if (val.startsWith('saved_')) handleFindFromSaved(parseInt(val.split('_')[1]));
                                else setSelectedCity(val);
                            }}
                            placeholder="Chọn khu vực"
                            icon="bi bi-geo-alt"
                        />
                    </div>

                    {locationError && <div className="text-danger small mb-2 text-end">{locationError}</div>}
                </div>

                <div className="store-list-container">
                    <div className="results-count">
                        Có <strong>{sortedStores.length}</strong> cửa hàng phù hợp
                    </div>

                    <div className="store-items">
                        {sortedStores.map((store, index) => (
                            <div
                                key={store.id}
                                className={`store-item-card ${expandedStore === store.id ? 'expanded' : ''}`}
                                onClick={() => toggleStore(store.id)}
                            >
                                <div className="store-item-main">
                                    <div className="store-index-popcorn kfc-sprite">
                                        {index + 1}
                                    </div>
                                    <div className="store-item-info">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <h3 className="store-item-name">{store.name}</h3>
                                            {store.distance !== null && (
                                                <span className="store-distance badge bg-light text-dark border">
                                                    {store.distance.toFixed(1)} km
                                                </span>
                                            )}
                                        </div>
                                        <p className="store-item-address">{store.address}</p>
                                    </div>
                                    <div className="expand-icon">
                                        <i className={`bi bi-chevron-${expandedStore === store.id ? 'up' : 'down'}`}></i>
                                    </div>
                                </div>

                                {expandedStore === store.id && (
                                    <div className="store-item-details" onClick={(e) => e.stopPropagation()}>
                                        <div className="detail-section">
                                            <h6><i className="bi bi-clock me-2"></i>Giờ hoạt động</h6>
                                            <p>{store.openTime}</p>
                                        </div>
                                        <div className="detail-section">
                                            <h6><i className="bi bi-telephone me-2"></i>Điện thoại</h6>
                                            <p>{store.phone}</p>
                                        </div>
                                        <div className="detail-section">
                                            <h6><i className="bi bi-gear me-2"></i>Dịch vụ</h6>
                                            <div className="service-icons">
                                                {store.services.map((s, idx) => (
                                                    <span key={idx} className="service-tag">{SERVICE_MAP[s] || s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="detail-actions">
                                            <button className="btn btn-outline-secondary w-100">XEM CHỈ ĐƯỜNG</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {sortedStores.length === 0 && (
                            <div className="no-results">
                                <i className="bi bi-search" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
                                <p>Không tìm thấy cửa hàng nào</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Map View */}
            <div className="store-map-view">
                <MapContainer
                    center={[mapCenter.lat, mapCenter.lng]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapUpdater center={mapCenter} />

                    {/* User Location Marker */}
                    {userLocation && (
                        <Marker position={[userLocation.lat, userLocation.lng]}>
                            <Popup>Vị trí của bạn</Popup>
                        </Marker>
                    )}

                    {/* Store Markers */}
                    {sortedStores.map((store, index) => (
                        <Marker
                            key={store.id}
                            position={[store.location.lat, store.location.lng]}
                            icon={createKfcIcon(expandedStore === store.id, index + 1)}
                            eventHandlers={{
                                click: () => toggleStore(store.id),
                            }}
                        >
                            <Popup>
                                <strong>{store.name}</strong><br />
                                {store.address}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default StoreSystem;
