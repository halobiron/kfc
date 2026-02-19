import React from 'react';
import { FiClock, FiCheckCircle, FiAlertCircle, FiPackage } from 'react-icons/fi';
import StatCard from '../../../../components/Common/StatCard';
import OrderCard from '../../components/OrderCard/OrderCard';
import useKitchenOrders from '../../hooks/useKitchenOrders';
import { ORDER_STATUS } from '../../components/OrderStatusBadge/orderStatus';
import Button from '../../../../components/Common/Button';
import './Kitchen.css';

const Kitchen = () => {
  const {
    refreshOrders,
    handleStatusChange,
    getOrdersByStatus
  } = useKitchenOrders();

  return (
    <>
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="page-title">Điều phối Chế biến</h1>
        </div>
        <Button variant="outline-primary" size="sm" onClick={refreshOrders}>
          Làm mới
        </Button>
      </div>

      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <StatCard
            label="Cần chế biến"
            value={getOrdersByStatus(ORDER_STATUS.CONFIRMED).length}
            icon={<FiClock size={24} />}
            color="warning"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Đang nấu"
            value={getOrdersByStatus(ORDER_STATUS.PREPARING).length}
            icon={<FiAlertCircle size={24} />}
            color="info"
          />
        </div>
        <div className="col-md-4">
          <StatCard
            label="Sẵn sàng (Chờ giao)"
            value={getOrdersByStatus(ORDER_STATUS.READY).length}
            icon={<FiCheckCircle size={24} />}
            color="success"
          />
        </div>
      </div>

      <div className="row g-4">
        {/* Confirmed Orders (To Cook) */}
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-warning text-dark fw-bold">
              <FiClock className="me-2" />
              CHỜ CHẾ BIẾN ({getOrdersByStatus(ORDER_STATUS.CONFIRMED).length})
            </div>
            <div className="card-body p-2 bg-light">
              <div className="orders-column">
                {getOrdersByStatus(ORDER_STATUS.CONFIRMED).length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <FiClock size={40} className="mb-3 opacity-25" />
                    <p className="mb-0">Không có đơn mới cần làm</p>
                  </div>
                ) : (
                  getOrdersByStatus(ORDER_STATUS.CONFIRMED).map(order => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preparing Orders (Cooking) */}
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-info text-dark fw-bold">
              <FiAlertCircle className="me-2" />
              ĐANG NẤU ({getOrdersByStatus(ORDER_STATUS.PREPARING).length})
            </div>
            <div className="card-body p-2 bg-light">
              <div className="orders-column">
                {getOrdersByStatus(ORDER_STATUS.PREPARING).length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <FiAlertCircle size={40} className="mb-3 opacity-25" />
                    <p className="mb-0">Bếp đang rảnh</p>
                  </div>
                ) : (
                  getOrdersByStatus(ORDER_STATUS.PREPARING).map(order => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ready Orders */}
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-header bg-success text-white fw-bold">
              <FiCheckCircle className="me-2" />
              SẴN SÀNG GIAO ({getOrdersByStatus(ORDER_STATUS.READY).length})
            </div>
            <div className="card-body p-2 bg-light">
              <div className="orders-column">
                {getOrdersByStatus(ORDER_STATUS.READY).length === 0 ? (
                  <div className="text-center text-muted py-5">
                    <FiPackage size={40} className="mb-3 opacity-25" />
                    <p className="mb-0">Chưa có món chờ giao</p>
                  </div>
                ) : (
                  getOrdersByStatus(ORDER_STATUS.READY).map(order => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Kitchen;
