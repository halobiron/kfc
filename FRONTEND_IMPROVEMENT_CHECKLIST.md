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
