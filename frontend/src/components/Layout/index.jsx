import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import FloatingChat from '../FloatingChat';

const Layout = ({ children }) => {
    return (
        <div className="layout-wrapper">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <Footer />
            <FloatingChat />
        </div>
    );
};

export default Layout;
