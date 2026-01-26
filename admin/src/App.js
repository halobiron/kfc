import './App.css';
import Header from './components/Header';
import Login from './pages/Login';
import Home from './pages/Home';
import Product from './pages/Product'
import ProductDetails from './pages/ProductDetails'
import Ingredient from './pages/Ingredient'
import Order from './pages/Order'
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import OrderDetails from './pages/OrderDetails';
import Categories from './pages/Categories';
import Staff from './pages/Staff';
import Promotions from './pages/Promotions';
import Kitchen from './pages/Kitchen';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="*"
            element={
              <>
                <Header />
                <div className="container-fluid">
                  <div className="row">
                    <Routes>
                      <Route path="/home" element={<Home />} />
                      <Route path="/products" element={<Product />} />
                      <Route path="/products/:id" element={<ProductDetails />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/ingredients" element={<Ingredient />} />
                      <Route path="/orders" element={<Order />} />
                      <Route path="/orders/:id" element={<OrderDetails />} />
                      <Route path="/kitchen" element={<Kitchen />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/staff" element={<Staff />} />
                      <Route path="/promotions" element={<Promotions />} />
                      <Route path="/reports" element={<Reports />} />
                    </Routes>
                  </div>
                </div>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
