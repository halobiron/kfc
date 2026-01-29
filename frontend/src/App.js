import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Profile from './pages/Profile';
import StoreSystem from './pages/StoreSystem';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  return (
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/stores" element={<StoreSystem />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
