import React from 'react';
import './AdminLayout.css';
import '../../Common/Table/Table.css';
import '../../Common/Card/Card.css';
import '../../Common/Form/Form.css';
import { Outlet } from 'react-router-dom';
import Header from '../../Header';
import Nav from '../../Nav';

const AdminLayout = () => {
  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row">
          <Nav />
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
