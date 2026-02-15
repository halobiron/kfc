import Home from '../features/Dashboard/pages/Home';
import Product from '../features/Product/pages/Product';
import ProductDetails from '../features/Product/pages/ProductDetails';
import Ingredient from '../features/Ingredient/pages/Ingredient';
import Order from '../features/Order/pages/Order';
import Users from '../features/User/pages/Users';
import Reports from '../features/Dashboard/pages/Reports';
import OrderDetails from '../features/Order/pages/OrderDetails';
import Categories from '../features/Category/pages/Categories';
import Promotions from '../features/Promotion/pages/Promotions';
import Kitchen from '../features/Order/pages/Kitchen';
import Stores from '../features/Store/pages/Stores';
import ChangePassword from '../features/Auth/pages/ChangePassword';
import Roles from '../features/Role/pages/Roles';

// Định nghĩa danh sách các route và resource tương ứng
// File này giúp đồng bộ giữa App.js và phần phân quyền

// 1. Define routes WITHOUT components first to avoid circular dependency
// This array contains all metadata needed for Roles page
const routesMetadata = [
    { 
        path: '/home', 
        id: 'dashboard', 
        label: 'Tổng quan'
    },
    { 
        path: '/orders', 
        id: 'orders', 
        label: 'Đơn hàng'
    },
    { 
        path: '/kitchen', 
        id: 'kitchen', 
        label: 'Bếp'
    },
    { 
        path: '/products', 
        id: 'products', 
        label: 'Sản phẩm'
    },
    { 
        path: '/categories', 
        id: 'categories', 
        label: 'Danh mục'
    },
    { 
        path: '/ingredients', 
        id: 'ingredients', 
        label: 'Nguyên liệu'
    },
    { 
        path: '/users', 
        id: 'users', 
        label: 'Người dùng'
    },
    { 
        path: '/roles', 
        id: 'roles', 
        label: 'Phân quyền'
    },
    { 
        path: '/promotions', 
        id: 'promotions', 
        label: 'Khuyến mãi'
    },
    { 
        path: '/reports', 
        id: 'reports', 
        label: 'Báo cáo'
    },
    { 
        path: '/stores', 
        id: 'stores', 
        label: 'Cửa hàng'
    }
];

// 2. Map components to IDs
// Roles component receives the metadata as props!
const components = {
    'dashboard': <Home />,
    'orders': <Order />,
    'kitchen': <Kitchen />,
    'products': <Product />,
    'categories': <Categories />,
    'ingredients': <Ingredient />,
    'users': <Users />,
    'roles': <Roles resources={routesMetadata} />, // Pass metadata here
    'promotions': <Promotions />,
    'reports': <Reports />,
    'stores': <Stores />
};

// 3. Export the final config with components
export const routesConfig = routesMetadata.map(route => ({
    ...route,
    component: components[route.id]
}));

// Các route con hoặc route không cần hiển thị trong bảng phân quyền
export const otherRoutes = [
    { path: '/products/:id', component: <ProductDetails /> },
    { path: '/orders/:id', component: <OrderDetails /> },
    { path: '/change-password', component: <ChangePassword /> }
];
