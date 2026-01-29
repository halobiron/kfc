# 📋 CHECKLIST HOÀN THIỆN FRONTEND - DỰ ÁN KFC

> **Ngày phân tích:** 29/01/2026 (Updated)  
> **Mục đích:** Đánh giá và đưa ra các điểm cần hoàn thiện frontend cho báo cáo BTL môn CNPM + CSDLPT

---

## 🔍 TỔNG QUAN DỰ ÁN HIỆN TẠI

### ✅ **Điểm mạnh đã có:**
- ✓ Cấu trúc dự án rõ ràng, có tách biệt frontend/backend/admin
- ✓ Sử dụng React 18, React Router v6, Redux Toolkit
- ✓ Có đầy đủ các trang cơ bản: Home, Products, Cart, Checkout, Profile, MyOrders, StoreSystem
- ✓ Form validation với Formik + Yup
- ✓ Responsive design với Bootstrap 5
- ✓ Redux state management cho Cart
- ✓ Coupon/Promotion system đã có data structure
- ✓ FloatingChat component (Zalo, Messenger)
- ✓ Layout component tái sử dụng
- ✓ Có admin area riêng biệt

### ⚠️ **Điểm yếu cần cải thiện:**
- ✗ Thiếu các thư viện UI/UX hiện đại
- ✗ Không có loading states & skeleton screens
- ✗ Thiếu hệ thống thông báo (toast/notification)
- ✗ Chưa có error handling tốt
- ✗ Thiếu animations & transitions
- ✗ Mock data hardcoded, chưa integrate API thật
- ✗ Thiếu nhiều tính năng UX quan trọng

---

## 📊 SO SÁNH VỚI CÁC DỰ ÁN THAM KHẢO

### **1. KFC-CLONE (kfc-clone-by-iesparag)**
**Tech Stack:**
- Chakra UI + Material UI + Bootstrap
- Framer Motion cho animations
- React Bootstrap Icons
- React Scroll
- Redux Thunk

**Điểm nổi bật:**
- Loading states với loader GIF
- Auth context + Redux
- Pickup location component
- Browse categories API integration
- Toast notifications với Chakra UI

---

### **2. KFC-clone-full-stack**
**Tech Stack:**
- Material UI
- Multiple developers collaboration
- Có Cart, Checkout, Payment pages riêng
- Login/Signup pages riêng biệt

**Điểm nổi bật:**
- Success/Fail payment pages
- About, Careers pages
- Search page riêng
- Featured products section
- Favorites component

---

### **3. kfc-mern**
**Tech Stack:**
- Material UI
- React Content Loader (skeleton screens)
- React Toastify
- i18next (internationalization)
- Google Maps API
- React Places Autocomplete
- Redux Persist
- React Owl Carousel
- JWT Decode
- Lodash

**Điểm nổi bật:**
- ⭐ Skeleton loaders cho Hero, Deals, Products
- ⭐ Toast notifications
- ⭐ Đa ngôn ngữ (i18n)
- ⭐ Google Maps integration
- ⭐ Deal sections với loading states
- ⭐ Context API cho deals
- ⭐ Success/Fail payment flows

---

## 🎯 DANH SÁCH CẦN HOÀN THIỆN CHI TIẾT

---

## **I. CẤP ĐỘ QUAN TRỌNG CAO (CRITICAL)** 🔴

### **1. Toast Notification System** 
**Mức độ:** ⭐⭐⭐⭐⭐ (Bắt buộc)

**Vấn đề hiện tại:**
- Dùng `alert()` native trong ProductDetail.jsx: `alert('Đã thêm vào giỏ hàng!')`
- Dùng `alert()` trong Profile.jsx, Cart.jsx, Checkout.jsx
- Dùng `window.confirm()` native
- Không có feedback UI đẹp cho user

**Giải pháp:**
```bash
npm install react-toastify
# hoặc
npm install react-hot-toast
```

**Files cần sửa:**
- `src/pages/ProductDetail/index.jsx` - Thay alert bằng toast
- `src/pages/Cart/index.jsx` - Toast khi xóa item
- `src/pages/Checkout/index.jsx` - Toast khi đặt hàng
- `src/pages/Profile/index.jsx` - Toast khi cập nhật thông tin
- `src/pages/Login/index.jsx` - Toast khi login thành công/thất bại
- `src/pages/Register/index.jsx` - Toast khi đăng ký

**Ví dụ triển khai:**
```jsx
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Trong component
const handleAddToCart = () => {
  dispatch(addToCart({ ...product, quantity }));
  toast.success('Đã thêm vào giỏ hàng!', {
    position: "top-right",
    autoClose: 3000,
  });
};
```

**Lợi ích cho BTL:**
- UI/UX chuyên nghiệp hơn rất nhiều
- Dễ demo và gây ấn tượng
- Giảng viên dễ nhận thấy sự khác biệt

---

### **2. Loading States & Skeleton Screens**
**Mức độ:** ⭐⭐⭐⭐⭐ (Bắt buộc)

**Vấn đề hiện tại:**
- Không có loading indicator khi fetch data
- Các trang render trống trước khi có data
- Trải nghiệm người dùng kém khi network chậm

**Giải pháp:**
```bash
npm install react-content-loader
# hoặc tự tạo skeleton components
```

