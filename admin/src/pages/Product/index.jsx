import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../../redux/actions/productActions'
import AddModal from './AddModal';
import './product.css';

const Product = () => {

  const dispatch = useDispatch();
  const { products } = useSelector(state => state.products)

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    dispatch(getAllProducts());
  }, [])

  return (
    <>
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
        <div className="page-header">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="page-title">Danh sách món ăn</h1>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              + Thêm món mới
            </button>
          </div>
        </div>

        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Tên món</th>
                  <th scope="col">Mô tả</th>
                  <th scope="col">Giá bán</th>
                  <th scope="col">Tồn kho</th>
                  <th scope="col">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {
                  products.data && products.data.map((product, i) => {
                    return (
                      <tr key={product._id}>
                        <td>{i + 1}</td>
                        <td>{product.title}</td>
                        <td>{product.description}</td>
                        <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
                        <td>
                          <span className={`badge ${product.stock > 10 ? 'badge-success' : 'badge-warning'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td>
                          <button className="btn-action btn-edit">Sửa</button>
                          <button className="btn-action btn-delete">Xóa</button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {showModal ? <AddModal setShowModal={setShowModal} /> : null}
    </>
  )
}

export default Product