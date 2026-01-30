import product1 from '../assets/img/product1.png';
import product2 from '../assets/img/product2.png';
import product3 from '../assets/img/product3.png';

export const categories = [
    { id: 'all', name: 'Tất cả', slug: 'all' },
    { id: 'combo', name: 'Ưu Đãi', slug: 'combo' },
    { id: 'ga-ran', name: 'Gà Rán', slug: 'ga-ran' },
    { id: 'burger', name: 'Burger', slug: 'burger' },
    { id: 'nuoc-uong', name: 'Thức Uống', slug: 'nuoc-uong' },
];

export const allProducts = [
    { id: 1, name: 'Combo Gà Rán 1 Người', price: 89000, category: 'combo', image: product1, description: 'Combo gà rán giòn tan dành cho 1 người, bao gồm 1 miếng gà, 1 khoai tây chiên và 1 nước.' },
    { id: 2, name: 'Burger Zinger', price: 69000, category: 'burger', image: product2, description: 'Burger Zinger trứ danh với miếng gà phi lê tẩm ướp đậm đà, giòn rụm.' },
    { id: 3, name: 'Gà Rán Giòn 2 Miếng', price: 54000, category: 'ga-ran', image: product3, description: '2 miếng gà rán giòn rụm, công thức độc quyền từ KFC.' },
    { id: 4, name: 'Combo Nhóm 4-6 Người', price: 399000, category: 'combo', image: product1, description: 'Tiệc gà thịnh soạn cho cả gia đình hoặc nhóm bạn bè.' },
    { id: 5, name: 'Pepsi Lon', price: 20000, category: 'nuoc-uong', image: product2, description: 'Nước giải khát Pepsi sảng khoái.' },
    { id: 6, name: 'Burger Phô Mai Bò', price: 75000, category: 'burger', image: product3, description: 'Burger thịt bò nướng thơm, phô mai tan chảy.' },
];
