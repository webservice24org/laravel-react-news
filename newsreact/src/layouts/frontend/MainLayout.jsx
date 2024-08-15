
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Modal from './Modal';

const MainLayout = ({ children }) => {
  return (
    <div>
      <header>
        <Header />
      </header>
      <main className='frontLayout'>
        <div className="container-fluid px-4">
              <Outlet />
        </div>
      </main>
      <footer>
        <Footer />
      </footer>

      <Modal />
    </div>
  );
};

export default MainLayout;
