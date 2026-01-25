import './App.css';
import Header from './components/Header';
import Login from './pages/Login';
import Home from './pages/Home';
import Product from './pages/Product'
import Order from './pages/Order'

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
                      <Route path="/orders" element={<Order />} />
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
