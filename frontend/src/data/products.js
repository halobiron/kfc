import product1 from '../assets/img/product1.png';
import product2 from '../assets/img/product2.png';
import product3 from '../assets/img/product3.png';

export const categories = [
    { id: 'all', name: 'Tất cả', slug: 'all' },
    { id: 'combo', name: 'Combo', slug: 'combo' },
    { id: 'ga-ran', name: 'Gà Rán', slug: 'ga-ran' },
    { id: 'burger', name: 'Burger', slug: 'burger' },
    { id: 'com', name: 'Cơm', slug: 'com' },
    { id: 'nuoc-uong', name: 'Nước Uống', slug: 'nuoc-uong' },
    { id: 'mon-phu', name: 'Món Phụ', slug: 'mon-phu' },
    { id: 'trang-mieng', name: 'Tráng Miệng', slug: 'trang-mieng' },
];

export const allProducts = [
    { id: 1, name: 'Combo Gà Rán 1 Người', price: 89000, category: 'combo', image: product1, description: 'Combo gà rán giòn tan dành cho 1 người, bao gồm 1 miếng gà, 1 khoai tây chiên và 1 nước.' },
    { id: 2, name: 'Burger Zinger', price: 69000, category: 'burger', image: product2, description: 'Burger Zinger trứ danh với miếng gà phi lê tẩm ướp đậm đà, giòn rụm.' },
    { id: 3, name: 'Gà Popcorn (Vừa)', price: 38000, category: 'ga-ran', image: product3, description: 'Những viên gà Popcorn giòn tan, vui miệng, thơm ngon khó cưỡng.' },
    { id: 4, name: 'Gà Rán Giòn 2 Miếng', price: 54000, category: 'ga-ran', image: product1, description: '2 miếng gà rán giòn rụm, công thức độc quyền từ KFC.' },
    { id: 5, name: 'Burger Tôm', price: 59000, category: 'burger', image: product2, description: 'Burger nhân tôm tươi ngon, kết hợp sốt mayonnaise béo ngậy.' },
    { id: 6, name: 'Combo Nhóm 4-6 Người', price: 399000, category: 'combo', image: product1, description: 'Tiệc gà thịnh soạn cho cả gia đình hoặc nhóm bạn bè.' },
    { id: 7, name: 'Cơm Gà Giòn Cay', price: 45000, category: 'com', image: product3, description: 'Cơm dẻo thơm ăn kèm gà giòn cay, đậm đà hương vị.' },
    { id: 8, name: 'Pepsi Lon', price: 20000, category: 'nuoc-uong', image: product2, description: 'Nước giải khát Pepsi sảng khoái.' },
    { id: 9, name: 'Khoai Tây Chiên (L)', price: 25000, category: 'mon-phu', image: product1, description: 'Khoai tây chiên vàng giòn, món ăn kèm hoàn hảo.' },
    { id: 10, name: 'Sundae Kem Dâu', price: 15000, category: 'trang-mieng', image: product3, description: 'Kem Sundae mát lạnh với sốt dâu ngọt ngào.' },
];
