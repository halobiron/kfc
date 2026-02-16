import React, { useEffect } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createStore, updateStore } from '../../storeSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Button from '../../../../components/Common/Button';

const AddStoreModal = ({ setShowModal, initialStore }) => {

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            name: '',
            address: '',
            phone: '',
            openTime: '',

            lat: '',
            lng: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Tên cửa hàng là bắt buộc'),
            address: Yup.string().required('Địa chỉ là bắt buộc'),
            phone: Yup.string().required('Số điện thoại là bắt buộc'),
            openTime: Yup.string().required('Giờ mở cửa là bắt buộc'),
        }),
        onSubmit: async (values) => {
            try {
                const submissionValues = {
                    ...values,

                    latitude: values.lat || undefined,
                    longitude: values.lng || undefined
                };

                delete submissionValues.lat;
                delete submissionValues.lng;

                if (initialStore) {
                    await dispatch(updateStore({ id: initialStore._id, data: submissionValues })).unwrap();
                    toast.success('Cập nhật cửa hàng thành công');
                } else {
                    await dispatch(createStore(submissionValues)).unwrap();
                    toast.success('Thêm cửa hàng thành công');
                }
                setShowModal(false);
            } catch (error) {
                toast.error(initialStore ? 'Có lỗi xảy ra khi cập nhật' : 'Có lỗi xảy ra khi thêm cửa hàng');
                console.error(error);
            }
        }
    });

    const { handleChange, handleSubmit, handleBlur, values, errors, touched, setValues } = formik;

    useEffect(() => {
        if (initialStore) {
            setValues({
                name: initialStore.name || '',
                address: initialStore.address || '',
                phone: initialStore.phone || '',
                openTime: initialStore.openTime || '',

                lat: initialStore.latitude || '',
                lng: initialStore.longitude || ''
            });
        }
    }, [initialStore, setValues]);

    return (
        <div className="modal-overlay-wrapper">
            <div className="modal-overlay-inner modal-overlay-inner-wide">
                <h3 className="mb-4 text-center">{initialStore ? 'Cập Nhật Cửa Hàng' : 'Thêm Cửa Hàng Mới'}</h3>
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-12">
                        <label htmlFor="name" className="form-label">Tên cửa hàng</label>
                        <input
                            type="text"
                            name='name'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                            id="name"
                        />
                        {touched.name && errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="col-12">
                        <label htmlFor="address" className="form-label">Địa chỉ</label>
                        <input
                            type="text"
                            name='address'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.address}
                            className={`form-control ${touched.address && errors.address ? 'is-invalid' : ''}`}
                            id="address"
                        />
                        {touched.address && errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="phone" className="form-label">Số điện thoại</label>
                        <input
                            type="text"
                            name='phone'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.phone}
                            className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
                            id="phone"
                        />
                        {touched.phone && errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="openTime" className="form-label">Giờ mở cửa</label>
                        <input
                            type="text"
                            name='openTime'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.openTime}
                            className={`form-control ${touched.openTime && errors.openTime ? 'is-invalid' : ''}`}
                            id="openTime"
                            placeholder="08:00 - 22:00"
                        />
                        {touched.openTime && errors.openTime && <div className="invalid-feedback">{errors.openTime}</div>}
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="lat" className="form-label">Vĩ độ (Latitude)</label>
                        <input
                            type="number"
                            name='lat'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.lat}
                            className="form-control"
                            id="lat"
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="lng" className="form-label">Kinh độ (Longitude)</label>
                        <input
                            type="number"
                            name='lng'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.lng}
                            className="form-control"
                            id="lng"
                        />
                    </div>

                    <div className="col-12 mt-4 text-end">
                        <Button variant="secondary" className="me-3" onClick={() => setShowModal(false)}>Hủy</Button>
                        <Button type="submit" variant="primary">{initialStore ? 'Cập nhật' : 'Lưu cửa hàng'}</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddStoreModal
