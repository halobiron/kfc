import './App.css';
import Home from './pages/Home';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import Checkout from './pages/Checkout';
import StoreSystem from './pages/StoreSystem';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorPage from './pages/ErrorPage';
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
        <Route path="/profile" element={<AnimatedPage><Profile /></AnimatedPage>} />
        <Route path="/my-orders" element={<AnimatedPage><MyOrders /></AnimatedPage>} />
        <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
        <Route path="/stores" element={<AnimatedPage><StoreSystem /></AnimatedPage>} />
        <Route path="/privacy-policy" element={<AnimatedPage><PrivacyPolicy /></AnimatedPage>} />
        <Route path="/terms-of-use" element={<AnimatedPage><TermsOfUse /></AnimatedPage>} />
        <Route path="*" element={<AnimatedPage><ErrorPage showLayout={false} /></AnimatedPage>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
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
