import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '/axiosConfig';

const Travel = () => {
    const [posts, setPosts] = useState([]);
    const baseURL = axiosInstance.defaults.baseURL;
  
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await axiosInstance.get('api/posts-by-category?category=ভ্রমণ');
          const lastFivePosts = response.data.data.slice(-5).reverse();
          setPosts(lastFivePosts);
        } catch (error) {
          setPosts([]);
        }
      };
  
      fetchPosts();
    }, []);

    return (
        <div class="category_box">
            <div class="box_title">
                {posts.length > 0 && (
                    <Link to={`/category/${posts[0].category.category_id}/posts`}>
                        <h2>ভ্রমণ</h2>
                    </Link>
                )}
            </div>
            <div class="box_content">
                <div class="box_news_items">
                    {posts.map((post) => (
                        <div key={post.id} class="box_news_single_item">
                            <div class="box_news_img">
                                <a href={`/post/${post.id}`}>
                                    <img 
                                        className="img-fluid" 
                                        src={`${baseURL}storage/post/${post.post_thumbnail}`} 
                                        alt={post.post_title} 
                                    />
                                </a>
                            </div>
                            <div class="box_news_title">
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

export default Travel;