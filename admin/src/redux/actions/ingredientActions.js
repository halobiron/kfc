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
            supplier: 'CP Food',
            supplierContact: '028 3836 1234',
            lastUpdated: '2026-01-25T10:00:00Z'
        },
        {
            _id: 'ing_002',
            name: 'Bột chiên xù đặc biệt KFC',
            unit: 'Kg',
            stock: 450, // 45 bao * 10kg
            minStock: 100,
            category: 'Nguyên liệu khô',
            supplier: 'Ajinomoto',
            supplierContact: '0912 345 678',
            lastUpdated: '2026-01-25T10:00:00Z'
        },
        {
            _id: 'ing_003',
            name: 'Dầu thực vật tinh luyện',
            unit: 'Lít',
            stock: 160, // 8 can * 20L
            minStock: 30,
            category: 'Phụ liệu',
            lastUpdated: '2026-01-25T10:00:00Z'
        },
        {
            _id: 'ing_004',
            name: 'Khoai tây cắt thanh đông lạnh',
            unit: 'Kg',
            stock: 300, // 60 bao * 5kg
            minStock: 100,
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
            unit: 'Lít',
            stock: 12, // 3 thung -> assume 4L each? Let's say 4L.
            minStock: 20,
            category: 'Gia vị',
            lastUpdated: '2026-01-25T10:00:00Z'
        },
        {
            _id: 'ing_007',
            name: 'Bao bì/Giấy gói/Hộp giấy',
            unit: 'Cái',
            stock: 12500, // 25 kien * 500
            minStock: 5000,
            category: 'Vật tư',
            lastUpdated: '2026-01-25T10:00:00Z'
        },
        {
            _id: 'ing_008',
            name: 'Nước cốt Pepsi',
            unit: 'Lít',
            stock: 216, // 12 binh * 18L
            minStock: 90,
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



export const createIngredient = (formData) => async (dispatch) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const newIngredient = {
        _id: `ing_${Date.now()}`,
        ...formData,
        stock: parseFloat(formData.stock) || 0,
        minStock: parseFloat(formData.minStock) || 0,
        lastUpdated: new Date().toISOString()
    };

    mockIngredients.data.unshift(newIngredient);

    dispatch({
        type: 'ALL_INGREDIENTS',
        payload: { ...mockIngredients }
    });
};

export const updateIngredientStock = (id, amount, updates = {}) => async (dispatch) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const index = mockIngredients.data.findIndex(ing => ing._id === id);
    if (index !== -1) {
        mockIngredients.data[index].stock += parseFloat(amount);

        // Apply other updates (unit, supplier, etc)
        if (updates.unit) mockIngredients.data[index].unit = updates.unit;
        if (updates.supplier) mockIngredients.data[index].supplier = updates.supplier;
        if (updates.supplierContact) mockIngredients.data[index].supplierContact = updates.supplierContact;

        mockIngredients.data[index].lastUpdated = new Date().toISOString();

        dispatch({
            type: 'UPDATE_INGREDIENT',
            payload: {
                success: true,
                data: mockIngredients.data[index]
            }
        });

        dispatch({
            type: 'ALL_INGREDIENTS',
            payload: { ...mockIngredients }
        });
    }
};
