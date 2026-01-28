import axios from 'axios';
import product1 from '@shared-assets/img/product1.png';
import product2 from '@shared-assets/img/product2.png';
import product3 from '@shared-assets/img/product3.png';

// Mock data for KFC products
const mockProducts = {
    success: true,
    data: [
        {
            _id: 'P1001',
            title: 'Gà Rán Giòn Cay',
            description: 'Gà rán giòn tan với lớp vỏ cay nồng đặc trưng, ướp theo công thức bí mật 11 loại gia vị',
            price: 45000,
            stock: 25,
            category: 'Gà Rán',
            image: product1,
            recipe: [
                { ingredientId: 'ing_001', name: 'Thịt Gà tươi', quantity: 0.5, unit: 'Kg' },
                { ingredientId: 'ing_002', name: 'Bột chiên xù', quantity: 0.1, unit: 'Bao (10kg)' }
            ]
        },
        {
            _id: 'P1002',
            title: 'Gà Rán Truyền Thống',
            description: 'Gà rán giòn rụm với hương vị truyền thống, được yêu thích nhất tại KFC',
            price: 42000,
            stock: 30,
            category: 'Gà Rán',
            image: product2,
            recipe: [
                { ingredientId: 'ing_001', name: 'Thịt Gà tươi', quantity: 0.5, unit: 'Kg' },
                { ingredientId: 'ing_002', name: 'Bột chiên xù', quantity: 0.08, unit: 'Bao (10kg)' }
            ]
        },
        {
            _id: 'P1003',
            title: 'Burger Zinger',
            description: 'Burger gà giòn cay đặc biệt với rau xà lách tươi, sốt mayonnaise đậm đà',
            price: 52000,
            stock: 18,
            category: 'Burger',
            image: product3,
            recipe: [
                { ingredientId: 'ing_001', name: 'Thịt Gà tươi', quantity: 0.2, unit: 'Kg' },
                { ingredientId: 'ing_005', name: 'Xà lách tươi', quantity: 0.05, unit: 'Kg' },
                { ingredientId: 'ing_006', name: 'Sốt Mayonnaise', quantity: 0.02, unit: 'Thùng (4 can)' }
            ]
        },
        {
            _id: 'P1004',
            title: 'Combo Gà Rán 1 Người',
            description: '1 miếng gà rán + 1 khoai tây chiên vừa + 1 Pepsi vừa',
            price: 75000,
            stock: 12,
            category: 'Combo',
            image: product1
        },
        {
            _id: 'P1005',
            title: 'Combo Gia Đình',
            description: '6 miếng gà rán + 2 khoai tây chiên lớn + 4 Pepsi vừa',
            price: 280000,
            stock: 8,
            category: 'Combo',
            image: product2
        }
    ]
};

export const getAllProducts = () => async (dispatch) => {
    const response = await axios.get(`http://localhost:9000/api/v1/products`);
    dispatch({
        type: 'ALL_PRODUCTS',
        payload: response.data
    })
}

export const getAllProductsMock = () => async (dispatch) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    dispatch({
        type: 'ALL_PRODUCTS',
        payload: mockProducts
    })
}

export const addNewProduct = (product) => async (dispatch) => {
    const config = {
        headers: {
            'content-type': 'application/json'
        }
    }
    const response = await axios.post(`http://localhost:9000/api/v1/product/new`, product, config);
    dispatch({
        type: 'ADD_PRODUCT',
        payload: response.data
    })
}

export const getProductById = (id) => async (dispatch) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Find product in mock data
    const product = mockProducts.data.find(p => p._id === id);

    if (product) {
        dispatch({
            type: 'GET_PRODUCT_BY_ID',
            payload: {
                success: true,
                product: product
            }
        });
    } else {
        dispatch({
            type: 'GET_PRODUCT_BY_ID',
            payload: {
                success: false,
                message: 'Product not found'
            }
        });
    }
}

export const updateProduct = (id, productData) => async (dispatch) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Find and update product in mock data
    const productIndex = mockProducts.data.findIndex(p => p._id === id);

    if (productIndex !== -1) {
        mockProducts.data[productIndex] = {
            ...mockProducts.data[productIndex],
            ...productData,
            _id: id // Ensure ID doesn't change
        };

        dispatch({
            type: 'UPDATE_PRODUCT',
            payload: {
                success: true,
                product: mockProducts.data[productIndex],
                message: 'Cập nhật sản phẩm thành công!'
            }
        });

        // Also update the products list
        dispatch({
            type: 'ALL_PRODUCTS',
            payload: mockProducts
        });
    } else {
        dispatch({
            type: 'UPDATE_PRODUCT',
            payload: {
                success: false,
                message: 'Không tìm thấy sản phẩm'
            }
        });
    }
}

