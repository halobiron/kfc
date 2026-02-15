import React from 'react';
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
import { FiHome, FiFileText, FiShoppingCart, FiUsers, FiBarChart2, FiBox, FiTag, FiPackage, FiMapPin, FiLock } from 'react-icons/fi';

const baseRoutes = [
    { 
        path: '/home', 
        id: 'dashboard', 
        label: 'Tổng quan',
        icon: <FiHome />,
        permission: '',
        component: <Home />
    },
    { 
        path: '/orders', 
        id: 'orders', 
        label: 'Đơn hàng',
        icon: <FiFileText />,
        permission: 'orders.view',
        component: <Order />
    },
    { 
        path: '/kitchen', 
        id: 'kitchen', 
        label: 'Bếp',
        icon: <FiPackage />,
        permission: 'kitchen.view',
        component: <Kitchen />
    },
    { 
        path: '/products', 
        id: 'products', 
        label: 'Sản phẩm',
        icon: <FiShoppingCart />,
        permission: 'products.view',
        component: <Product />
    },
    { 
        path: '/categories', 
        id: 'categories', 
        label: 'Danh mục',
        icon: <FiTag />,
        permission: 'categories.view',
        component: <Categories />
    },
    { 
        path: '/ingredients', 
        id: 'ingredients', 
        label: 'Nguyên liệu',
        icon: <FiBox />,
        permission: 'ingredients.view',
        component: <Ingredient />
    },
    { 
        path: '/users', 
        id: 'users', 
        label: 'Người dùng',
        icon: <FiUsers />,
        permission: 'users.view',
        component: <Users />
    },
    { 
        path: '/roles', 
        id: 'roles', 
        label: 'Phân quyền',
        icon: <FiLock />,
        permission: 'roles.view'
    },
    { 
        path: '/promotions', 
        id: 'promotions', 
        label: 'Khuyến mãi',
        icon: <FiTag />, 
        permission: 'promotions.view',
        component: <Promotions />
    },
    { 
        path: '/reports', 
        id: 'reports', 
        label: 'Báo cáo',
        icon: <FiBarChart2 />,
        permission: 'reports.view',
        component: <Reports />
    },
    { 
        path: '/stores', 
        id: 'stores', 
        label: 'Cửa hàng',
        icon: <FiMapPin />,
        permission: 'stores.view',
        component: <Stores />
    }
];

export const routesMetadata = baseRoutes.map(route =>
    route.id === 'roles'
        ? { ...route, component: <Roles resources={baseRoutes} /> }
        : route
);

export const routesConfig = routesMetadata;

export const otherRoutes = [
    { path: '/products/:id', component: <ProductDetails /> },
    { path: '/orders/:id', component: <OrderDetails /> },
    { path: '/change-password', component: <ChangePassword /> }
];
