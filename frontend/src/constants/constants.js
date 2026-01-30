/**
 * Frontend API Constants & Data Types
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

// DATA STRUCTURES / TYPES (for reference)
export const DATA_STRUCTURES = {
    USER: {
        name: String,
        email: String,
        phone: String,
        password: String,
        avatar: String,
        addresses: Array,
        birthdate: Date,
        role: String,
        isActive: Boolean,
        lastLogin: Date,
        createdAt: Date,
        updatedAt: Date
    },
    ORDER: {
        orderNumber: String,
        userId: String,
        items: Array,
        deliveryType: String,
        deliveryInfo: Object,
        paymentMethod: String,
        couponCode: String,
        couponDiscount: Number,
        subtotal: Number,
        shippingFee: Number,
        totalAmount: Number,
        status: String,
        statusHistory: Array,
        isPaid: Boolean,
        paidAt: Date,
        createdAt: Date,
        updatedAt: Date
    },
    STORE: {
        name: String,
        address: String,
        city: String,
        phone: String,
        email: String,
        openTime: String,
        closeTime: String,
        latitude: Number,
        longitude: Number,
        services: Array,
        manager: String,
        staff: Array,
        isActive: Boolean,
        image: String,
        createdAt: Date,
        updatedAt: Date
    },
    PRODUCT: {
        title: String,
        description: String,
        price: Number,
        stock: Number,
        category: String,
        productImage: String,
        createdAt: Date,
        updatedAt: Date
    },
    COUPON: {
        code: String,
        title: String,
        description: String,
        discount: Number,
        type: String,
        minOrder: Number,
        maxUsage: Number,
        usedCount: Number,
        image: String,
        isActive: Boolean,
        expiryDate: Date,
        createdAt: Date,
        updatedAt: Date
    },
    CATEGORY: {
        name: String,
        slug: String,
        icon: String,
        description: String,
        createdAt: Date,
        updatedAt: Date
    },
    INGREDIENT: {
        name: String,
        category: String,
        unit: String,
        stock: Number,
        minStock: Number,
        maxStock: Number,
        cost: Number,
        supplier: String,
        expiryDate: Date,
        batchNumber: String,
        storageLocation: String,
        description: String,
        isActive: Boolean,
        lastRestockDate: Date,
        createdAt: Date,
        updatedAt: Date
    },
    STAFF: {
        userId: String,
        storeId: String,
        position: String,
        startDate: Date,
        endDate: Date,
        salary: Number,
        workSchedule: Array,
        isActive: Boolean,
        performanceRating: Number,
        createdAt: Date,
        updatedAt: Date
    }
};

// API ENDPOINTS (để dùng trong Redux)
export const API_ENDPOINTS = {
    // AUTH
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    
    // USERS
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile/update',
    CHANGE_PASSWORD: '/users/change-password',
    
    // PRODUCTS
    GET_ALL_PRODUCTS: '/products',
    GET_PRODUCT: '/product/:id',
    
    // CATEGORIES
    GET_ALL_CATEGORIES: '/categories',
    GET_CATEGORY: '/category/:id',
    
    // COUPONS
    GET_ALL_COUPONS: '/coupons',
    GET_COUPON_BY_CODE: '/coupon/code/:code',
    
    // ORDERS
    CREATE_ORDER: '/order/new',
    GET_USER_ORDERS: '/user/orders',
    GET_ORDER: '/order/:id',
    UPDATE_ORDER_STATUS: '/order/update/:id',
    
    // STORES
    GET_ALL_STORES: '/stores',
    GET_STORE: '/store/:id'
};
