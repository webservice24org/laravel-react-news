import React, { useEffect, useState } from 'react';
import axiosInstance from '/axiosConfig';
import { Link } from 'react-router-dom';

const Huminity = () => {
  const [posts, setPosts] = useState([]);
  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('api/posts-by-category?category=মানবিক');
        const lastFivePosts = response.data.data.slice(-5).reverse();
        setPosts(lastFivePosts);
      } catch (error) {
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="category_box">
      <div className="box_title">
      {posts.length > 0 && (
          <Link to={`/category/${posts[0].category.category_id}/posts`}>
            <h2>মানবিক</h2>
          </Link>
        )}
      </div>
      <div className="box_content">
        <div className="box_news_items">
          
          {posts.map((post) => (
            <div key={post.id} className="box_news_single_item">
              <div className="box_news_img">
                <img
                  className="img-fluid"
                  src={`${baseURL}storage/post/${post.post_thumbnail}`} // Use `post.post_thumbnail`
                  alt={post.post_title}
                />
              </div>
              <div className="box_news_title">
                <a href={`/post/${post.id}`}>
                  <h2>{post.post_title}</h2>
                </a>
              </div>
            </div>
          ))}
          
        </div>
      </div>
      <div className="box_advertise mt-3">
        <a href="#">
          <img
            className="img-fluid"
            src="/src/assets/frontend/img/Digital_advertising_sign.width-880.webp"
            alt="advertise title"
          />
        </a>
      </div>
    </div>
  );
};

export default Huminity;
