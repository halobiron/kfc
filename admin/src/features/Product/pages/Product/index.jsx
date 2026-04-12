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
import { formatCurrency, normalizeVietnamese } from '../../../../utils/formatters';

const Product = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, productsCount, resPerPage, currentPage, loading } = useSelector(state => state.products)
  const { keyword } = useSelector(state => state.search);

  const [showModal, setShowModal] = useState(false)
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllProducts({ page, limit: 10 }));
    dispatch(getAllCategories());
  }, [dispatch, page])

  const filteredProducts = products.filter(product => {
    const searchLower = normalizeVietnamese((keyword || '').toLowerCase());
    const title = normalizeVietnamese(product.title?.toLowerCase() || '');
    return title.includes(searchLower);
  });

  const totalPages = Math.ceil((productsCount || 0) / (resPerPage || 10));

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
          loading={loading}
          pagination={{
            currentPage: currentPage || page,
            totalPages: totalPages,
            onPageChange: (newPage) => setPage(newPage)
          }}
        />
      </div>
      {showModal ? <AddModal setShowModal={setShowModal} /> : null}
    </>
  )
}

export default Product