**Components cần tạo:**
```
src/components/Skeleton/
  ├── ProductCardSkeleton.jsx
  ├── ProductDetailSkeleton.jsx
  ├── CartSkeleton.jsx
  ├── HeroSkeleton.jsx
  └── CategorySkeleton.jsx
```

**Ví dụ triển khai:**
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
    <rect x="10" y="280" rx="3" ry="3" width="100" height="15" />
  </ContentLoader>
);
```

**Files cần cập nhật:**
- `src/pages/Product/index.js` - Thêm loading state
- `src/pages/Home/index.jsx` - Skeleton cho categories & products
- `src/pages/ProductDetail/index.jsx` - Skeleton khi load detail
- `src/pages/Cart/index.jsx` - Skeleton cho cart items
- `src/components/Card/index.jsx` - Hỗ trợ loading prop

**State management:**
```jsx
const [loading, setLoading] = useState(true);
const [products, setProducts] = useState([]);

useEffect(() => {
  setLoading(true);
  fetchProducts()
    .then(data => setProducts(data))
    .finally(() => setLoading(false));
}, []);

return loading ? <ProductCardSkeleton count={6} /> : <ProductGrid products={products} />;
```

---

### **3. Error Handling & 404 Page**
**Mức độ:** ⭐⭐⭐⭐⭐ (Bắt buộc)

**Vấn đề hiện tại:**
- Không có Error Boundary
- Không có 404 Page Not Found
- Không xử lý API errors
- Không có empty states

**Cần tạo:**

**a) Error Boundary Component:**
```jsx
// src/components/ErrorBoundary/index.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Oops! Đã có lỗi xảy ra</h1>
          <p>Vui lòng tải lại trang hoặc liên hệ hỗ trợ.</p>
          <button onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**b) 404 Not Found Page:**
```jsx
// src/pages/NotFound/index.jsx
const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="not-found">
        <img src={kfcLogo} alt="KFC" />
        <h1>404</h1>
        <h2>Không tìm thấy trang</h2>
        <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
        <button onClick={() => navigate('/')}>
          Về trang chủ
        </button>
      </div>
    </Layout>
  );
};
```

**c) Empty State Component:**
```jsx
// src/components/EmptyState/index.jsx
const EmptyState = ({ icon, title, description, actionText, onAction }) => (
  <div className="empty-state">
    <div className="empty-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
    {actionText && <button onClick={onAction}>{actionText}</button>}
  </div>
);
```

**Cập nhật App.js:**
```jsx
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* ... existing routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
```

---

### **4. API Integration & Axios Setup**
**Mức độ:** ⭐⭐⭐⭐⭐ (Bắt buộc)

**Vấn đề hiện tại:**
- Tất cả data đều hardcoded
- Không có axios interceptor
- Không có centralized API service
- Không có error handling cho API calls

**Giải pháp:**

**a) Cài đặt:**
```bash
npm install axios
```

**b) Tạo Axios Instance:**
```javascript
// src/utils/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default axiosInstance;
```

**c) API Services:**
```javascript
// src/services/productService.js
import axios from '../utils/axios';

export const productService = {
  getAll: () => axios.get('/products'),
  getById: (id) => axios.get(`/products/${id}`),
  getByCategory: (category) => axios.get(`/products/category/${category}`),
  search: (query) => axios.get(`/products/search?q=${query}`),
};

// src/services/orderService.js
export const orderService = {
  create: (orderData) => axios.post('/orders', orderData),
  getMyOrders: () => axios.get('/orders/my'),
  getById: (id) => axios.get(`/orders/${id}`),
  cancel: (id) => axios.put(`/orders/${id}/cancel`),
};

// src/services/authService.js
export const authService = {
  login: (credentials) => axios.post('/auth/login', credentials),
  register: (userData) => axios.post('/auth/register', userData),
  logout: () => axios.post('/auth/logout'),
  getProfile: () => axios.get('/auth/profile'),
};
```

**d) Environment Variables:**
```bash
# .env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
```

**e) Cập nhật Redux Slices:**
```javascript
// src/redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await productService.getAll();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
```

---

### **5. Animations & Transitions**
**Mức độ:** ⭐⭐⭐⭐ (Quan trọng)

**Vấn đề hiện tại:**
- UI tĩnh, không có hiệu ứng chuyển động
- Thiếu hover effects mượt mà
- Không có page transitions

**Giải pháp:**
```bash
npm install framer-motion
```

**Triển khai:**

**a) Page Transitions:**
```jsx
// src/components/Layout/index.jsx
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const Layout = ({ children }) => (
  <>
    <Header />
    <motion.main
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.main>
    <Footer />
  </>
);
```

**b) Card Animations:**
```jsx
// src/components/Card/index.jsx
import { motion } from 'framer-motion';

const Card = ({ product }) => (
  <motion.div
    className="card"
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {/* Card content */}
  </motion.div>
);
```

**c) Modal Animations:**
```jsx
// src/components/Modal/index.jsx
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="modal"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
```

**d) List Animations:**
```jsx
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

<motion.div variants={listVariants} initial="hidden" animate="visible">
  {products.map(product => (
    <motion.div key={product.id} variants={itemVariants}>
      <ProductCard product={product} />
    </motion.div>
  ))}
</motion.div>
```

**e) CSS Transitions (Alternative/Supplement):**
```css
/* src/App.css */
.page-transition-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-transition-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms, transform 300ms;
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}

.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: scale(1.05);
}

.btn:active {
  transform: scale(0.98);
}
```

