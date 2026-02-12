import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addNewProduct } from '../../productSlice';
import { useSelector, useDispatch } from 'react-redux';

const AddModal = ({ setShowModal }) => {

  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.categories);

  const [preview, setPreview] = useState('');

  const { handleChange, handleSubmit, handleBlur, values, touched, errors, setFieldValue } = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: '',
      stock: '',
      category: categories.length > 0 ? categories[0].slug : '',
      productImage: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Tên món không được để trống'),
      description: Yup.string().required('Mô tả không được để trống'),
      price: Yup.string().required('Giá bán không được để trống'),
      stock: Yup.string().required('Số lượng tồn kho không được để trống'),
      category: Yup.string().required('Danh mục không được để trống'),
    }),
    onSubmit: (values) => {
      dispatch(addNewProduct(values));
      setShowModal(false);
    }
  })

  return (
    <div className="modal-overlay-wrapper">
      <div className="modal-overlay-inner p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0 fw-bold">Thêm món ăn mới</h3>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="title" className="form-label">Tên món</label>
            <input type="text" name='title' onChange={handleChange} onBlur={handleBlur} value={values.title} className="form-control" id="title" placeholder="Nhập tên món ăn..." />
            {touched.title && errors.title && <div className="text-danger small">{errors.title}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="category" className="form-label">Danh mục</label>
            <select name="category" onChange={handleChange} onBlur={handleBlur} value={values.category} className="form-select" id="category">
              {categories && categories.map(cat => (
                <option key={cat._id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            {touched.category && errors.category && <div className="text-danger small">{errors.category}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="description" className="form-label">Mô tả</label>
            <input type="text" name='description' onChange={handleChange} onBlur={handleBlur} value={values.description} className="form-control" id="description" placeholder="Mô tả ngắn gọn về món ăn..." />
            {touched.description && errors.description && <div className="text-danger small">{errors.description}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="price" className="form-label">Giá bán (VNĐ)</label>
            <input type="number" name='price' onChange={handleChange} onBlur={handleBlur} value={values.price} className="form-control" id="price" placeholder="Ví dụ: 50000" />
            {touched.price && errors.price && <div className="text-danger small">{errors.price}</div>}
          </div>
          <div className="col-md-6">
            <label htmlFor="stock" className="form-label">Số lượng tồn kho</label>
            <input type="number" name='stock' onChange={handleChange} onBlur={handleBlur} value={values.stock} className="form-control" id="stock" placeholder="Nhập số lượng..." />
            {touched.stock && errors.stock && <div className="text-danger small">{errors.stock}</div>}
          </div>
          <div className="col-12">
            <label htmlFor="image" className="form-label">Tải lên hình ảnh</label>
            <input type="file"
              name='image'
              onChange={(event) => {
                let reader = new FileReader();
                reader.onload = () => {
                  if (reader.readyState === 2) {
                    setFieldValue('productImage', reader.result);
                    setPreview(reader.result)
                  }
                }
                reader.readAsDataURL(event.target.files[0])
              }}
              onBlur={handleBlur}
              className="form-control"
              id="image" />
          </div>
          <img src={preview} style={{ width: '200px' }} alt="" />
          <div className="col-12 mt-4">
            <button type="submit" className="btn btn-primary px-4">Lưu sản phẩm</button>
            <button type="button" className="btn btn-outline-secondary ms-3 px-4" onClick={() => setShowModal(false)}>Hủy bỏ</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddModal
