import axios from 'axios';
import product1 from '@shared-assets/img/product1.png';
import product2 from '@shared-assets/img/product2.png';
import product3 from '@shared-assets/img/product3.png';

// Mock data for KFC products
const mockProducts = {
    success: true,
    data: [
        {
            _id: 'mock_001',
            title: 'Gà Rán Giòn Cay',
            description: 'Gà rán giòn tan với lớp vỏ cay nồng đặc trưng, ướp theo công thức bí mật 11 loại gia vị',
            price: 45000,
            stock: 25,
            category: 'Gà Rán',
            image: product1
        },
        {
            _id: 'mock_002',
            title: 'Gà Rán Truyền Thống',
            description: 'Gà rán giòn rụm với hương vị truyền thống, được yêu thích nhất tại KFC',
            price: 42000,
            stock: 30,
            category: 'Gà Rán',
            image: product2
        },
        {
            _id: 'mock_003',
            title: 'Burger Zinger',
            description: 'Burger gà giòn cay đặc biệt với rau xà lách tươi, sốt mayonnaise đậm đà',
            price: 52000,
            stock: 18,
            category: 'Burger',
            image: product3
        },
        {
            _id: 'mock_004',
            title: 'Burger Tôm',
            description: 'Burger tôm giòn tan kết hợp với rau củ tươi ngon và sốt đặc biệt',
            price: 48000,
            stock: 15,
            category: 'Burger',
            image: '/images/burger-tom.jpg'
        },
        {
            _id: 'mock_005',
            title: 'Cơm Gà Teriyaki',
            description: 'Cơm trắng dẻo thơm kèm gà sốt teriyaki ngọt ngào, rau củ xào',
            price: 55000,
            stock: 20,
            category: 'Cơm',
            image: '/images/com-ga-teriyaki.jpg'
        },
        {
            _id: 'mock_006',
            title: 'Cơm Gà Rán',
            description: 'Cơm trắng kèm miếng gà rán giòn, salad tươi và sốt đặc biệt',
            price: 58000,
            stock: 22,
            category: 'Cơm',
            image: '/images/com-ga-ran.jpg'
        },
        {
            _id: 'mock_007',
            title: 'Khoai Tây Chiên (Vừa)',
            description: 'Khoai tây chiên giòn rụm, thơm ngon, size vừa phải',
            price: 25000,
            stock: 50,
            category: 'Món Phụ',
            image: '/images/khoai-tay-chien.jpg'
        },
        {
            _id: 'mock_008',
            title: 'Khoai Tây Chiên (Lớn)',
            description: 'Khoai tây chiên giòn rụm, thơm ngon, size lớn',
            price: 35000,
            stock: 45,
            category: 'Món Phụ',
            image: '/images/khoai-tay-chien-lon.jpg'
        },
        {
            _id: 'mock_009',
            title: 'Gà Popcorn',
            description: 'Những miếng gà nhỏ giòn tan, thơm ngon, dễ ăn',
            price: 38000,
            stock: 28,
            category: 'Món Phụ',
            image: '/images/ga-popcorn.jpg'
        },
        {
            _id: 'mock_010',
            title: 'Súp Bí Đỏ',
            description: 'Súp bí đỏ béo ngậy, thơm ngon, bổ dưỡng',
            price: 22000,
            stock: 35,
            category: 'Món Phụ',
            image: '/images/sup-bi-do.jpg'
        },
        {
            _id: 'mock_011',
            title: 'Pepsi (Vừa)',
            description: 'Nước ngọt Pepsi mát lạnh, size vừa',
            price: 15000,
            stock: 100,
            category: 'Đồ Uống',
            image: '/images/pepsi.jpg'
        },
        {
            _id: 'mock_012',
            title: 'Pepsi (Lớn)',
            description: 'Nước ngọt Pepsi mát lạnh, size lớn',
            price: 20000,
            stock: 95,
            category: 'Đồ Uống',
            image: '/images/pepsi-lon.jpg'
        },
        {
            _id: 'mock_013',
            title: 'Trà Đào',
            description: 'Trà đào thanh mát, hương vị tự nhiên',
            price: 25000,
            stock: 40,
            category: 'Đồ Uống',
            image: '/images/tra-dao.jpg'
        },
        {
            _id: 'mock_014',
            title: 'Combo Gà Rán 1 Người',
            description: '1 miếng gà rán + 1 khoai tây chiên vừa + 1 Pepsi vừa',
            price: 75000,
            stock: 12,
            category: 'Combo',
            image: product1
        },
        {
            _id: 'mock_015',
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

