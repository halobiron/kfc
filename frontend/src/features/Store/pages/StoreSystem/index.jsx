import React, { useState, useEffect } from 'react';
import storeApi from '../../../../api/storeApi';
import Button from '../../../../components/Button';
import CustomSelect from '../../../../components/CustomSelect';
import { getStoresWithDistance, geocodeAddress } from '../../../../utils/geoUtils';
import useUserProfile from '../../../../hooks/useUserProfile';
import useAddressSelection from '../../../../hooks/useAddressSelection';
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

const createKfcIcon = (isActive, index) => L.divIcon({
    className: 'custom-kfc-marker',
    html: `<div class="kfc-sprite custom-kfc-marker-inner ${isActive ? 'active' : ''}">
            ${!isActive ? `<span class="marker-number">${index}</span>` : ''}
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

    // Use custom hook for user profile
    const { addresses: savedAddresses } = useUserProfile();

    // Use custom hook for address selection
    const {
        options: addressOptions,
        handleSelect: resolveLocation,
        isLoading: isResolvingAddress
    } = useAddressSelection(savedAddresses);

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

        fetchStores();
    }, []);

    const handleLocationSelect = async (val) => {
        const location = await resolveLocation(val);

        if (location) {
            setUserLocation({ lat: location.lat, lng: location.lng });
            setMapCenter({ lat: location.lat, lng: location.lng });
            setSelectedCity('all');
            setSearchTerm(location.address || '');
            setLocationError(null);
        }
    };

    const handleSearch = async (e) => {
        if (e.key !== 'Enter' && e.type !== 'click') return;
        e.preventDefault();

        if (!searchTerm.trim()) return;

        setIsSearching(true);
        setLocationError(null);

        try {
            const geo = await geocodeAddress(searchTerm);

            if (geo) {
                setUserLocation({ lat: geo.lat, lng: geo.lng });
                setMapCenter({ lat: geo.lat, lng: geo.lng });
                setSelectedCity('all');
                setSearchTerm(geo.displayName || searchTerm);
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
        let results = getStoresWithDistance(userLocation?.lat, userLocation?.lng, stores);

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
                    <h3>HỆ THỐNG NHÀ HÀNG</h3>

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
                            {isSearching || isResolvingAddress ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            ) : (
                                <i className="bi bi-search"></i>
                            )}
                        </button>
                    </div>

                    <div className="search-hint">
                        <i className="bi bi-info-circle me-1"></i>
                        Nhấn Enter hoặc nút tìm kiếm để tìm cửa hàng quanh đây
                    </div>

                    <div className="filter-wrapper mb-3">
                        <CustomSelect
                            options={[
                                { value: 'all', label: 'Tất cả khu vực' },
                                ...addressOptions,
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
                                if (val === 'all') {
                                    setSelectedCity('all');
                                } else if (val === 'current' || val.startsWith('saved-')) {
                                    handleLocationSelect(val);
                                } else {
                                    setSelectedCity(val);
                                }
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
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h4 className="store-item-name">{store.name}</h4>
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
                                            <div className="service-tags">
                                                {store.services.map((s, idx) => (
                                                    <span key={idx} className="service-tag">{SERVICE_MAP[s] || s}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="detail-actions">
                                            <Button variant="secondary" fullWidth>XEM CHỈ ĐƯỜNG</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {sortedStores.length === 0 && (
                            <div className="no-results">
                                <i className="bi bi-search no-results-icon"></i>
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
                    className="map-container-full"
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
