import React from 'react';
import Button from '../../../components/Common/Button';

const PromotionModal = ({ 
  show, 
  handleClose, 
  handleSubmit, 
  editMode, 
  currentPromotion, 
  setCurrentPromotion 
}) => {
  if (!show) return null;

  return (
    <div className="modal fade show d-block modal-overlay" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {editMode ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi mới'}
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Mã khuyến mãi <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentPromotion.code}
                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, code: e.target.value.toUpperCase() })}
                    required
                    placeholder="VD: KFCVIP50"
                    disabled={editMode} // Code is typically unique/immutable
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Tiêu đề <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentPromotion.title}
                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, title: e.target.value })}
                    required
                    placeholder="VD: Ưu đãi mùa hè"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Loại giảm giá <span className="text-danger">*</span></label>
                  <select
                    className="form-select"
                    value={currentPromotion.type}
                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, type: e.target.value })}
                    required
                  >
                    <option value="percent">Giảm theo %</option>
                    <option value="fixed">Giảm tiền cố định</option>
                    <option value="shipping">Miễn phí vận chuyển (Shipping)</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Mô tả <span className="text-danger">*</span></label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={currentPromotion.description}
                  onChange={(e) => setCurrentPromotion({ ...currentPromotion, description: e.target.value })}
                  required
                  placeholder="VD: Giảm 50k cho đơn từ 200k"
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Giá trị giảm {currentPromotion.type === 'percent' && '(%)'}
                    {currentPromotion.type === 'fixed' && '(VNĐ)'}
                    {currentPromotion.type !== 'shipping' && <span className="text-danger"> *</span>}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={currentPromotion.discount}
                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, discount: Number(e.target.value) })}
                    disabled={currentPromotion.type === 'shipping'}
                    required={currentPromotion.type !== 'shipping'}
                    min="0"
                    max={currentPromotion.type === 'percent' ? 100 : undefined}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Đơn tối thiểu (VNĐ) <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    value={currentPromotion.minOrder}
                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, minOrder: Number(e.target.value) })}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Số lượt dùng tối đa <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-control"
                    value={currentPromotion.maxUsage}
                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, maxUsage: Number(e.target.value) })}
                    required
                    min="1"
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Ngày bắt đầu <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    value={currentPromotion.startDate}
                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Ngày kết thúc <span className="text-danger">*</span></label>
                  <input
                    type="date"
                    className="form-control"
                    value={currentPromotion.expiryDate}
                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, expiryDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={currentPromotion.isActive}
                  onChange={(e) => setCurrentPromotion({ ...currentPromotion, isActive: e.target.checked })}
                  id="isActiveCheck"
                />
                <label className="form-check-label" htmlFor="isActiveCheck">
                  Kích hoạt khuyến mãi này ngay
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <Button variant="secondary" onClick={handleClose}>
                Hủy
              </Button>
              <Button type="submit" variant="primary">
                {editMode ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;
