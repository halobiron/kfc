import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getAllProducts, deleteProduct } from '../../productSlice'
import { getAllCategories } from '../../../Category/categorySlice'
import AddModal from './AddModal';
import Badge from '../../../../components/Common/Badge';
import Table from '../../../../components/Common/Table';
import './Product.css';
import { AddButton, EditButton, DeleteButton } from '../../../../components/Common/Button';
import { formatCurrency } from '../../../../utils/formatters';

const Product = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products } = useSelector(state => state.products)
  const { keyword } = useSelector(state => state.search);

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCategories());
  }, [dispatch])

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes((keyword || '').toLowerCase())
  );

  const columns = [
    {
      header: '#',
      className: 'ps-4',
      render: (_, i) => <span className="fw-bold">PRD{1000 + i + 1}</span>
    },
    {
      header: 'Tên món',
      render: (product) => (
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
      )
    },
    {
      header: 'Mô tả',
      className: 'text-muted small product-description-cell',
      key: 'description'
    },
    {
      header: 'Giá bán',
      className: 'text-end fw-bold text-danger',
      render: (product) => formatCurrency(product.price)
    },
    {
      header: 'Tồn kho',
      className: 'text-center',
      render: (product) => (
        <Badge variant={product.stock > 10 ? 'success' : 'warning'}>
          {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'} ({product.stock})
        </Badge>
      )
    },
    {
      header: 'Thao tác',
      className: 'text-end pe-4',
      render: (product) => (
        <>
          <EditButton
            onClick={() => navigate(`/products/${product._id}`)}
            className="me-2"
          />
          <DeleteButton
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn xóa món này?')) {
                dispatch(deleteProduct(product._id));
              }
            }}
          />
        </>
      )
    }
  ];

  return (
    <>
      <div className="page-header d-flex justify-content-between align-items-center">
        <h1 className="page-title">Quản lý Món ăn</h1>
        <AddButton onClick={() => setShowModal(true)} />
      </div>

      <div className="card">
          <div className="card-header">Danh sách món ăn</div>
          <Table 
            columns={columns}
            data={filteredProducts}
          />
        </div>
      {showModal ? <AddModal setShowModal={setShowModal} /> : null}
    </>
  )
}

export default Product