---

## **II. CẤP ĐỘ QUAN TRỌNG TRUNG BÌNH (IMPORTANT)** 🟡

### **6. Search Page & Advanced Filters**
**Mức độ:** ⭐⭐⭐⭐

**Vấn đề hiện tại:**
- Search chỉ có trên Product page
- Không có Search page riêng
- Thiếu advanced filters

**Cần tạo:**
```
src/pages/Search/
  ├── index.jsx
  └── Search.css
```

**Features:**
- Search input với debounce
- Search suggestions/autocomplete
- Recent searches
- Popular searches
- Filter by: price range, category, rating
- Sort by: price, popularity, newest

**Ví dụ:**
```jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash/debounce';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: 0,
    maxPrice: 1000000,
    sortBy: 'relevance'
  });

  const debouncedSearch = debounce((searchQuery) => {
    setLoading(true);
    productService.search(searchQuery, filters)
      .then(data => setResults(data))
      .finally(() => setLoading(false));
  }, 500);

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    }
  }, [query, filters]);

  return (
    <Layout>
      <div className="search-page">
        <div className="search-header">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm món ăn..."
            className="search-input-large"
          />
        </div>
        
        <div className="search-content">
          <aside className="search-filters">
            {/* Filters UI */}
          </aside>
          
          <main className="search-results">
            {loading ? (
              <ProductGridSkeleton />
            ) : results.length > 0 ? (
              <ProductGrid products={results} />
            ) : (
              <EmptyState 
                title="Không tìm thấy kết quả"
                description={`Không có sản phẩm nào khớp với "${query}"`}
              />
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};
```

**Cập nhật Header:**
```jsx
// src/components/Header/index.jsx
const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header>
      <form onSubmit={handleSearch}>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm..."
        />
        <button type="submit">
          <i className="bi bi-search"></i>
        </button>
      </form>
    </header>
  );
};
```

**Thêm route:**
```jsx
// src/App.js
<Route path="/search" element={<Search />} />
```

---

### **7. Deals/Promotions Section**
**Mức độ:** ⭐⭐⭐⭐

**Vấn đề hiện tại:**
- Có data coupons nhưng không có UI hiển thị prominently
- Không có deals section trên home page
- Thiếu countdown timer cho deals

**Cần tạo:**
```
src/components/Deals/
  ├── DealCard.jsx
  ├── DealSlider.jsx
  ├── CountdownTimer.jsx
  └── deals.css
```

**a) Deal Card Component:**
```jsx
// src/components/Deals/DealCard.jsx
const DealCard = ({ deal }) => {
  const { title, description, image, discount, code, expiresAt } = deal;
  
  return (
    <motion.div 
      className="deal-card"
      whileHover={{ scale: 1.02 }}
    >
      <div className="deal-badge">
        -{discount}%
      </div>
      <img src={image} alt={title} />
      <div className="deal-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <CountdownTimer expiresAt={expiresAt} />
        <div className="deal-code">
          Mã: <span>{code}</span>
        </div>
        <button className="btn-apply-deal">
          Áp dụng ngay
        </button>
      </div>
    </motion.div>
  );
};
```

**b) Countdown Timer:**
```jsx
// src/components/Deals/CountdownTimer.jsx
const CountdownTimer = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(expiresAt) - new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return null;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (!timeLeft) return <span className="deal-expired">Đã hết hạn</span>;

  return (
    <div className="countdown-timer">
      <div className="time-unit">
        <span className="time-value">{timeLeft.days}</span>
        <span className="time-label">Ngày</span>
      </div>
      <div className="time-separator">:</div>
      <div className="time-unit">
        <span className="time-value">{timeLeft.hours}</span>
        <span className="time-label">Giờ</span>
      </div>
      <div className="time-separator">:</div>
      <div className="time-unit">
        <span className="time-value">{timeLeft.minutes}</span>
        <span className="time-label">Phút</span>
      </div>
      <div className="time-separator">:</div>
      <div className="time-unit">
        <span className="time-value">{timeLeft.seconds}</span>
        <span className="time-label">Giây</span>
      </div>
    </div>
  );
};
```

**c) Deals Section trên Home:**
```jsx
// Trong src/pages/Home/index.jsx
const Home = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch deals from API
    fetchDeals().then(data => {
      setDeals(data);
      setLoading(false);
    });
  }, []);

  return (
    <Layout>
      <Slider />
      
      {/* DEALS SECTION */}
      <section className="deals-section py-5">
        <div className="container">
          <h2 className="section-title">ƯU ĐÃI HOT</h2>
          {loading ? (
            <DealsSkeleton />
          ) : (
            <div className="deals-grid">
              {deals.map(deal => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Existing categories and products */}
    </Layout>
  );
};
```

---

### **8. Google Maps Integration**
**Mức độ:** ⭐⭐⭐⭐

**Vấn đề hiện tại:**
- StoreSystem page chỉ list text
- Không có map visualization
- Không có store locator

**Giải pháp:**
```bash
npm install @react-google-maps/api
```

