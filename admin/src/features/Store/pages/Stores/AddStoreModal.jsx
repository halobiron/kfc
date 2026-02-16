import React, { useEffect } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createStore, updateStore } from '../../storeSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '../../../../components/Common/Button';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Leaflet marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const AddStoreModal = ({ setShowModal, initialStore }) => {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: { name: '', address: '', phone: '', openTime: '08:00', closeTime: '22:00', lat: '', lng: '' },
        validationSchema: Yup.object({
            name: Yup.string().required('Bắt buộc'),
            address: Yup.string().required('Bắt buộc'),
            phone: Yup.string().required('Bắt buộc'),
            openTime: Yup.string().required('Bắt buộc'),
            closeTime: Yup.string().required('Bắt buộc')
        }),
        onSubmit: async (v) => {
            try {
                const data = { ...v, latitude: v.lat, longitude: v.lng };
                initialStore ? await dispatch(updateStore({ id: initialStore._id, data })).unwrap() : await dispatch(createStore(data)).unwrap();
                toast.success('Thành công'); setShowModal(false);
            } catch (err) { toast.error('Lỗi'); }
        }
    });

    const { values, setFieldValue, setValues } = formik;

    useEffect(() => {
        if (initialStore) setValues({
            name: initialStore.name || '',
            address: initialStore.address || '',
            phone: initialStore.phone || '',
            openTime: initialStore.openTime || '08:00',
            closeTime: initialStore.closeTime || '22:00',
            lat: initialStore.latitude || '',
            lng: initialStore.longitude || ''
        });
    }, [initialStore, setValues]);

    const findCoords = async () => {
        if (!values.address) return toast.warning('Nhập địa chỉ');
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(values.address)}&countrycodes=vn`);
        const data = await res.json();
        if (data?.[0]) {
            setFieldValue('lat', data[0].lat); setFieldValue('lng', data[0].lon);
            toast.success('Đã cập nhật bản đồ');
        } else toast.error('Không tìm thấy');
    };

    const MapEvents = () => {
        const map = useMap();
        useEffect(() => { if (values.lat && values.lng) map.setView([values.lat, values.lng], 15); }, [values.lat, values.lng, map]);
        useMapEvents({
            click: async (e) => {
                setFieldValue('lat', e.latlng.lat.toFixed(6)); setFieldValue('lng', e.latlng.lng.toFixed(6));
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
                const data = await res.json();
                if (data?.display_name) setFieldValue('address', data.display_name);
            }
        });
        return values.lat ? <Marker position={[values.lat, values.lng]} /> : null;
    };

    return (
        <div className="modal-overlay-wrapper">
            <div className="modal-overlay-inner modal-overlay-inner-wide p-4">
                <h4 className="mb-3 text-center">{initialStore ? 'Cập Nhật' : 'Thêm Mới'}</h4>
                <form className="row g-3" onSubmit={formik.handleSubmit}>
                    <div className="col-8"><label className="form-label">Tên</label><input className="form-control" name="name" onChange={formik.handleChange} value={values.name} /></div>
                    <div className="col-4"><label className="form-label">SĐT</label><input className="form-control" name="phone" onChange={formik.handleChange} value={values.phone} /></div>
                    <div className="col-6">
                        <label className="form-label">Giờ mở cửa</label>
                        <input type="time" className="form-control" name="openTime" onChange={formik.handleChange} value={values.openTime} />
                    </div>
                    <div className="col-6">
                        <label className="form-label">Giờ đóng cửa</label>
                        <input type="time" className="form-control" name="closeTime" onChange={formik.handleChange} value={values.closeTime} />
                    </div>

                    <div className="col-12"><label className="form-label fw-bold">Bản đồ (Click chọn vị trí)</label>
                        <div style={{ height: '230px', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' }}>
                            <MapContainer center={[values.lat || 10.7, values.lng || 106.6]} zoom={13} style={{ height: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><MapEvents />
                            </MapContainer>
                        </div>
                    </div>

                    <div className="col-12"><label className="form-label">Địa chỉ</label>
                        <div className="input-group">
                            <input className="form-control" name="address" onChange={formik.handleChange} value={values.address} />
                            <button className="btn btn-dark" type="button" onClick={findCoords}>Tìm vị trí</button>
                        </div>
                    </div>

                    <div className="col-6"><label className="form-label">Vĩ độ</label><input className="form-control" type="number" name="lat" onChange={formik.handleChange} value={values.lat} /></div>
                    <div className="col-6"><label className="form-label">Kinh độ</label><input className="form-control" type="number" name="lng" onChange={formik.handleChange} value={values.lng} /></div>

                    <div className="col-12 text-end mt-4">
                        <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>Hủy</Button>
                        <Button type="submit" variant="primary">Lưu</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default AddStoreModal;
