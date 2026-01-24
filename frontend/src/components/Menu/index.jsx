import React, {useState} from 'react'
import Modal from '../Modal'
import { useSelector } from 'react-redux'

const Menu = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const cartQuantity = useSelector(state => state.cart.totalQuantity);

    return (
        <>
            <div className='menu-wrapper'>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="/">KFC</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/">Trang chủ</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/products">Sản phẩm</a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Danh mục
                                    </a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <li><a className="dropdown-item" href="/">Combo</a></li>
                                        <li><a className="dropdown-item" href="/">Gà rán</a></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><a className="dropdown-item" href="/">Khác</a></li>
                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link disabled" href="/" tabIndex="-1" aria-disabled="true">Khách</a>
                                </li>
                            </ul>
                                <button className="btn btn-danger btn-cart-counter" type="submit" onClick={() => setIsModalOpen(true)}>{cartQuantity}</button>
                        </div>
                    </div>
                </nav>
            </div>
            {isModalOpen && <Modal closeModal={() => setIsModalOpen(false)}/>}
        </>
    )
}

export default Menu