**Triển khai:**
```jsx
// src/pages/StoreSystem/index.jsx
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const StoreSystem = () => {
  const [selectedStore, setSelectedStore] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [stores, setStores] = useState([
    {
      id: 1,
      name: 'KFC Vincom Bà Triệu',
      address: '191 Bà Triệu, Hai Bà Trưng, Hà Nội',
      phone: '1900 1166',
      hours: '9:00 - 22:00',
      position: { lat: 21.0118, lng: 105.8479 }
    },
    // ... more stores
  ]);

  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };

  const center = userLocation || { lat: 21.0285, lng: 105.8542 }; // Hà Nội

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Error getting location:', error)
      );
    }
  }, []);

  const findNearestStore = () => {
    if (!userLocation) {
      toast.warning('Vui lòng cho phép truy cập vị trí');
      return;
    }

    // Calculate distances and find nearest
    const storesWithDistance = stores.map(store => ({
      ...store,
      distance: calculateDistance(userLocation, store.position)
    }));

    const nearest = storesWithDistance.sort((a, b) => a.distance - b.distance)[0];
    setSelectedStore(nearest);
    // Center map on nearest store
  };

  return (
    <Layout>
      <div className="store-system-page">
        <div className="container-fluid">
          <div className="row">
            {/* Left: Store List */}
            <div className="col-lg-4">
              <div className="store-list">
                <div className="search-store">
                  <input 
                    type="text" 
                    placeholder="Tìm cửa hàng gần bạn..."
                  />
                  <button onClick={findNearestStore}>
                    <i className="bi bi-geo-alt-fill"></i> Tìm gần tôi
                  </button>
                </div>

                <div className="stores-container">
                  {stores.map(store => (
                    <div 
                      key={store.id}
                      className={`store-item ${selectedStore?.id === store.id ? 'active' : ''}`}
                      onClick={() => setSelectedStore(store)}
                    >
                      <h4>{store.name}</h4>
                      <p><i className="bi bi-geo-alt"></i> {store.address}</p>
                      <p><i className="bi bi-telephone"></i> {store.phone}</p>
                      <p><i className="bi bi-clock"></i> {store.hours}</p>
                      <button className="btn-direction">Chỉ đường</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Map */}
            <div className="col-lg-8">
              <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={13}
                >
                  {/* User location marker */}
                  {userLocation && (
                    <Marker
                      position={userLocation}
                      icon={{
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                      }}
                    />
                  )}

                  {/* Store markers */}
                  {stores.map(store => (
                    <Marker
                      key={store.id}
                      position={store.position}
                      onClick={() => setSelectedStore(store)}
                      icon={{
                        url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                      }}
                    />
                  ))}

                  {/* Info Window */}
                  {selectedStore && (
                    <InfoWindow
                      position={selectedStore.position}
                      onCloseClick={() => setSelectedStore(null)}
                    >
                      <div className="store-info-window">
                        <h4>{selectedStore.name}</h4>
                        <p>{selectedStore.address}</p>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.position.lat},${selectedStore.position.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Chỉ đường
                        </a>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

function calculateDistance(pos1, pos2) {
  const R = 6371; // Earth radius in km
  const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
  const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

---

### **9. Payment Success/Fail Pages**
**Mức độ:** ⭐⭐⭐⭐

**Vấn đề hiện tại:**
- Checkout page không redirect đến success/fail pages
- Thiếu confirmation UI
- Không có order tracking info sau đặt hàng

**Cần tạo:**
```
src/pages/PaymentSuccess/
  ├── index.jsx
  └── PaymentSuccess.css

src/pages/PaymentFail/
  ├── index.jsx
  └── PaymentFail.css
