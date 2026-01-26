import React, { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiGift, FiPercent, FiCalendar } from 'react-icons/fi';
import StatCard from '../../components/StatCard';
import './promotions.css';

const Promotions = () => {
  // Mock data - sẽ thay bằng Redux sau
  const [promotions, setPromotions] = useState([
    { 
      _id: '1', 
      code: 'KFCVIP50', 
      description: 'Giảm 50k cho đơn từ 200k', 
      discountType: 'fixed',
      discountValue: 50000,
      minOrderValue: 200000,
      maxUsage: 100,
      usedCount: 45,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: true
    },
    { 
      _id: '2', 
      code: 'COMBO30', 
      description: 'Giảm 30% cho combo từ 300k', 
      discountType: 'percent',
      discountValue: 30,
      minOrderValue: 300000,
      maxUsage: 200,
      usedCount: 150,
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      isActive: true
    },
    { 
      _id: '3', 
      code: 'FREESHIP', 
      description: 'Miễn phí vận chuyển cho đơn từ 150k', 
      discountType: 'freeship',
      discountValue: 0,
      minOrderValue: 150000,
      maxUsage: 500,
      usedCount: 320,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      isActive: true
    },
    { 
      _id: '4', 
      code: 'WEEKEND20', 
      description: 'Giảm 20% cuối tuần', 
      discountType: 'percent',
      discountValue: 20,
      minOrderValue: 100000,
      maxUsage: 300,
      usedCount: 280,
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      isActive: false
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPromotion, setCurrentPromotion] = useState({
    code: '',
    description: '',
    discountType: 'percent',
    discountValue: 0,
    minOrderValue: 0,
    maxUsage: 100,
    startDate: '',
    endDate: '',
    isActive: true
  });

  const discountTypeLabels = {
    percent: 'Giảm %',
    fixed: 'Giảm tiền',
    freeship: 'Free ship'
  };

  const handleOpenModal = (promotion = null) => {
    if (promotion) {
      setEditMode(true);
      setCurrentPromotion(promotion);
    } else {
      setEditMode(false);
      setCurrentPromotion({
        code: '',
        description: '',
        discountType: 'percent',
        discountValue: 0,
        minOrderValue: 0,
        maxUsage: 100,
        startDate: '',
        endDate: '',
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
      setPromotions(promotions.map(promo => 
        promo._id === currentPromotion._id ? { ...currentPromotion, usedCount: promo.usedCount } : promo
      ));
      alert('Cập nhật khuyến mãi thành công!');
    } else {
      const newPromotion = {
        ...currentPromotion,
        _id: String(promotions.length + 1),
        usedCount: 0
      };
      setPromotions([...promotions, newPromotion]);
      alert('Thêm khuyến mãi thành công!');
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa khuyến mãi này?')) {
      setPromotions(promotions.filter(promo => promo._id !== id));
      alert('Xóa khuyến mãi thành công!');
    }
  };

  const handleToggleActive = (id) => {
    setPromotions(promotions.map(promo => 
      promo._id === id ? { ...promo, isActive: !promo.isActive } : promo
    ));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getUsagePercentage = (used, max) => {
    return Math.round((used / max) * 100);
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
              value={promotions.length}
              icon={<FiGift size={24} />}
              color="primary"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              label="Đang hoạt động"
              value={promotions.filter(p => p.isActive).length}
              icon={<FiGift size={24} />}
              color="success"
            />
          </div>
          <div className="col-md-4">
            <StatCard
              label="Lượt sử dụng"
              value={promotions.reduce((sum, p) => sum + p.usedCount, 0)}
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
                  <th scope="col">Mô tả</th>
                  <th scope="col" className="text-center">Loại giảm giá</th>
                  <th scope="col" className="text-center">Giá trị</th>
                  <th scope="col" className="text-center">Lượt dùng</th>
                  <th scope="col" className="text-center">Thời hạn</th>
                  <th scope="col" className="text-center">Trạng thái</th>
                  <th scope="col" className="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promotion, index) => {
                  const usagePercent = getUsagePercentage(promotion.usedCount, promotion.maxUsage);
                  return (
                    <tr key={promotion._id}>
                      <td className="ps-4 fw-bold">P{1000 + index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <FiGift className="text-primary" />
                          <span className="fw-bold">{promotion.code}</span>
                        </div>
                      </td>
                      <td className="text-muted">{promotion.description}</td>
                      <td className="text-center">
                        <span className="badge bg-light text-dark">
                          {discountTypeLabels[promotion.discountType]}
                        </span>
                      </td>
                      <td className="text-center fw-bold text-danger">
                        {promotion.discountType === 'percent' && `${promotion.discountValue}%`}
                        {promotion.discountType === 'fixed' && formatCurrency(promotion.discountValue)}
                        {promotion.discountType === 'freeship' && 'Free ship'}
                      </td>
                      <td className="text-center">
                        <div className="d-flex flex-column align-items-center">
                          <small className="text-muted">
                            {promotion.usedCount}/{promotion.maxUsage}
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
                        <small className="text-muted d-block">{promotion.startDate}</small>
                        <small className="text-muted">→ {promotion.endDate}</small>
                      </td>
                      <td className="text-center">
                        <div className="form-check form-switch d-flex justify-content-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={promotion.isActive}
                            onChange={() => handleToggleActive(promotion._id)}
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
                })}
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
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Loại giảm giá <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        value={currentPromotion.discountType}
                        onChange={(e) => setCurrentPromotion({ ...currentPromotion, discountType: e.target.value })}
                        required
                      >
                        <option value="percent">Giảm theo %</option>
                        <option value="fixed">Giảm tiền cố định</option>
                        <option value="freeship">Miễn phí vận chuyển</option>
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
                        Giá trị giảm {currentPromotion.discountType === 'percent' && '(%)'}
                        {currentPromotion.discountType === 'fixed' && '(VNĐ)'}
                        {currentPromotion.discountType !== 'freeship' && <span className="text-danger"> *</span>}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={currentPromotion.discountValue}
                        onChange={(e) => setCurrentPromotion({ ...currentPromotion, discountValue: Number(e.target.value) })}
                        disabled={currentPromotion.discountType === 'freeship'}
                        required={currentPromotion.discountType !== 'freeship'}
                        min="0"
                        max={currentPromotion.discountType === 'percent' ? 100 : undefined}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Đơn tối thiểu (VNĐ) <span className="text-danger">*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        value={currentPromotion.minOrderValue}
                        onChange={(e) => setCurrentPromotion({ ...currentPromotion, minOrderValue: Number(e.target.value) })}
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
                        value={currentPromotion.endDate}
                        onChange={(e) => setCurrentPromotion({ ...currentPromotion, endDate: e.target.value })}
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
