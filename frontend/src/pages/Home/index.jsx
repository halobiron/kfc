import React from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Layout from '../../components/Layout'
import Slider from '../../components/Slider'
import './Home.css'

const Home = () => {
  // Mock Categories to match KFC Vietnam structure
  const categories = [
    { title: "Món Mới", icon: "bi-star-fill" },
    { title: "Combo 1 Người", icon: "bi-person-fill" },
    { title: "Combo Nhóm", icon: "bi-people-fill" },
    { title: "Gà Rán", icon: "bi-egg-fried" },
    { title: "Burger - Cơm", icon: "bi-hdd-stack" },
    { title: "Thức Uống", icon: "bi-cup-straw" },
  ];

  return (
    <Layout>
      <Slider />

      {/* Category Grid Section */}
      <section className="home-category-section">
        <div className="container">
          <div className="section-header text-start mt-4">
            <h3>DANH MỤC MÓN ĂN</h3>
          </div>
          <div className="row g-3">
            {categories.map((cat, index) => (
              <div key={index} className="col-6 col-md-4 col-lg-3">
                <Link to="/products" className="text-decoration-none text-dark">
                  <div className="category-card">
                    <div className="mock-icon">
                      <i className={`bi ${cat.icon}`}></i>
                    </div>
                    <div className="category-title">{cat.title}</div>
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

          <div className="row">
            <div className="col-md-4">
              <Card />
            </div>
            <div className="col-md-4">
              <Card />
            </div>
            <div className="col-md-4">
              <Card />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Home
