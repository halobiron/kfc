import AdminLayout from './components/Layout/AdminLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './features/Auth/pages/Login';
import Home from './features/Dashboard/pages/Home';
import Product from './features/Product/pages/Product'
import ProductDetails from './features/Product/pages/ProductDetails'
import Ingredient from './features/Ingredient/pages/Ingredient'
import Order from './features/Order/pages/Order'
import Users from './features/User/pages/Users';
import Reports from './features/Dashboard/pages/Reports';
import OrderDetails from './features/Order/pages/OrderDetails';
import Categories from './features/Category/pages/Categories';

import Promotions from './features/Promotion/pages/Promotions';
import Kitchen from './features/Order/pages/Kitchen';
import Stores from './features/Store/pages/Stores';
import ChangePassword from './features/Auth/pages/ChangePassword';
import Roles from './features/Role/pages/Roles';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './features/Auth/authSlice';

const RequireAuth = ({ children }) => {
  const { token } = useSelector(state => state.auth);
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  return (
    <>
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
          <Route path="/" element={<Login />} />
          <Route element={<RequireAuth><AdminLayout /></RequireAuth>}>
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Product />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/ingredients" element={<Ingredient />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/users" element={<Users />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/roles" element={<Roles />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
