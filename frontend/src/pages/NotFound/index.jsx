import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import kfcerror from '../../assets/img/kfc-error.jpg';
import './NotFound.css';

const NotFound = () => {
    return (
        <Layout>
            <div className="not-found-container">
                <img src={kfcerror} alt="KFC Error" className="not-found-image" />
                <h2 className="not-found-title-sub">RẤT TIẾC! CHÚNG TÔI XIN LỖI</h2>
                <p className="not-found-text">
                    Trang bạn đang truy cập có thể đã bị xóa, đã thay đổi tên hoặc tạm thời không có.
                </p>
                <Link to="/" className="not-found-btn">
                    BẮT ĐẦU ĐẶT HÀNG
                </Link>
            </div>
        </Layout>
    );
};

export default NotFound;
