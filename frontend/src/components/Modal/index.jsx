import React from 'react'
import './modal.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../../features/Cart/cartSlice';

const Modal = ({closeModal}) => {
  const { items, totalQuantity, totalPrice } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  
  return (
      <>
    <div className="bucket-modal-wrapper" onClick={closeModal}></div>
    <div className="bucket-modal-inner">
      <div className="bucket-modal-head">
        <div className="bucket-title bkt-head-content"><h5>GIỎ HÀNG CỦA BẠN</h5></div>
        <div className="bucket-counter bkt-head-content"><button className="btn btn-danger btn-cart-counter">{totalQuantity}</button></div>
        <div className="bucket-total bkt-head-content"><span>₫ {totalPrice.toLocaleString('vi-VN')}</span></div>
      </div>
      <div className="bucket-modal-body">
        <h4 className='mb-3 mt-3 text-center'>CHỌN KHU VỰC GIAO HÀNG</h4>
        <form className="delivery-form">
          <div className="form-floating">
            <div className="form-floating mb-4">
              <select className="form-select" id="floatingSelect">
                <option defaultValue>Chọn thành phố</option>
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
        {items.length > 0 ? (
          <>
            {items.map(item => (
              <div className="bucket-summary" key={item.id}>
                <div className="item-detail">
                  <h5>{item.name}</h5>
                  <p>{item.quantity} x ₫{item.price.toLocaleString('vi-VN')}</p>
                  <button type="button" className="btn btn-outline-danger" onClick={() => dispatch(updateQuantity({productId: item.id, quantity: item.quantity + 1}))}>+</button>
                  <button type="button" className="btn btn-outline-danger" onClick={() => item.quantity > 1 ? dispatch(updateQuantity({productId: item.id, quantity: item.quantity - 1})) : dispatch(removeFromCart(item.id))}>-</button>
                </div>
                <div className="price-detail"><h5>₫{(item.price * item.quantity).toLocaleString('vi-VN')}</h5></div>
              </div>
            ))}
            <div className="grand-total"><h5>TỔNG CỘNG</h5><h5>₫{totalPrice.toLocaleString('vi-VN')}</h5></div>
          </>
        ) : (
          <div className="text-center mt-4"><p>Giỏ hàng trống</p></div>
        )}
      </div>
    </div>
    </>
  )
}

export default Modal