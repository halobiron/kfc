import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../authSlice';
import './Account.css';
import AccountOrders from '../../components/AccountOrders';
import AccountProfile from '../../components/AccountProfile';
import AccountAddress from '../../components/AccountAddress';

const Account = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('orders');

    const storedUser = JSON.parse(localStorage.getItem('user'));
    const displayName = user?.name || storedUser?.name;

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        toast.success('Đăng xuất thành công!');
    };

    return (
        <div className="my-account-page">
            <section className="container page-wrapper">
                <div className="page-block">
                    {/* Left Sidebar */}
                    <div className="block-left">
                        <div className="account-left page-with-bar medium-bar">
                            <div className="account-profile">
                                <img
                                    src="https://static.kfcvietnam.com.vn/images/web/profile-circle.png?v=5.0"
                                    alt="Profile"
                                    className="profile-avatar-img"
                                />
                                <div>
                                    <h2>{displayName}</h2>
                                    <a href="#logout" className="link-underline" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                                        Đăng xuất
                                    </a>
                                </div>
                            </div>
                            <ul>
                                <li className={activeTab === 'orders' ? 'active' : ''}>
                                    <a href="#orders" onClick={(e) => { e.preventDefault(); setActiveTab('orders'); }}>
                                        Các đơn hàng đã đặt
                                    </a>
                                </li>
                                <li className={activeTab === 'profile' ? 'active' : ''}>
                                    <a href="#profile" onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}>
                                        Quản lý hồ sơ
                                    </a>
                                </li>
                                <li className={activeTab === 'addresses' ? 'active' : ''}>
                                    <a href="#addresses" onClick={(e) => { e.preventDefault(); setActiveTab('addresses'); }}>
                                        Sổ địa chỉ
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="block-right">
                        {activeTab === 'orders' && <AccountOrders />}
                        {activeTab === 'profile' && <AccountProfile />}
                        {activeTab === 'addresses' && <AccountAddress />}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Account;
