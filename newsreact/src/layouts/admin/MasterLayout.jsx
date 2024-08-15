import React from 'react';
import "../../assets/admin/css/styles.css";
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

const MasterLayout = () => {
  return (
    <div className="sb-nav-fixed">
      <Navbar />
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <Sidebar />
        </div>
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <Outlet />
            </div>
          </main>
          <footer className="py-4 bg-light mt-5">
            <Footer />
          </footer>
        </div>
      </div>
    </div>
  );
};

export default MasterLayout;
