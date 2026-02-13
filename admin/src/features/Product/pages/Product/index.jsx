import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllProducts, deleteProduct } from '../../productSlice'
import { getAllCategories } from '../../../Category/categorySlice'
import AddModal from './AddModal';
import Badge from '../../../../components/Common/Badge';
import './Product.css';
import { AddButton, EditButton, DeleteButton } from '../../../../components/Common/Button';
import { formatCurrency } from '../../../../utils/formatters';

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
          <AddButton onClick={() => setShowModal(true)} />
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
                          {formatCurrency(product.price)}
                        </td>
                        <td className="text-center">
                          <Badge variant={product.stock > 10 ? 'success' : 'warning'}>
                            {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'} ({product.stock})
                          </Badge>
                        </td>
                        <td className="text-end pe-4">
                          <EditButton
                            onClick={() => navigate(`/products/${product._id}`)}
                          />
                          <DeleteButton
                            onClick={() => {
                              if (window.confirm('Bạn có chắc chắn muốn xóa món này?')) {
                                dispatch(deleteProduct(product._id));
                              }
                            }}
                          />
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
