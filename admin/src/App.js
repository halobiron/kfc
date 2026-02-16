import AdminLayout from './components/Layout/AdminLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './features/Auth/pages/Login';

// Config
import { routesConfig, otherRoutes } from './config/routesConfig';

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
      <BrowserRouter basename="/admin">
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
            {/* Render Main Routes from Config */}
            {routesConfig.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}

            {/* Render Other Routes */}
            {otherRoutes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
