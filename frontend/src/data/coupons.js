export const AVAILABLE_COUPONS = [
    {
        id: 1,
        code: 'KFC50',
        discount: 50000,
        type: 'fixed',
        description: 'Giảm 50K cho đơn từ 200K',
        minOrder: 200000,
        image: "https://static.kfcvietnam.com.vn/images/content/home/promotions/lg/KFC-50k.jpg?v=gXQ2pg",
        title: "ƯU ĐÃI 50K"
    },
    {
        id: 2,
        code: 'FREESHIP',
        discount: 15000,
        type: 'shipping',
        description: 'Miễn phí vận chuyển cho đơn từ 100K',
        minOrder: 100000,
        image: "https://static.kfcvietnam.com.vn/images/content/home/promotions/lg/freeship.jpg?v=gXQ2pg",
        title: "MIỄN PHÍ VẬN CHUYỂN"
    },
    {
        id: 3,
        code: 'DISCOUNT10',
        discount: 10,
        type: 'percent',
        description: 'Giảm 10% tổng đơn hàng (Tối đa 50K)',
        minOrder: 150000,
        image: "https://static.kfcvietnam.com.vn/images/content/home/promotions/lg/discount-10.jpg?v=gXQ2pg",
        title: "GIẢM 10%"
    },
    {
        id: 4,
        code: 'KFCNEW',
        discount: 20000,
        type: 'fixed',
        description: 'Giảm 20K cho khách hàng mới',
        minOrder: 0,
        image: "https://static.kfcvietnam.com.vn/images/content/home/promotions/lg/new-member.jpg?v=gXQ2pg",
        title: "CHÀO BẠN MỚI"
    }
];
