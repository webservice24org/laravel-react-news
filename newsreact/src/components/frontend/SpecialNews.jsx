import React, { useEffect, useState } from 'react';
import axiosInstance from '/axiosConfig';
import { Link } from 'react-router-dom';

const SpecialNews = () => {
  const [posts, setPosts] = useState([]);
  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('api/posts-by-subcategory?subcategory=বিশেষ প্রতিবেদন');
        setPosts(response.data.data);
      } catch (error) {
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);


  const smallPosts = posts.length > 0 ? posts.slice(0, 8) : [];


    return (
        <section class="special_news">
            <div class="section_wrapper">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="category_title">
                            {posts.length > 0 && posts[0].subcategories.length > 0 && (
                                <Link
                                to={`/category/${posts[0].category.category_id}/subcategory/${posts[0].subcategories[0].id}/posts`}
                                >
                                <h2>বিশেষ প্রতিবেদন</h2>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div class="special_news_items">
                    <div class="row">
                        {smallPosts.map((post, index) => (
                            <div class="col-md-3 col-sm-12" key={index}>
                                <div class="four_colum_news_item">
                                    <div class="img_box">
                                        <a href={`/post/${post.id}`}>
                                            <img 
                                                className="img-fluid" 
                                                src={`${baseURL}storage/post/${post.post_thumbnail}`} 
                                                alt={post.post_title} 
                                                onError={(e) => { e.target.src = `${baseURL}storage/post/default-post.jpg`; }}
                                            />
                                        </a>
                                    </div>
                                    <div class="category_content">
                                        <a href={`/post/${post.id}`}>
                                            <h2>{post.post_title}</h2>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpecialNews;