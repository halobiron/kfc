import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addNewProduct } from '../../features/Product/productSlice';
import { useSelector, useDispatch } from 'react-redux';

const AddModal = ({ setShowModal }) => {

  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.categories);

  const [preview, setPreview] = useState('');

  const { handleChange, handleSubmit, handleblur, values, touched, errors, setFieldValue } = useFormik({
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
          <div class="col-md-6">
            <label for="title" class="form-label">Tên món</label>
            <input type="text" name='title' onChange={handleChange} onBlur={handleblur} value={values.title} class="form-control" id="title" placeholder="Nhập tên món ăn..." />
            {touched.title && errors.title && <div className="text-danger small">{errors.title}</div>}
          </div>
          <div class="col-md-6">
            <label for="category" class="form-label">Danh mục</label>
            <select name="category" onChange={handleChange} onBlur={handleblur} value={values.category} class="form-select" id="category">
              {categories && categories.map(cat => (
                <option key={cat._id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            {touched.category && errors.category && <div className="text-danger small">{errors.category}</div>}
          </div>
          <div class="col-12">
            <label for="description" class="form-label">Mô tả</label>
            <input type="text" name='description' onChange={handleChange} onBlur={handleblur} value={values.description} class="form-control" id="description" placeholder="Mô tả ngắn gọn về món ăn..." />
            {touched.description && errors.description && <div className="text-danger small">{errors.description}</div>}
          </div>
          <div class="col-md-6">
            <label for="price" class="form-label">Giá bán (VNĐ)</label>
            <input type="number" name='price' onChange={handleChange} onBlur={handleblur} value={values.price} class="form-control" id="price" placeholder="Ví dụ: 50000" />
            {touched.price && errors.price && <div className="text-danger small">{errors.price}</div>}
          </div>
          <div class="col-md-6">
            <label for="stock" class="form-label">Số lượng tồn kho</label>
            <input type="number" name='stock' onChange={handleChange} onBlur={handleblur} value={values.stock} class="form-control" id="stock" placeholder="Nhập số lượng..." />
            {touched.stock && errors.stock && <div className="text-danger small">{errors.stock}</div>}
          </div>
          <div class="col-12">
            <label for="image" class="form-label">Tải lên hình ảnh</label>
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
              onBlur={handleblur}
              value={values.image}
              class="form-control"
              id="image" />
          </div>
          <img src={preview} style={{ width: '200px' }} alt="" />
          <div class="col-12 mt-4">
            <button type="submit" class="btn btn-primary px-4">Lưu sản phẩm</button>
            <button type="button" class="btn btn-outline-secondary ms-3 px-4" onClick={() => setShowModal(false)}>Hủy bỏ</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddModal