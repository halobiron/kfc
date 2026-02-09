import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import FloatingChat from '../FloatingChat';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const noWrapperPaths = ['/', '/stores'];
    const noContainerPaths = ['/', '/stores', '/products'];

    const shouldShowPageWrapper = !noWrapperPaths.includes(location.pathname);
    const shouldShowContainer = !noContainerPaths.includes(location.pathname);

    const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
    const isAuthPage = authPaths.some(path => location.pathname.startsWith(path));

    const pageClass = location.pathname === '/' ? 'page-home' : `page-${location.pathname.substring(1).split('/')[0]}`;

    return (
        <div className="layout-wrapper">
            <Header />
            <main className={`main-content ${shouldShowPageWrapper ? 'kfc-page-wrapper' : ''} ${pageClass}`}>
                {shouldShowContainer ? (
                    <div className={`container kfc-container ${isAuthPage ? 'p-0' : ''}`}>
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
