import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import FloatingChat from '../FloatingChat';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const noWrapperPaths = ['/', '/stores', '/track-order'];
    const noContainerPaths = ['/', '/stores', '/track-order', '/products'];

    const shouldShowPageWrapper = !noWrapperPaths.includes(location.pathname);
    const shouldShowContainer = !noContainerPaths.includes(location.pathname);

    return (
        <div className="layout-wrapper">
            <Header />
            <main className={`main-content ${shouldShowPageWrapper ? 'kfc-page-wrapper' : ''}`}>
                {shouldShowContainer ? (
                    <div className="container kfc-container">
                        {children}
                    </div>
                ) : (
                    children
                )}
            </main>
            <Footer />
            <FloatingChat />
        </div>
    );
};

export default Layout;
