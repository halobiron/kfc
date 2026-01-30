/**
 * Admin API Constants & Data Types
 * Phải match với Backend Models
 */

// USER ROLES
export const USER_ROLES = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    STAFF: 'staff'
};

// ORDER STATUS
export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    SHIPPING: 'shipping',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

// DELIVERY TYPES
export const DELIVERY_TYPES = {
    DELIVERY: 'delivery',
    PICKUP: 'pickup'
};

// PAYMENT METHODS
export const PAYMENT_METHODS = {
    COD: 'cod',
    CARD: 'card',
    BANK: 'bank'
};

// COUPON TYPES
export const COUPON_TYPES = {
    FIXED: 'fixed',
    PERCENT: 'percent',
    SHIPPING: 'shipping'
};

// STAFF POSITIONS
export const STAFF_POSITIONS = {
    MANAGER: 'manager',
    CASHIER: 'cashier',
    KITCHEN: 'kitchen',
    DELIVERY: 'delivery',
    CUSTOMER_SERVICE: 'customer-service'
};

// INGREDIENT CATEGORIES
export const INGREDIENT_CATEGORIES = {
    FRESH_FOOD: 'thuc-pham-tuoi',
    SPICE: 'gia-vi',
    OIL: 'dau-kem',
    DRINK: 'do-uong',
    OTHER: 'khac'
};

// STORE SERVICES
export const STORE_SERVICES = {
    DINE_IN: 'dine-in',
    TAKEAWAY: 'takeaway',
    DELIVERY: 'delivery',
    DRIVE_THROUGH: 'drive-through'
};

// API ENDPOINTS
export const API_ENDPOINTS = {
    // AUTH
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    
    // USERS/STAFF
    GET_ALL_USERS: '/users',
    GET_USER: '/users/:id',
    CREATE_USER: '/users/new',
    UPDATE_USER: '/users/update/:id',
    DELETE_USER: '/users/delete/:id',
    
    // PRODUCTS
    GET_ALL_PRODUCTS: '/products',
    GET_PRODUCT: '/product/:id',
    CREATE_PRODUCT: '/product/new',
    UPDATE_PRODUCT: '/product/update/:id',
    DELETE_PRODUCT: '/product/delete/:id',
    
    // CATEGORIES
    GET_ALL_CATEGORIES: '/categories',
    GET_CATEGORY: '/category/:id',
    CREATE_CATEGORY: '/category/new',
    UPDATE_CATEGORY: '/category/update/:id',
    DELETE_CATEGORY: '/category/delete/:id',
    
    // COUPONS/PROMOTIONS
    GET_ALL_COUPONS: '/coupons',
    GET_COUPON: '/coupon/:id',
    CREATE_COUPON: '/coupon/new',
    UPDATE_COUPON: '/coupon/update/:id',
    DELETE_COUPON: '/coupon/delete/:id',
    
    // ORDERS
    GET_ALL_ORDERS: '/orders',
    GET_ORDER: '/order/:id',
    UPDATE_ORDER_STATUS: '/order/update/:id',
    
    // STORES
    GET_ALL_STORES: '/stores',
    GET_STORE: '/store/:id',
    CREATE_STORE: '/store/new',
    UPDATE_STORE: '/store/update/:id',
    DELETE_STORE: '/store/delete/:id',
    
    // STAFF/EMPLOYEES
    GET_ALL_STAFF: '/staff',
    GET_STAFF: '/staff/:id',
    CREATE_STAFF: '/staff/new',
    UPDATE_STAFF: '/staff/update/:id',
    DELETE_STAFF: '/staff/delete/:id',
    
    // INGREDIENTS
    GET_ALL_INGREDIENTS: '/ingredients',
    GET_INGREDIENT: '/ingredient/:id',
    CREATE_INGREDIENT: '/ingredient/new',
    UPDATE_INGREDIENT: '/ingredient/update/:id',
    DELETE_INGREDIENT: '/ingredient/delete/:id',
    UPDATE_STOCK: '/ingredient/stock/:id'
};
