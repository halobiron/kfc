import React, { useEffect } from 'react';
import Home from './pages/Home';
import Product from './features/Product/pages/Product';
import ProductDetail from './features/Product/pages/ProductDetail';
import Cart from './features/Cart/pages/Cart';
import Login from './features/Auth/pages/Login';
import Register from './features/Auth/pages/Register';
import ForgotPassword from './features/Auth/pages/ForgotPassword';
import ResetPassword from './features/Auth/pages/ResetPassword';
import Account from './features/Auth/pages/Account';
import Checkout from './features/Cart/pages/Checkout';
import StoreSystem from './features/Store/pages/StoreSystem';
import TrackOrder from './pages/TrackOrder';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorPage from './pages/ErrorPage';
import OrderSuccess from './features/Cart/pages/OrderSuccess';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { loadUserStart, loadUserSuccess, loadUserFailure } from './features/Auth/authSlice';
import authApi from './api/authApi';

import AnimatedPage from './components/AnimatedPage';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
        <Route path="/products" element={<AnimatedPage><Product /></AnimatedPage>} />
        <Route path="/product-detail/:id" element={<AnimatedPage><ProductDetail /></AnimatedPage>} />
        <Route path="/product-detail" element={<AnimatedPage><ProductDetail /></AnimatedPage>} />
        <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
        <Route path="/forgot-password" element={<AnimatedPage><ForgotPassword /></AnimatedPage>} />
        <Route path="/reset-password/:token" element={<AnimatedPage><ResetPassword /></AnimatedPage>} />
        <Route path="/account" element={<ProtectedRoute><AnimatedPage><Account /></AnimatedPage></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><AnimatedPage><Account /></AnimatedPage></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><AnimatedPage><Account /></AnimatedPage></ProtectedRoute>} />
        <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
        <Route path="/stores" element={<AnimatedPage><StoreSystem /></AnimatedPage>} />
        <Route path="/track-order" element={<AnimatedPage><TrackOrder /></AnimatedPage>} />
        <Route path="/privacy-policy" element={<AnimatedPage><PrivacyPolicy /></AnimatedPage>} />
        <Route path="/terms-of-use" element={<AnimatedPage><TermsOfUse /></AnimatedPage>} />
        <Route path="/order-success" element={<AnimatedPage><OrderSuccess /></AnimatedPage>} />
        <Route path="*" element={<AnimatedPage><ErrorPage /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.token) {
        try {
          dispatch(loadUserStart());
          const response = await authApi.getMe();
          if (response.status) {
            dispatch(loadUserSuccess({
              ...response.data,
              token: user.token
            }));
          }
        } catch (error) {
          dispatch(loadUserFailure());
        }
      }
    };
    loadUser();
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
