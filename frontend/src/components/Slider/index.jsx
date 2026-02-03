import React from 'react'
import { Link } from 'react-router-dom'
import slide1 from '../../assets/images/banners/slide1.png'
import slide2 from '../../assets/images/banners/slide2.png'

const Slider = () => {
    return (
        <div className='slider-wrapper'>
            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <Link to="/products">
                            <img src={slide1} className="d-block w-100" alt="..." />
                        </Link>
                    </div>
                    <div className="carousel-item">
                        <Link to="/products">
                            <img src={slide2} className="d-block w-100" alt="..." />
                        </Link>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    )
}

export default Slider