import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Card from '../../features/Product/components/ProductCard'

import Slider from '../../components/Slider'

import { getAllProducts } from '../../features/Product/productSlice'
import { getAllCategories } from '../../features/Product/categorySlice'
import { getAllCoupons } from '../../features/Cart/couponSlice'
import './Home.css'

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading: productsLoading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  useSelector((state) => state.coupons);

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCategories());
    dispatch(getAllCoupons());
  }, [dispatch]);


  // Get first 3 products from API
  const featuredProducts = Array.isArray(products) ? products.slice(0, 3) : [];

  return (
    <>
      <Slider />

      {/* Category Grid Section */}
      <section className="home-category-section">
        <div className="container">
          <div className="section-header text-center mt-4">
            <h3>DANH MỤC MÓN ĂN</h3>
            <hr className="w-25 mx-auto text-danger border-2 opacity-100" />
          </div>
          <div className="row g-3">
            {categories.map((cat, index) => (
              <div key={index} className="col-6 col-md-4 col-lg-3">
                <Link to={`/products?category=${cat.slug}`} className="text-decoration-none text-dark">
                  <div className="category-card">
                    <div className="mock-icon">
                      <i className={`bi ${cat.icon}`}></i>
                    </div>
                    <div className="category-title">{cat.name}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Deals / Recommendations Section */}
      <section className="home-product-section py-5">
        <div className="container">
          <div className="section-header text-center">
            <h3>CÓ THỂ BẠN SẼ THÍCH</h3>
            <hr className="w-25 mx-auto text-danger border-2 opacity-100" />
          </div>

          {productsLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {featuredProducts.map(product => (
                <div key={product._id} className="col-md-4">
                  <Card product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Home
