import React, { useEffect } from 'react';
import './App.css';
import Home from './pages/Home';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Checkout from './pages/Checkout';
import StoreSystem from './pages/StoreSystem';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorPage from './pages/ErrorPage';
import OrderSuccess from './pages/OrderSuccess';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch } from 'react-redux';
import { loadUserStart, loadUserSuccess, loadUserFailure } from './redux/slices/authSlice';
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
        <Route path="/account" element={<ProtectedRoute><AnimatedPage><Account /></AnimatedPage></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><AnimatedPage><Account /></AnimatedPage></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><AnimatedPage><Account /></AnimatedPage></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><AnimatedPage><Checkout /></AnimatedPage></ProtectedRoute>} />
        <Route path="/stores" element={<AnimatedPage><StoreSystem /></AnimatedPage>} />
        <Route path="/privacy-policy" element={<AnimatedPage><PrivacyPolicy /></AnimatedPage>} />
        <Route path="/terms-of-use" element={<AnimatedPage><TermsOfUse /></AnimatedPage>} />
        <Route path="/order-success" element={<AnimatedPage><OrderSuccess /></AnimatedPage>} />
        <Route path="*" element={<AnimatedPage><ErrorPage showLayout={false} /></AnimatedPage>} />
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
          if (response.data.status) {
            dispatch(loadUserSuccess({
              ...response.data.data,
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
      <BrowserRouter>
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
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
