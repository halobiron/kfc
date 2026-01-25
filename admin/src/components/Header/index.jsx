import React from 'react'
import Nav from '../Nav'
const Header = () => {
  return (
    <>
      <header className="navbar navbar-light sticky-top bg-white flex-md-nowrap p-0 shadow-sm" style={{ borderBottom: '1px solid var(--kfc-border-grey)' }}>
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#" style={{ backgroundColor: 'var(--kfc-red)', color: 'var(--kfc-white)' }}>KFC Admin</a>
        <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <input className="form-control form-control-dark w-100" type="text" placeholder="Tìm kiếm..." aria-label="Search" />
        <div className="navbar-nav">
          <div className="nav-item text-nowrap">
            <a className="nav-link px-3" href="#" style={{ color: 'var(--kfc-black)' }}>Đăng xuất</a>
          </div>
        </div>
      </header>
      <Nav />
    </>
  )
}

export default Header