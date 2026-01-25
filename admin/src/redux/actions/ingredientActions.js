// Mock data for KFC ingredients
const mockIngredients = {
    success: true,
    data: [
        {
            _id: 'ing_001',
            name: 'Thịt Gà tươi (Phi lê/Cánh/Đùi)',
            unit: 'Kg',
            stock: 15.5,
            minStock: 50.0,
            category: 'Thực phẩm tươi',
            lastUpdated: '2026-01-25T10:00:00Z'
        },
        {
            _id: 'ing_002',
            name: 'Bột chiên xù đặc biệt KFC',
            unit: 'Bao (10kg)',
            stock: 45,
            minStock: 10,
            category: 'Nguyên liệu khô',
            lastUpdated: '2026-01-25T10:00:00Z'
        },
        {
            _id: 'ing_003',
            name: 'Dầu thực vật tinh luyện',
            unit: 'Can (20L)',
            stock: 8,
            minStock: 15,
            category: 'Phụ liệu',
            lastUpdated: '2026-01-25T10:00:00Z'
        },
        {
            _id: 'ing_004',
            name: 'Khoai tây cắt thanh đông lạnh',
            unit: 'Bao (5kg)',
            stock: 60,
            minStock: 20,
            category: 'Thực phẩm đông lạnh',
            lastUpdated: '2026-01-25T10:00:00Z'
        },
        {
            _id: 'ing_005',
            name: 'Xà lách tươi',
            unit: 'Kg',
            stock: 12,
            minStock: 10,
            category: 'Rau củ',
            lastUpdated: '2026-01-25T10:00:00Z'
        },
        {
            _id: 'ing_006',
            name: 'Sốt Mayonnaise',
            unit: 'Thùng (4 can)',
            stock: 3,
            minStock: 5,
            category: 'Gia vị',
            lastUpdated: '2026-01-25T10:00:00Z'
        },
        {
            _id: 'ing_007',
            name: 'Bao bì/Giấy gói/Hộp giấy',
            unit: 'Kiện (500 cái)',
            stock: 25,
            minStock: 10,
            category: 'Vật tư',
            lastUpdated: '2026-01-25T10:00:00Z'
        },
        {
            _id: 'ing_008',
            name: 'Nước cốt Pepsi',
            unit: 'Bình (18L)',
            stock: 12,
            minStock: 5,
            category: 'Đồ uống',
            lastUpdated: '2026-01-25T10:00:00Z'
        }
    ]
};

export const getAllIngredients = () => async (dispatch) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    dispatch({
        type: 'ALL_INGREDIENTS',
        payload: mockIngredients
    });
};

export const updateIngredientStock = (id, amount) => async (dispatch) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = mockIngredients.data.findIndex(ing => ing._id === id);
    if (index !== -1) {
        mockIngredients.data[index].stock += parseFloat(amount);
        mockIngredients.data[index].lastUpdated = new Date().toISOString();

        dispatch({
            type: 'UPDATE_INGREDIENT',
            payload: {
                success: true,
                data: mockIngredients.data[index]
            }
        });

        // Refresh the list
        dispatch({
            type: 'ALL_INGREDIENTS',
            payload: { ...mockIngredients }
        });
    }
};
