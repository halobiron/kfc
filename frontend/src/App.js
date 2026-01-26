import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';
import Register from './pages/Register';
import MyOrders from './pages/MyOrders';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/product-detail/:id" element={<ProductDetail />} />
          <Route path="/product-detail" element={<ProductDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