```

**a) Success Page:**
```jsx
// src/pages/PaymentSuccess/index.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Confetti from 'react-confetti';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Optional: Play success sound
    // const audio = new Audio('/sounds/success.mp3');
    // audio.play();
  }, []);

  return (
    <Layout>
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={500}
      />
      
      <div className="payment-success">
        <div className="success-card">
          <div className="success-icon">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          
          <h1>Đặt hàng thành công!</h1>
          <p className="order-id">Mã đơn hàng: <strong>{orderId}</strong></p>
          
          <div className="success-message">
            <p>Cảm ơn bạn đã đặt hàng tại KFC!</p>
            <p>Chúng tôi sẽ giao hàng trong vòng 30-45 phút.</p>
          </div>

          <div className="order-tracking">
            <h3>Theo dõi đơn hàng</h3>
            <div className="tracking-steps">
              <div className="step completed">
                <div className="step-icon">✓</div>
                <div className="step-label">Đặt hàng</div>
              </div>
              <div className="step active">
                <div className="step-icon">2</div>
                <div className="step-label">Đang chuẩn bị</div>
              </div>
              <div className="step">
                <div className="step-icon">3</div>
                <div className="step-label">Đang giao</div>
              </div>
              <div className="step">
                <div className="step-icon">4</div>
                <div className="step-label">Hoàn thành</div>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/my-orders')}
            >
              Xem đơn hàng
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/')}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
```

**b) Fail Page:**
```jsx
// src/pages/PaymentFail/index.jsx
const PaymentFail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('error') || 'Đã có lỗi xảy ra';

  return (
    <Layout>
      <div className="payment-fail">
        <div className="fail-card">
          <div className="fail-icon">
            <i className="bi bi-x-circle-fill"></i>
          </div>
          
          <h1>Thanh toán thất bại</h1>
          
          <div className="error-message">
            <p>{errorMessage}</p>
            <p>Vui lòng thử lại hoặc chọn phương thức thanh toán khác.</p>
          </div>

          <div className="common-issues">
            <h3>Nguyên nhân thường gặp:</h3>
            <ul>
              <li>Số dư tài khoản không đủ</li>
              <li>Thông tin thẻ không chính xác</li>
              <li>Ngân hàng từ chối giao dịch</li>
              <li>Phiên làm việc hết hạn</li>
            </ul>
          </div>

          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/checkout')}
            >
              Thử lại
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => navigate('/cart')}
            >
              Về giỏ hàng
            </button>
          </div>

          <div className="support-section">
            <p>Cần hỗ trợ? Liên hệ: <a href="tel:19001166">1900 1166</a></p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
```

**c) Cập nhật Checkout để redirect:**
```jsx
// src/pages/Checkout/index.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const orderData = {
      items: cartItems,
      deliveryType,
      address: deliveryType === 'delivery' ? formData : null,
      store: deliveryType === 'pickup' ? selectedStore : null,
      paymentMethod,
      coupon: appliedCoupon?.code,
      total
    };

    const response = await orderService.create(orderData);

    // Clear cart
    dispatch(clearCart());

    // Redirect to success page
    navigate(`/payment-success?orderId=${response.orderId}`);
    
    toast.success('Đặt hàng thành công!');
    
  } catch (error) {
    console.error('Checkout error:', error);
    navigate(`/payment-fail?error=${encodeURIComponent(error.message)}`);
    toast.error('Đặt hàng thất bại. Vui lòng thử lại!');
  } finally {
    setIsSubmitting(false);
  }
};
```

**d) Thêm routes:**
```jsx
// src/App.js
<Route path="/payment-success" element={<PaymentSuccess />} />
<Route path="/payment-fail" element={<PaymentFail />} />
```

**e) Optional - Confetti effect:**
```bash
npm install react-confetti
```

---

### **10. Reviews & Ratings System**
**Mức độ:** ⭐⭐⭐

**Vấn đề hiện tại:**
- Product detail không có reviews
- Không có rating system
- Thiếu social proof

**Cần tạo:**
```
src/components/Reviews/
  ├── ReviewList.jsx
  ├── ReviewForm.jsx
  ├── StarRating.jsx
  └── reviews.css
```

**Triển khai:**

**a) Star Rating Component:**
```jsx
// src/components/Reviews/StarRating.jsx
const StarRating = ({ rating, maxRating = 5, size = 20, onRate, readonly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[...Array(maxRating)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <span
            key={index}
            className={`star ${ratingValue <= (hover || rating) ? 'filled' : ''}`}
            onClick={() => !readonly && onRate && onRate(ratingValue)}
            onMouseEnter={() => !readonly && setHover(ratingValue)}
            onMouseLeave={() => !readonly && setHover(0)}
            style={{ 
              fontSize: size,
              cursor: readonly ? 'default' : 'pointer'
            }}
          >
            ★
          </span>
        );
      })}
      {rating && <span className="rating-text">{rating.toFixed(1)}</span>}
    </div>
  );
};
```

**b) Review Form:**
```jsx
// src/components/Reviews/ReviewForm.jsx
const ReviewForm = ({ productId, onSubmitSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.warning('Vui lòng chọn đánh giá sao');
      return;
    }

    setLoading(true);

    try {
      await reviewService.create({
        productId,
        rating,
        comment
      });

      toast.success('Cảm ơn bạn đã đánh giá!');
      setRating(0);
      setComment('');
      onSubmitSuccess && onSubmitSuccess();
      
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Đánh giá sản phẩm</h3>
      
      <div className="form-group">
        <label>Chất lượng sản phẩm</label>
        <StarRating rating={rating} onRate={setRating} size={30} />
      </div>

      <div className="form-group">
        <label>Nhận xét của bạn</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
          rows={4}
          maxLength={500}
        />
        <small>{comment.length}/500</small>
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
      </button>
    </form>
  );
};
```

**c) Review List:**
```jsx
// src/components/Reviews/ReviewList.jsx
const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getByProduct(productId);
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ReviewsSkeleton />;

  return (
    <div className="reviews-section">
      {stats && (
        <div className="reviews-summary">
          <div className="average-rating">
            <div className="rating-number">{stats.averageRating.toFixed(1)}</div>
            <StarRating rating={stats.averageRating} readonly size={24} />
            <div className="total-reviews">{stats.totalReviews} đánh giá</div>
          </div>

          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className="rating-bar">
                <span className="star-label">{star} ★</span>
                <div className="bar">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${(stats.distribution[star] / stats.totalReviews) * 100}%` 
                    }}
                  />
                </div>
                <span className="count">{stats.distribution[star]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <div className="reviewer-avatar">
                  {review.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="reviewer-info">
                  <div className="reviewer-name">{review.user.name}</div>
                  <StarRating rating={review.rating} readonly size={16} />
                  <div className="review-date">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
              <div className="review-body">
                <p>{review.comment}</p>
              </div>
              {review.images && review.images.length > 0 && (
                <div className="review-images">
                  {review.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Review ${idx + 1}`} />
                  ))}
                </div>
              )}
              <div className="review-actions">
                <button className="helpful-btn">
                  <i className="bi bi-hand-thumbs-up"></i> Hữu ích ({review.helpfulCount})
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState 
            title="Chưa có đánh giá"
            description="Hãy là người đầu tiên đánh giá sản phẩm này!"
          />
        )}
      </div>
    </div>
  );
};
```

**d) Tích hợp vào ProductDetail:**
```jsx
// src/pages/ProductDetail/index.jsx
const ProductDetail = () => {
  // ... existing code

  return (
    <Layout>
      <div className="product-detail-wrapper">
        {/* Existing product info */}

        {/* Add tabs for description, reviews, etc */}
        <div className="product-tabs">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Mô tả
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Đánh giá
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-content">
                <p>{product.longDescription}</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-content">
                <ReviewList productId={product.id} />
                <ReviewForm productId={product.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
```

---

### **11. Favorites/Wishlist**
**Mức độ:** ⭐⭐⭐

**Cần tạo:**
```
src/pages/Favorites/
  ├── index.jsx
  └── Favorites.css

src/redux/slices/
  └── favoritesSlice.js
```

**Triển khai:**

**a) Redux Slice:**
```javascript
// src/redux/slices/favoritesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: JSON.parse(localStorage.getItem('favorites')) || [],
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const product = action.payload;
      const existingIndex = state.items.findIndex(item => item.id === product.id);
      
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(product);
      }
      
      localStorage.setItem('favorites', JSON.stringify(state.items));
    },
    clearFavorites: (state) => {
      state.items = [];
      localStorage.removeItem('favorites');
    }
  }
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
```

**b) Heart Button Component:**
```jsx
// src/components/FavoriteButton/index.jsx
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../../redux/slices/favoritesSlice';
import { motion } from 'framer-motion';

