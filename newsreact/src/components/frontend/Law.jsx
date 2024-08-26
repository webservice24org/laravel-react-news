import React, { useEffect, useState } from 'react';
import axiosInstance from '/axiosConfig';
import { Link } from 'react-router-dom';


const Law = () => {
  const [posts, setPosts] = useState([]);
  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('api/posts-by-category?category=আইন-আদালত');
        setPosts(response.data.data);
      } catch (error) {
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  const lastPost = posts.length > 0 ? posts[0] : null;
  const nextPosts = posts.length > 1 ? posts.slice(1, 3) : [];

  const getExcerpt = (details) => {
    const strippedDetails = details.replace(/<\/?p>/g, '');
    return strippedDetails.split(' ').slice(0, 16).join(' ') + '...';
  };

    return (
    <div class="category_box">
                            
        <div class="box_title">
            {posts.length > 0 && (
                <Link to={`/category/${posts[0].category.category_id}/posts`}>
                    <h2>আইন-আদালত</h2>
                </Link>
            )}
        </div>
        <div class="box_content">
            {lastPost && (
                <div class="top_news">
                    <div class="img_box">
                        <a href={`/post/${lastPost.id}`}>
                            <img 
                                className="img-fluid" 
                                src={`${baseURL}storage/post/${lastPost.post_thumbnail}`} 
                                alt={lastPost.post_title} 
                            />
                        </a>
                    </div>
                    <a href={`/post/${lastPost.id}`}>
                        <h2 class="mt-1">{lastPost.post_title}</h2>
                    </a>
                </div>
            )}
            <div class="box_news_items">
            {nextPosts.map((post, index) => (
                <div class="box_news_single_item"  key={index}>
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
                        <a href={`/post/${post.id}`}><h2>{post.post_title}</h2></a>
                    </div>
                </div>
                
            ))}
            </div>
        </div>
    </div>
    );
};

export default Law;