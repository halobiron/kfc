# 📋 DANH SÁCH CẦN HOÀN THIỆN (TO-DO LIST) - KFC PROJECT

> **Mục tiêu:** Tập trung vào các tính năng chưa có để hoàn thiện đồ án.
> **Lưu ý:** Các mục dưới đây chưa được hoàn thiện trong repo `kfc`. Hãy tham khảo các hướng dẫn chi tiết bên dưới.

---

## 🛑 MỨC ĐỘ 1: BẮT BUỘC (CRITICAL)
*Cần làm ngay để đảm bảo chức năng cơ bản.*

### **1. Loading States & Skeleton Screens**
**Vấn đề:** Hiện tại khi load trang, giao diện trắng bóc gây cảm giác ứng dụng bị đơ.
**Giải pháp:** Hiển thị khung xương (skeleton) giống `kfc-mern` trong lúc chờ API.

**Tham khảo thực tế:**
- **Repo mẫu:** `kfc-mern`
- **File:** `frontend/src/components/commons/HeroSkeleton.js` hoặc `ProductPageSkeleton.js`

**Cách làm:**
1.  Cài đặt thư viện: `npm install react-content-loader`
2.  Tạo component `Skeleton` (tham khảo mẫu dưới).
3.  Trong lúc `loading = true`, render `Skeleton` thay vì `ProductList`.

**Code mẫu (Skeleton đơn giản):**
```jsx
// src/components/Skeleton/ProductSkeleton.jsx
import ContentLoader from 'react-content-loader';

const ProductSkeleton = () => (
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
export default ProductSkeleton;
```

### **2. API Integration & Axios Helper**
**Vấn đề:** Chưa có cấu hình Axios chung, code gọi API đang rời rạc hoặc hardcode.
**Hiện trạng:** Thư mục `src/utils/` đang rỗng.

**Cách làm:**
1.  Tạo file `src/utils/axios.js`.
2.  Cấu hình `baseURL` và Interceptor để tự động logout khi token hết hạn (401).

**Code mẫu:**
```javascript
// src/utils/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Đổi thành URL backend thật
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
export default axiosInstance;
```

---

## 🟡 MỨC ĐỘ 2: QUAN TRỌNG (UX IMPROVEMENT)
*Tăng trải nghiệm người dùng, giúp đồ án "xịn" hơn.*

### **3. Search Page (Trang Tìm Kiếm)**
**Vấn đề:** Thư mục `src/pages/Search` đã có nhưng chưa có logic.
**Mục tiêu:** Cho phép người dùng nhập từ khóa và xem kết quả món ăn.

**Tham khảo logic:**
- Logic lọc sản phẩm có thể xem trong `kfc-mern/frontend/src/pages/CategoryPage.js` (hàm `getCatProds`).

**Cách triển khai:**
1.  Tạo UI input tìm kiếm (có thể ở Header).
2.  Khi Enter, navigate sang `/search?q=keyword`.
3.  Trong `src/pages/Search/index.jsx`:
    - Lấy keyword từ URL (`useLocation` hook).
    - Gọi API tìm kiếm sản phẩm.
    - Render danh sách `Card` sản phẩm.

### **4. Deals & Promotions (Ưu đãi)**
**Vấn đề:** Web bán hàng cần có trang khuyến mãi.
**Tham khảo:** `kfc-mern/frontend/src/components/deals/DealSection.js`.

**Cách làm:**
1.  Tạo component `DealCard` hiển thị ảnh banner và mã coupon.
2.  Thử mockup dữ liệu cứng trước nếu chưa có API khuyến mãi.

### **5. Payment Success/Fail Pages**
**Vấn đề:** User thanh toán xong không biết thành công hay thất bại.
**Tham khảo:** `kfc-mern/frontend/src/pages/Success.js`.

**Cách làm:**
1.  Tạo page `src/pages/OrderSuccess/index.jsx`:
    - Hiển thị icon tích xanh lớn.
    - Nút "Về trang chủ" và "Xem đơn hàng".
    - `useEffect`: Xóa giỏ hàng (`dispatch(clearCart())`) khi vào trang này.
2.  Tương tự với `OrderFail`.

---

## 🟢 MỨC ĐỘ 3: HIỆU ỨNG (ANIMATIONS)
*User thắc mắc: "Làm hiệu ứng là làm gì?"*

### **6. Page Transitions (Chuyển trang mượt mà)**
**Hiện trạng:** Đã có component `src/components/AnimatedPage.jsx` nhưng **chưa sử dụng**.
**Công dụng:** Giúp trang web không bị "giật cục" khi chuyển từ Home -> Product.

**Cách làm (Rất đơn giản, chỉ Copy-Paste):**
Mở các file page chính (ví dụ `src/pages/Home/index.jsx`, `src/pages/Product/index.jsx`), bọc toàn bộ nội dung trong `<AnimatedPage>`.

**Ví dụ sửa file `src/pages/Home/index.jsx`:**
```jsx
// Import component có sẵn
import AnimatedPage from '../../components/AnimatedPage';

const Home = () => {
  return (
    // Bọc tất cả trong thẻ này
    <AnimatedPage>
      <div className="home-container">
        <Slider />
        <ProductList />
      </div>
    </AnimatedPage>
  );
};
```
*Làm tương tự cho Login, Register, Cart...*

---

## 🚀 LỊCH TRÌNH THỰC HIỆN
1.  **Bước 1 (Dễ nhất - Nên làm ngay):**
    - Đi vào các page (`Home`, `Product`...), bọc `<AnimatedPage>` như hướng dẫn mục 6. -> *Có ngay hiệu ứng chuyển cảnh đẹp*.
2.  **Bước 2 (Quan trọng):**
    - Setup file `axios.js` (Mục 2).
    - Tạo Skeleton loader (Mục 1) để trang web trông chuyên nghiệp hơn.
3.  **Bước 3 (Tính năng):**
    - Code trang Tìm kiếm và trang Kết quả thanh toán.
