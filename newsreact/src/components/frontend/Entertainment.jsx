import React, { useEffect, useState } from 'react';
import axiosInstance from '/axiosConfig';
import { Link } from 'react-router-dom';


const Entertainment = () => {
  const [posts, setPosts] = useState([]);
  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('api/posts-by-category?category=বিনোদন');
        setPosts(response.data.data);
      } catch (error) {
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  const lastPost = posts.length > 0 ? posts[0] : null;
  const nextPosts = posts.length > 1 ? posts.slice(1, 4) : [];


  return (
    <div class="category_card_news_item">
        <div class="card">
            <div class="card-header">
                {posts.length > 0 && (
                    <Link to={`/category/${posts[0].category.category_id}/posts`}>
                        <h2>বিনোদন</h2>
                    </Link>
                )}
            </div>
            <div class="card-body">
                {lastPost && (
                    <div class="top_news">
                        <div class="img_box">
                            <a href={`/post/${lastPost.id}`}>
                                <img 
                                    className="img-fluid" 
                                    src={`${baseURL}storage/post/${lastPost.post_thumbnail}`} 
                                    alt={lastPost.post_title} 
                                    onError={(e) => { e.target.src = `${baseURL}storage/post/default-post.jpg`; }}
                                />
                            </a>
                        </div>
                        <a href={`/post/${lastPost.id}`}>
                            <h2 class="mt-1">{lastPost.post_title}</h2>
                        </a>
                    </div>
                )}
                <div class="list_news">
                    <ul class="list-group list-group-flush">
                        {nextPosts.map((post, index) => (
                            <li class="list-group-item" key={index}>
                                <a href={`/post/${post.id}`}><h2>{post.post_title}</h2></a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div class="card-footer">
            {posts.length > 0 && (
                    <Link to={`/category/${posts[0].category.category_id}/posts`}>
                        <h2>আরও দেখুন</h2>
                    </Link>
                )}
            </div>
        </div>
    </div>

);
};

export default Entertainment;