import React from 'react'
import { Link } from 'react-router-dom'
import slide1 from '../../assets/images/banners/slide1.png'
import slide2 from '../../assets/images/banners/slide2.png'

const CAROUSEL_ID = 'carouselExampleControls'
const slides = [slide1, slide2]

const Slider = () => {
  return (
    <div className="slider-wrapper">
      <div id={CAROUSEL_ID} className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {slides.map((slide, index) => (
            <div key={slide} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <Link to="/products">
                <img src={slide} className="d-block w-100" alt={`Banner ${index + 1}`} />
              </Link>
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target={`#${CAROUSEL_ID}`} data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target={`#${CAROUSEL_ID}`} data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  )
}

export default Slider