const FavoriteButton = ({ product, size = 24, className = '' }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorites.items);
  const isFavorite = favorites.some(item => item.id === product.id);

  const handleToggle = (e) => {
    e.stopPropagation(); // Prevent card click
    e.preventDefault();
    
    dispatch(toggleFavorite(product));
    
    if (!isFavorite) {
      toast.success('Đã thêm vào yêu thích!');
    } else {
      toast.info('Đã xóa khỏi yêu thích!');
    }
  };

  return (
    <motion.button
      className={`favorite-button ${isFavorite ? 'active' : ''} ${className}`}
      onClick={handleToggle}
      whileTap={{ scale: 0.8 }}
      whileHover={{ scale: 1.1 }}
    >
      <i 
        className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`}
        style={{ fontSize: size }}
      />
    </motion.button>
  );
};
```

**c) Favorites Page:**
```jsx
// src/pages/Favorites/index.jsx
const Favorites = () => {
  const favorites = useSelector(state => state.favorites.items);
  const dispatch = useDispatch();

  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc muốn xóa tất cả món yêu thích?')) {
      dispatch(clearFavorites());
      toast.success('Đã xóa tất cả!');
    }
  };

  return (
    <Layout>
      <div className="favorites-page">
        <div className="container py-5">
          <div className="page-header">
            <h1>Món yêu thích</h1>
            {favorites.length > 0 && (
              <button className="btn-clear-all" onClick={handleClearAll}>
                Xóa tất cả
              </button>
            )}
          </div>

          {favorites.length > 0 ? (
            <div className="row g-4">
              {favorites.map(product => (
                <div key={product.id} className="col-md-4 col-sm-6">
                  <Card product={product} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<i className="bi bi-heart" style={{ fontSize: 64 }}></i>}
              title="Chưa có món yêu thích"
              description="Hãy thêm những món ăn bạn thích để dễ dàng đặt hàng sau này!"
              actionText="Khám phá thực đơn"
              onAction={() => navigate('/products')}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};
```

**d) Thêm vào Card Component:**
```jsx
// src/components/Card/index.jsx
const Card = ({ product }) => {
  return (
    <div className="card">
      <FavoriteButton 
        product={product} 
        className="card-favorite-btn"
      />
      {/* Existing card content */}
    </div>
  );
};
```

**e) Thêm route và reducer:**
```jsx
// src/App.js
<Route path="/favorites" element={<Favorites />} />

// src/redux/store.js
import favoritesReducer from './slices/favoritesSlice';

export default configureStore({
  reducer: {
    cart: cartReducer,
    favorites: favoritesReducer, // Add this
  },
});
```

---

## **III. CẤP ĐỘ NÂNG CAO (NICE TO HAVE)** 🟢

### **12. Internationalization (i18n)**
**Mức độ:** ⭐⭐⭐

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

**Setup:**
```javascript
// src/i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationVI from './locales/vi/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
  vi: { translation: translationVI },
  en: { translation: translationEN }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
```

**Translation files:**
```json
// src/i18n/locales/vi/translation.json
{
  "header": {
    "menu": "Thực Đơn",
    "stores": "Cửa hàng",
    "cart": "Giỏ hàng",
    "login": "Đăng nhập"
  },
  "home": {
    "welcome": "Chào mừng đến KFC",
    "deals": "Ưu đãi hot"
  }
}

// src/i18n/locales/en/translation.json
{
  "header": {
    "menu": "Menu",
    "stores": "Stores",
    "cart": "Cart",
    "login": "Login"
  },
  "home": {
    "welcome": "Welcome to KFC",
    "deals": "Hot deals"
  }
}
```

