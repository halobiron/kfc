# 📋 DANH SÁCH CẦN HOÀN THIỆN (TO-DO LIST) - KFC PROJECT

> **Mục tiêu:** Tập trung vào các tính năng chưa có để hoàn thiện đồ án.

---

## 🛑 MỨC ĐỘ 1: BẮT BUỘC (CRITICAL)
*Cần làm ngay để đảm bảo chức năng cơ bản.*

### **1. Loading States & Skeleton Screens**
**Vấn đề:** Trang trắng bóc khi đang load dữ liệu -> Trải nghiệm kém.
**Giải pháp:** Thêm Skeleton (khung xương) khi đang fetch API.

**Tham khảo mẫu:**
- **Repo:** `kfc-mern`
- **Files:** `frontend/src/components/MyKFC/MyKFCSkeleton.js`

**Cài đặt:**
```bash
npm install react-content-loader
```

**Code mẫu (Skeleton đơn giản):**
```jsx
import ContentLoader from 'react-content-loader';

const ProductCardSkeleton = () => (
  <ContentLoader 
    speed={2}
    width={280}
    height={400}
    viewBox="0 0 280 400"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="0" rx="8" ry="8" width="280" height="200" /> 
    <rect x="10" y="220" rx="4" ry="4" width="260" height="20" /> 
    <rect x="10" y="250" rx="3" ry="3" width="150" height="15" /> 
  </ContentLoader>
);
```

### **2. API Integration & Axios Setup**
**Vấn đề:** Data đang fix cứng (hardcoded), chưa gọi API thật.

**Cần làm:**
1.  Cài axios: `npm install axios`
2.  Tạo instance (`src/utils/axios.js`) với Logic tự động logout khi token hết hạn (401).

**Code mẫu Axios Instance:**
```javascript
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
```

---

## 🟡 MỨC ĐỘ 2: QUAN TRỌNG (IMPORTANT)
*Tăng trải nghiệm người dùng (UX).*

### **4. Search Page & Advanced Filters**
**Hiện trạng:** Thư mục `src/pages/Search` đã có nhưng **RỖNG**.
**Cần làm:**
-   Tạo UI trang tìm kiếm.
-   Thêm bộ lọc: Theo giá, danh mục.

**Gợi ý code:**
```jsx
// src/pages/Search/index.jsx
const Search = () => {
    // Lấy query từ URL: ?q=ga+ran
    // Gọi API search
    // Render kết quả
}
```

### **5. Deals & Promotions (Ưu đãi)**
**Hiện trạng:** Thiếu trang hiển thị mã giảm giá.
**Cần làm:**
-   Tạo `DealCard` component.
-   Thêm Countdown Timer (đếm ngược thời gian hết hạn).

### **6. Payment Success/Fail Pages**
**Hiện trạng:** Checkout xong không báo gì rõ ràng.
**Cần làm:**
-   Redirect sang trang `PaymentSuccess` khi đặt hàng thành công.
-   Redirect sang trang `PaymentFail` khi lỗi.

### **7. Animations & Transitions**
**Hiện trạng:** `src/components/AnimatedPage.jsx` đã có (dùng `framer-motion`).
**Cần làm:** Áp dụng component này bọc lấy các trang (`Home`, `Product`) để có hiệu ứng chuyển trang mượt mà.

```jsx
<AnimatedPage>
  <ProductList />
</AnimatedPage>
```

---

## 🟢 MỨC ĐỘ 3: NÂNG CAO (NICE TO HAVE)
*Làm đồ án nổi bật hơn.*

### **8. Reviews & Ratings**
-   Cho phép user đánh giá sao và bình luận món ăn.

### **9. Favorites / Wishlist**
-   Lưu món ăn yêu thích vào LocalStorage hoặc Database.

### **10. "PRO" Features (Điểm cộng lớn)**
1.  **Sticky Category Nav:** Thanh menu dính trên cùng khi cuộn trang thực đơn.
2.  **Product Customization:** Modal chọn món chi tiết (Chọn phần gà, đổi nước, thêm phô mai).
3.  **Order Tracking:** UI theo dõi trạng thái đơn hàng (Đang chuẩn bị -> Đang giao).

---

## 🚀 LỊCH TRÌNH GỢI Ý
1.  **Hôm nay:** Setup Axios & Error Boundary.
2.  **Tuần sau:** Code Loading Skeleton & Animations.
3.  **Tuần tới:** Làm trang Search & Payment Result.
