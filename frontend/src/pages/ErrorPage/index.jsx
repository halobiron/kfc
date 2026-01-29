import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import kfcerror from '../../assets/img/kfc-error.jpg';
import './ErrorPage.css';

const ErrorPage = ({
    title = "RẤT TIẾC! CHÚNG TÔI XIN LỖI",
    message = "Trang bạn đang truy cập có thể đã bị xóa, đã thay đổi tên hoặc tạm thời không có.",
    details,
    showLayout = true,
    buttonText = "BẮT ĐẦU ĐẶT HÀNG",
    onButtonClick // If provided, renders a button instead of a Link to home
}) => {
    const Content = () => (
        <div className="not-found-container" style={{ minHeight: showLayout ? '50vh' : '100vh' }}>
            <img src={kfcerror} alt="KFC Error" className="not-found-image" />
            <h2 className="not-found-title-sub">{title}</h2>
            <p className="not-found-text">{message}</p>

            {details && (
                <p style={{ color: '#999', fontSize: '12px', marginBottom: '20px', maxWidth: '600px' }}>
                    Chi tiết: {details}
                </p>
            )}

            {onButtonClick ? (
                <button onClick={onButtonClick} className="not-found-btn" style={{ cursor: 'pointer', outline: 'none' }}>
                    {buttonText}
                </button>
            ) : (
                <Link to="/" className="not-found-btn">
                    {buttonText}
                </Link>
            )}
        </div>
    );

    return showLayout ? <Layout><Content /></Layout> : <Content />;
};

export default ErrorPage;
