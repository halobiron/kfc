import React from 'react'
import './modal.css';

const Modal = ({closeModal}) => {
  return (
      <>
    <div className="bucket-modal-wrapper" onClick={closeModal}>
            
    </div>
    <div className="bucket-modal-inner">
                <div className="bucket-modal-head">
                    <div className="bucket-title bkt-head-content">
                        <h5>GIỎ HÀNG CỦA BẠN</h5>
                    </div>
                    <div className="bucket-counter bkt-head-content">
                        <button className="btn btn-danger btn-cart-counter" type="submit">0</button>
                    </div>
                    <div className="bucket-total bkt-head-content">
                        <span>₫ 0</span>
                    </div>
                </div>
                <div className="bucket-modal-body">
                    <h4 className='mb-3 mt-3 text-center'>CHỌN KHU VỰC GIAO HÀNG</h4>
                    <form className="delivery-form">
                        <div className="form-floating">
                            <div className="form-floating mb-4">
                                <select className="form-select" id="floatingSelect" aria-label="Floating label select example">
                                    <option selected>Chọn thành phố</option>
                                    <option value="1">Hà Nội</option>
                                    <option value="2">Hồ Chí Minh</option>
                                    <option value="3">Đà Nẵng</option>
                                </select>
                                <label htmlFor="floatingSelect">Thành phố</label>
                            </div>
                            <div className="form-floating mb-4">
                                <textarea className="form-control" placeholder="Nhập địa chỉ giao hàng" id="floatingTextarea"></textarea>
                                    <label htmlFor="floatingTextarea">Chọn khu vực</label>
                            </div>
                        </div>
                        <button className="btn btn-danger w-100">TIẾP TỤC</button>
                    </form>
                    <div className="bucket-summary">
                        <div className="item-detail">
                            <h5>Combo 2 người</h5>
                            <p>1 x ₫520,000</p>
                            <p>Đồ uống: Coca Cola</p>
                            <button className="btn btn-outline-danger">+</button>
                            <button className="btn btn-outline-danger">-</button>
                        </div>
                        <div className="price-detail">
                            <h5>₫520,000</h5>
                        </div>
                    </div>
                    <div className="grand-total">
                        <h5>TỔNG CỘNG</h5>
                        <h5>₫520,000</h5>
                    </div>
                </div>
            </div>
    </>
  )
}

export default Modal