**Usage:**
```jsx
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header>
      <nav>
        <Link to="/products">{t('header.menu')}</Link>
        <Link to="/stores">{t('header.stores')}</Link>
      </nav>
      
      <div className="language-switcher">
        <button onClick={() => changeLanguage('vi')}>🇻🇳 VI</button>
        <button onClick={() => changeLanguage('en')}>🇬🇧 EN</button>
      </div>
    </header>
  );
};
```

---

### **13. Social Login (Google, Facebook)**
**Mức độ:** ⭐⭐⭐

```bash
npm install @react-oauth/google react-facebook-login
```

**Google Login:**
```jsx
// src/pages/Login/index.jsx
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

const Login = () => {
  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwt_decode(credentialResponse.credential);
    console.log(decoded);
    
    // Send to your backend
    authService.loginWithGoogle(credentialResponse.credential)
      .then(response => {
        localStorage.setItem('token', response.token);
        navigate('/');
        toast.success('Đăng nhập thành công!');
      })
      .catch(error => {
        toast.error('Đăng nhập thất bại!');
      });
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="login-form">
        {/* Existing form */}
        
        <div className="social-login">
          <p>Hoặc đăng nhập với:</p>
          
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Đăng nhập Google thất bại')}
            useOneTap
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};
```

---

### **14. PWA (Progressive Web App)**
**Mức độ:** ⭐⭐

**Update manifest.json:**
```json
{
  "short_name": "KFC VN",
  "name": "KFC Vietnam",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#e4002b",
  "background_color": "#ffffff"
}
```

**Service Worker:**
```javascript
// src/serviceWorkerRegistration.js
// (Already exists, just need to enable it in index.js)

// src/index.js
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Change from unregister() to register()
serviceWorkerRegistration.register();
```

---

### **15. Performance Optimizations**
**Mức độ:** ⭐⭐⭐

**a) Image Lazy Loading:**
```jsx
// src/components/LazyImage/index.jsx
import { useState, useEffect, useRef } from 'react';

const LazyImage = ({ src, alt, placeholder, ...props }) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, setImageRef] = useState();

  useEffect(() => {
    let observer;
    
    if (imageRef && imageSrc === placeholder) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(imageRef);
            }
          });
        },
        { threshold: 0.01 }
      );
      observer.observe(imageRef);
    }

    return () => {
      if (observer && observer.unobserve && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [src, imageSrc, imageRef, placeholder]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      {...props}
    />
  );
};
```

**b) Code Splitting:**
```jsx
// src/App.js
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner';

const Home = lazy(() => import('./pages/Home'));
const Product = lazy(() => import('./pages/Product'));
const Cart = lazy(() => import('./pages/Cart'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          {/* ... */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

**c) React.memo for components:**
```jsx
// src/components/Card/index.jsx
import { memo } from 'react';

const Card = memo(({ product }) => {
  // Component logic
}, (prevProps, nextProps) => {
  return prevProps.product.id === nextProps.product.id;
});
```

**d) useMemo & useCallback:**
```jsx
const Product = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    // JSX
  );
};
```

---

### **16. Testing**
**Mức độ:** ⭐⭐

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Example test:**
```javascript
// src/components/Card/__tests__/Card.test.js
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Card from '../index';

const mockStore = configureStore([]);

