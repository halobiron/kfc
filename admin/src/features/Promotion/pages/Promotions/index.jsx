import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiGift, FiPercent } from 'react-icons/fi';
import { toast } from 'react-toastify';
import StatCard from '../../../../components/Common/StatCard';
import { AddButton, EditButton, DeleteButton } from '../../../../components/Common/Button';
import Badge from '../../../../components/Common/Badge';
import Table from '../../../../components/Common/Table';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon, clearErrors, resetSuccess } from '../../couponSlice';
import { formatCurrency, formatDate } from '../../../../utils/formatters';
import PromotionModal from '../../components/PromotionModal';
import './Promotions.css';

const Promotions = () => {
  const dispatch = useDispatch();
  const { coupons, loading, error, success } = useSelector((state) => state.coupons);
  const { keyword } = useSelector(state => state.search);

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

  const filteredCoupons = coupons.filter(coupon =>
    (coupon.code && coupon.code.toLowerCase().includes((keyword || '').toLowerCase())) ||
    (coupon.title && coupon.title.toLowerCase().includes((keyword || '').toLowerCase()))
  );

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

  const getUsagePercentage = (used, max) => {
    return Math.round((used / max) * 100);
  };

  const columns = [
    {
      header: '#',
      className: 'ps-4',
      render: (_, index) => <span className="fw-bold">{index + 1}</span>
    },
    {
      header: 'Mã khuyến mãi',
      render: (promotion) => (
        <div className="d-flex align-items-center gap-2">
          <FiGift className="text-primary" />
          <span className="fw-bold">{promotion.code}</span>
        </div>
      )
    },
    {
      header: 'Tiêu đề',
      className: 'text-muted',
      key: 'title'
    },
    {
      header: 'Loại giảm giá',
      className: 'text-center',
      render: (promotion) => <Badge variant="light">{discountTypeLabels[promotion.type]}</Badge>
    },
    {
      header: 'Giá trị',
      className: 'text-center fw-bold text-danger',
      render: (promotion) => (
        <>
          {promotion.type === 'percent' && `${promotion.discount}%`}
          {promotion.type === 'fixed' && formatCurrency(promotion.discount)}
          {promotion.type === 'shipping' && 'Free ship'}
        </>
      )
    },
    {
      header: 'Lượt dùng',
      className: 'text-center',
      render: (promotion) => {
        const usagePercent = getUsagePercentage(promotion.usedCount || 0, promotion.maxUsage);
        return (
          <div className="d-flex flex-column align-items-center">
            <small className="text-muted">
              {promotion.usedCount || 0}/{promotion.maxUsage}
            </small>
            <div className="progress progress-container">
              <div
                className={`progress-bar ${usagePercent >= 80 ? 'bg-danger' : usagePercent >= 50 ? 'bg-warning' : 'bg-success'}`}
                style={{ width: `${usagePercent}%` }}
              ></div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Thời hạn',
      className: 'text-center',
      render: (promotion) => (
        <>
          <small className="text-muted d-block">{formatDate(promotion.startDate)}</small>
          <small className="text-muted">→ {formatDate(promotion.expiryDate)}</small>
        </>
      )
    },
    {
      header: 'Trạng thái',
      className: 'text-center',
      render: (promotion) => (
        <div className="form-check form-switch d-flex justify-content-center">
          <input
            className="form-check-input"
            type="checkbox"
            checked={promotion.isActive}
            onChange={() => handleToggleActive(promotion)}
          />
        </div>
      )
    },
    {
      header: 'Thao tác',
      className: 'text-end pe-4',
      render: (promotion) => (
        <>
          <EditButton
            className="me-2"
            onClick={() => handleOpenModal(promotion)}
          />
          <DeleteButton
            onClick={() => handleDelete(promotion._id)}
          />
        </>
      )
    }
  ];

  return (
    <>
      <>
        <div className="page-header d-flex justify-content-between align-items-center">
          <h1 className="page-title">Quản lý Khuyến mãi & Voucher</h1>
          <AddButton onClick={() => handleOpenModal()} />
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
          <Table
            columns={columns}
            data={filteredCoupons}
            loading={loading}
            emptyMessage="Chưa có khuyến mãi nào"
          />
        </div>
      </>

      {/* Modal */}
      <PromotionModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSubmit={handleSubmit}
        editMode={editMode}
        currentPromotion={currentPromotion}
        setCurrentPromotion={setCurrentPromotion}
      />
    </>
  );
};

export default Promotions;
