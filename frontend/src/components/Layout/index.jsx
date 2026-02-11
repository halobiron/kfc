import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import FloatingChat from '../FloatingChat';
import { useLocation } from 'react-router-dom';

const NO_WRAPPER_PATHS = new Set(['/', '/stores']);
const NO_CONTAINER_PATHS = new Set(['/', '/stores', '/products']);
const AUTH_PATH_PREFIXES = ['/login', '/register', '/forgot-password', '/reset-password'];

const Layout = ({ children }) => {
    const { pathname } = useLocation();
    const pageName = pathname === '/' ? 'home' : pathname.slice(1).split('/')[0];
    const isAuthPage = AUTH_PATH_PREFIXES.some((path) => pathname.startsWith(path));

    return (
        <div className="layout-wrapper">
            <Header />
            <main
                className={`main-content ${!NO_WRAPPER_PATHS.has(pathname) ? 'kfc-page-wrapper' : ''} page-${pageName}`}
            >
                {NO_CONTAINER_PATHS.has(pathname) ? (
                    children
                ) : (
                    <div className={`container kfc-container ${isAuthPage ? 'no-padding-y' : ''}`}>
                        {children}
                    </div>
                )}
            </main>
            <Footer />
            <FloatingChat />
        </div>
    );
};

export default Layout;
