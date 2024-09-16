import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import SinglePostHeader from './SinglePostHeader'; 
import Footer from './Footer';
import Modal from './Modal';

const MainLayout = () => {
  const location = useLocation();

  const isSinglePostOrCategory = location.pathname.startsWith('/post/') || 
                                 location.pathname.startsWith('/category/') ||
                                 location.pathname.startsWith('/video-news/') ||
                                 location.pathname.startsWith('/division/');  

  return (
    <div>

      {isSinglePostOrCategory ? <SinglePostHeader /> : <Header />}
      
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
