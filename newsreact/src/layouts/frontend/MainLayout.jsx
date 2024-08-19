// src/layouts/frontend/MainLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import SinglePostHeader from './SinglePostHeader'; // Import new header
import Footer from './Footer';
import Modal from './Modal';

const MainLayout = () => {
  const location = useLocation();
  
  // Check if the current path is for a single post or a category post
  const isSinglePostOrCategory = location.pathname.startsWith('/post/') || location.pathname.startsWith('/category/');

  return (
    <div>
      <header>
        {isSinglePostOrCategory ? <SinglePostHeader /> : <Header />}
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
