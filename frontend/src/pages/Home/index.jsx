import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductCard from '../../features/Product/components/ProductCard'
import Card from '../../components/Card'

import Slider from '../../components/Slider'

import { getAllProducts } from '../../features/Product/productSlice'
import { getAllCategories } from '../../features/Product/categorySlice'
import './Home.css'

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading: productsLoading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCategories());
  }, [dispatch]);

  const featuredProducts = products.slice(0, 3);

  return (
    <>
      <Slider />

      <section className="home-category-section">
        <div className="container">
          <div className="section-header">
            <h2>DANH MỤC MÓN ĂN</h2>
            <hr className="section-underline" />
          </div>
          <div className="row g-3">
            {categories.map((cat, index) => (
              <div key={index} className="col-6 col-md-4 col-lg-3">
                <Link to={`/products?category=${cat.slug}`} className="category-link">
                  <Card className="category-card">
                    <div className="category-icon">
                      <i className={`bi ${cat.icon}`}></i>
                    </div>
                    <h4 className="category-title">{cat.name}</h4>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-product-section">
        <div className="container">
          <div className="section-header">
            <h2>CÓ THỂ BẠN SẼ THÍCH</h2>
            <hr className="section-underline" />
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
                  <ProductCard product={product} />
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
