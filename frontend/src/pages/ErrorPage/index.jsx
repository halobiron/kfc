import React from 'react';

import kfcerror from '../../assets/images/common/kfc-error.jpg';
import Button from '../../components/Button';
import './ErrorPage.css';

const ErrorPage = ({
    title = "RẤT TIẾC! CHÚNG TÔI XIN LỖI",
    message = "Trang bạn đang truy cập có thể đã bị xóa, đã thay đổi tên hoặc tạm thời không có.",
    details,
    buttonText = "BẮT ĐẦU ĐẶT HÀNG",
    onButtonClick
}) => {
    return (
        <div className="not-found-container">
            <img src={kfcerror} alt="KFC Error" />
            <h2>{title}</h2>
            <p>{message}</p>

            {details && (
                <p className="not-found-details">
                    Chi tiết: {details}
                </p>
            )}

            <Button
                variant="primary"
                onClick={onButtonClick}
                to={!onButtonClick ? "/" : undefined}
                className="not-found-button"
            >
                {buttonText}
            </Button>
        </div>
    );
};

export default ErrorPage;
