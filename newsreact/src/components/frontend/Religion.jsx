import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '/axiosConfig';

const Religion = () => {
  const [posts, setPosts] = useState([]);
  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('api/posts-by-category?category=ধর্ম');
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
                    <h2>ধর্ম</h2>
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
                        src={`${baseURL}storage/post/${post.post_thumbnail}`}
                        alt={post.post_title}
                        />
                    </div>
                    <div className="box_news_title">
                        <Link to={`/post/${post.id}`}>
                        <h2>{post.post_title}</h2>
                        </Link>
                    </div>
                </div>
            ))}
                
            </div>
        </div>
    </div>
  );
};

export default Religion;