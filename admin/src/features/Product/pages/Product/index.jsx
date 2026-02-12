import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllProducts, deleteProduct } from '../../productSlice'
import { getAllCategories } from '../../../Category/categorySlice'
import AddModal from './AddModal';
import './Product.css';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

const Product = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector(state => state.products)

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCategories());
  }, [dispatch])

  return (
    <>
      <>
        <div className="page-header d-flex justify-content-between align-items-center">
          <h1 className="page-title">Quản lý Món ăn</h1>
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
            onClick={() => setShowModal(true)}
          >
            <FiPlus size={20} /> Thêm món mới
          </button>
        </div>

        <div className="card">
          <div className="card-header">Danh sách món ăn</div>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col" className="ps-4">#</th>
                  <th scope="col">Tên món</th>
                  <th scope="col">Mô tả</th>
                  <th scope="col" className="text-end">Giá bán</th>
                  <th scope="col" className="text-center">Tồn kho</th>
                  <th scope="col" className="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {
                  products && Array.isArray(products) && products.map((product, i) => {
                    return (
                      <tr key={product._id}>
                        <td className="ps-4 fw-bold">PRD{1000 + i + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className="product-img-wrapper">
                              <img
                                src={product.productImage || product.image}
                                alt={product.title}
                                className="product-thumbnail"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/50x50?text=KFC';
                                }}
                              />
                            </div>
                            <div className="fw-bold">{product.title}</div>
                          </div>
                        </td>
                        <td className="text-muted small" style={{ maxWidth: '300px' }}>{product.description}</td>
                        <td className="text-end fw-bold text-danger">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </td>
                        <td className="text-center">
                          <span className={`badge ${product.stock > 10 ? 'badge-success' : 'badge-warning'}`}>
                            {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'} ({product.stock})
                          </span>
                        </td>
                        <td className="text-end pe-4">
                          <button
                            className="btn-action btn-edit border-0 d-inline-flex align-items-center"
                            onClick={() => navigate(`/products/${product._id}`)}
                          >
                            <FiEdit2 style={{ marginRight: '4px' }} />
                            Sửa
                          </button>
                          <button className="btn-action btn-delete border-0 d-inline-flex align-items-center"
                            onClick={() => {
                              if (window.confirm('Bạn có chắc chắn muốn xóa món này?')) {
                                dispatch(deleteProduct(product._id));
                              }
                            }}
                          >
                            <FiTrash2 style={{ marginRight: '4px' }} />
                            Xóa
                          </button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </>
      {showModal ? <AddModal setShowModal={setShowModal} /> : null}
    </>
  )
}

export default Product