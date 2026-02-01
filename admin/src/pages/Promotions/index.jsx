import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiEdit2, FiTrash2, FiGift, FiPercent } from 'react-icons/fi';
import { toast } from 'react-toastify';
import StatCard from '../../components/StatCard';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon, clearErrors, resetSuccess } from '../../redux/slices/couponSlice';
import './promotions.css';

const Promotions = () => {
  const dispatch = useDispatch();
  const { coupons, loading, error, success } = useSelector((state) => state.coupons);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState({
    code: '',
    title: '',
    description: '',
    type: 'percent', // fixed, percent, shipping
    discount: 0,
    minOrder: 0,
    maxUsage: 100,
    startDate: '',
    expiryDate: '',
    isActive: true
  });

  useEffect(() => {
    dispatch(getAllCoupons());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (success) {
      toast.success(editMode ? 'Cập nhật khuyến mãi thành công!' : 'Thêm khuyến mãi thành công!');
      dispatch(resetSuccess());
      setShowModal(false);
      setEditMode(false);
    }
  }, [error, success, dispatch, editMode]);

  const discountTypeLabels = {
    percent: 'Giảm %',
    fixed: 'Giảm tiền',
    shipping: 'Free ship'
  };

  const handleOpenModal = (promotion = null) => {
    if (promotion) {
      setEditMode(true);
      setCurrentPromotion({
        ...promotion,
        startDate: promotion.startDate ? promotion.startDate.split('T')[0] : '',
        expiryDate: promotion.expiryDate ? promotion.expiryDate.split('T')[0] : ''
      });
    } else {
      setEditMode(false);
      setCurrentPromotion({
        code: '',
        title: '',
        description: '',
        type: 'percent',
        discount: 0,
        minOrder: 0,
        maxUsage: 100,
        startDate: '',
        expiryDate: '',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      dispatch(updateCoupon({ id: currentPromotion._id, couponData: currentPromotion }));
    } else {
      dispatch(createCoupon(currentPromotion));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa khuyến mãi này?')) {
      dispatch(deleteCoupon(id));
      toast.info('Đang xóa khuyến mãi...');
    }
  };

  const handleToggleActive = (promotion) => {
    dispatch(updateCoupon({
      id: promotion._id,
      couponData: { isActive: !promotion.isActive }
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getUsagePercentage = (used, max) => {
    return Math.round((used / max) * 100);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <>
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h1 className="page-title">Quản lý Khuyến mãi & Voucher</h1>
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
            onClick={() => handleOpenModal()}
          >
            <FiPlus size={20} /> Tạo khuyến mãi
          </button>
        </div>

        {/* Stats Overview */}
        <div className="row mb-4 g-3">
          <div className="col-md-4">
            <StatCard
              label="Tổng khuyến mãi"
              value={coupons.length}
              icon={<FiGift size={24} />}
              color="primary"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              label="Đang hoạt động"
              value={coupons.filter(p => p.isActive).length}
              icon={<FiGift size={24} />}
              color="success"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              label="Lượt sử dụng"
              value={coupons.reduce((sum, p) => sum + (p.usedCount || 0), 0)}
              icon={<FiPercent size={24} />}
              color="info"
            />
          </div>
        </div>

        {/* Promotions Table */}
        <div className="card">
          <div className="card-header">Danh sách khuyến mãi</div>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col" className="ps-4">#</th>
                  <th scope="col">Mã khuyến mãi</th>
                  <th scope="col">Tiêu đề</th>
                  <th scope="col" className="text-center">Loại giảm giá</th>
                  <th scope="col" className="text-center">Giá trị</th>
                  <th scope="col" className="text-center">Lượt dùng</th>
                  <th scope="col" className="text-center">Thời hạn</th>
                  <th scope="col" className="text-center">Trạng thái</th>
                  <th scope="col" className="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="9" className="text-center py-4">Đang tải dữ liệu...</td></tr>
                ) : coupons.length === 0 ? (
                  <tr><td colSpan="9" className="text-center py-4">Chưa có khuyến mãi nào</td></tr>
                ) : (
                  coupons.map((promotion, index) => {
                    const usagePercent = getUsagePercentage(promotion.usedCount || 0, promotion.maxUsage);
                    return (
                      <tr key={promotion._id}>
                        <td className="ps-4 fw-bold">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FiGift className="text-primary" />
                            <span className="fw-bold">{promotion.code}</span>
                          </div>
                        </td>
                        <td className="text-muted">{promotion.title}</td>
                        <td className="text-center">
                          <span className="badge bg-light text-dark">
                            {discountTypeLabels[promotion.type]}
                          </span>
                        </td>
                        <td className="text-center fw-bold text-danger">
                          {promotion.type === 'percent' && `${promotion.discount}%`}
                          {promotion.type === 'fixed' && formatCurrency(promotion.discount)}
                          {promotion.type === 'shipping' && 'Free ship'}
                        </td>
                        <td className="text-center">
                          <div className="d-flex flex-column align-items-center">
                            <small className="text-muted">
                              {promotion.usedCount || 0}/{promotion.maxUsage}
                            </small>
                            <div className="progress" style={{ width: '80px', height: '6px' }}>
                              <div
                                className={`progress-bar ${usagePercent >= 80 ? 'bg-danger' : usagePercent >= 50 ? 'bg-warning' : 'bg-success'}`}
                                style={{ width: `${usagePercent}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <small className="text-muted d-block">{formatDate(promotion.startDate)}</small>
                          <small className="text-muted">→ {formatDate(promotion.expiryDate)}</small>
                        </td>
                        <td className="text-center">
                          <div className="form-check form-switch d-flex justify-content-center">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={promotion.isActive}
                              onChange={() => handleToggleActive(promotion)}
                            />
                          </div>
                        </td>
                        <td className="text-end pe-4">
                          <button
                            className="btn-action btn-edit border-0 d-inline-flex align-items-center"
                            onClick={() => handleOpenModal(promotion)}
                          >
                            <FiEdit2 style={{ marginRight: '4px' }} />
                            Sửa
                          </button>
                          <button
                            className="btn-action btn-delete border-0 d-inline-flex align-items-center"
                            onClick={() => handleDelete(promotion._id)}
                          >
                            <FiTrash2 style={{ marginRight: '4px' }} />
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  }))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi mới'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
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
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Promotions;