describe('Card Component', () => {
  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 50000,
    image: 'test.jpg'
  };

  test('renders product name', () => {
    const store = mockStore({ cart: { items: [] } });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Card product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  test('displays correct price', () => {
    const store = mockStore({ cart: { items: [] } });
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Card product={mockProduct} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/50.000₫/i)).toBeInTheDocument();
  });
});
```

---

## **IV. TÍNH NĂNG "PRO" (DỰA TRÊN KFC REAL - ĐỂ ĐẠT ĐIỂM TUYỆT ĐỐI)** 💎

> **Lưu ý:** Đây là những tính năng tinh tế mà các trang web bài tập lớn thường bỏ qua, nhưng lại là tiêu chuẩn của các ứng dụng ordering chuyên nghiệp như KFC, McDonald's.

### **17. Sticky Category Navigation (Thanh menu dính)**
**Mức độ:** ⭐⭐⭐ (UX cực tốt)

**Vấn đề:** 
- Trang thực đơn rất dài, user cuộn xuống dưới rồi muốn đổi danh mục phải cuộn ngược lên đầu trang.
- Mất thời gian và gây khó chịu.

**Giải pháp:**
- Khi cuộn qua header, thanh danh mục (Gà Rán, Burger, Cơm...) sẽ dính (sticky) ở ngay dưới header.
- Click vào danh mục sẽ scroll mượt (smooth scroll) đến section tương ứng.
- Đang xem section nào thì tab đó active.

**Triển khai:**
```css
.category-filter.sticky {
  position: sticky;
  top: 80px; /* Chiều cao header */
  z-index: 100;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
```

### **18. Advanced Product Customization (Tùy chỉnh món chuyên sâu)**
**Mức độ:** ⭐⭐⭐⭐⭐ (Wow factor)

**Vấn đề:**
- Hiện tại chỉ thêm món vào giỏ.
- KFC thật cho phép chọn: Miếng gà (Đùi/Cánh/Ức), Đổi món đi kèm (Khoai -> Salad), Upsize nước.

**Cần làm:** Modal chọn món chi tiết
- **Radio options:** Chọn mức độ cay (Cay/Không cay).
- **Checkbox addons:** Thêm phô mai, thêm sốt.
- **Drink selection:** Đổi Pepsi -> 7Up -> Trà đào (có tính tiền chênh lệch).
- **Note:** Ghi chú cho đầu bếp (ví dụ: "Ít đá", "Nhiều tương").

**UI:** Sử dụng Modal pop-up khi bấm "Thêm vào giỏ".

### **19. Nutrition Information (Thông tin dinh dưỡng)**
**Mức độ:** ⭐⭐⭐ (Chuyên nghiệp)

**Giải pháp:**
- Thêm icon ℹ️ nhỏ ở góc món ăn.
- Hover hoặc click vào hiện popup: Calories, Protein, Fat.
- Dữ liệu có thể fake nhưng UI phải có.
- **Tác dụng:** Giảng viên sẽ đánh giá rất cao độ chi tiết này.

### **20. Re-order (Đặt lại đơn cũ)**
**Mức độ:** ⭐⭐⭐⭐ (Tiện ích)

**Vấn đề:**
- User thường có xu hướng đặt lại món quen thuộc.
- Vào lịch sử đơn hàng chỉ để xem.

**Giải pháp:**
- Trang `MyOrders`: Thêm nút "Đặt lại đơn này".
- Logic: Add tất cả items của đơn đó vào Cart hiện tại -> Redirect sang Checkout.

### **21. Mobile Bottom Navigation**
**Mức độ:** ⭐⭐⭐⭐ (Mobile First)

**Vấn đề:**
- Trên điện thoại, menu hamburger ở trên cùng khó với tay.

**Giải pháp:**
- Ẩn header menu trên mobile.
- Hiện thanh Bottom Navigation cố định dưới cùng màn hình.
- Các tabs: **Trang chủ | Thực đơn | Khuyến mãi | Tài khoản**.
- Nút **Giỏ hàng** nổi (Floating Action Button) ở giữa.

---


## 📝 **CHECKLIST THỰC HIỆN ƯU TIÊN**

### **Tuần 1: Core Improvements** (Bắt buộc - Critical)
- [ ] Cài đặt react-toastify và thay thế tất cả alert()
- [ ] Tạo Loading skeleton components
- [ ] Setup axios với interceptors
- [ ] Tạo Error Boundary và 404 page
- [ ] Thêm empty states cho các pages

### **Tuần 2: UX Enhancements** (Quan trọng - Important)
- [ ] Implement Framer Motion cho animations
- [ ] Tạo Search page với filters
- [ ] Thêm Deals section với countdown timer
- [ ] Tạo Payment Success/Fail pages
- [ ] Cập nhật Checkout flow

### **Tuần 3: Advanced Features** (Tùy chọn - Nice to have)
- [ ] Google Maps integration cho StoreSystem
- [ ] Reviews & Ratings system
- [ ] Favorites/Wishlist feature
- [ ] i18n setup (optional)
- [ ] Social login (optional)

### **Tuần 4: "PRO" Features (Để lấy điểm 10)**
- [ ] Sticky Category bar (Dễ làm, hiệu quả cao)
- [ ] Product Customization Modal (Quan trọng nhất)
- [ ] Re-order function
- [ ] Mobile Bottom Navigation
- [ ] Nutrition Info popover

### **Tuần 4: Polish & Testing**
- [ ] Performance optimization
- [ ] Responsive testing
- [ ] Cross-browser testing
- [ ] Write basic tests
- [ ] Documentation

---

## 🎓 **LỢI ÍCH CHO BÁO CÁO BTL**

### **Điểm cộng khi có đầy đủ:**
1. **UX/UI hiện đại** - Toast, skeleton, animations
2. **Error handling tốt** - Professional error management
3. **Loading states** - Better user experience
4. **Advanced features** - Maps, reviews, favorites
5. **Code organization** - Clean architecture
6. **Performance** - Optimized loading
7. **Accessibility** - Better for all users
8. **Testing** - Code quality assurance

### **Demo Points:**
- Toast notifications rất dễ demo và gây ấn tượng
- Loading skeletons cho thấy attention to detail
- Animations làm app trông professional
- Error handling cho thấy tư duy comprehensive
- Maps integration là wow factor

---

## 🚀 **SCRIPT CÀI ĐẶT NHANH**

```bash
# Core Dependencies
npm install react-toastify framer-motion react-content-loader axios

# Advanced Features
npm install @react-google-maps/api lodash

# Optional
npm install i18next react-i18next i18next-browser-languagedetector
npm install @react-oauth/google react-facebook-login
npm install react-confetti

# Development
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

---

## 📊 **KẾT LUẬN**

Dự án frontend của bạn có **nền tảng tốt** với:
- ✅ Structure rõ ràng
- ✅ Redux state management
- ✅ Routing đầy đủ
- ✅ Form validation
- ✅ Basic responsive

**Cần bổ sung ngay** để đạt điểm cao:
1. Toast notifications (Bắt buộc)
2. Loading states (Bắt buộc)
3. Error handling (Bắt buộc)
4. Animations (Quan trọng)
5. API integration (Quan trọng)

**Bonus points:**
- Google Maps
- Reviews system
- Favorites
- i18n
- Social login

---

**Thời gian ước tính hoàn thiện:** 3-4 tuần (tùy team size)

**Mức độ ưu tiên:** Tập trung vào **Critical** trước, sau đó **Important**, cuối cùng mới **Nice to have**

**Chúc bạn thành công với BTL! 🎉**
