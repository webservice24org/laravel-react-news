import React, { useEffect, useState } from 'react';
import axiosInstance from '/axiosConfig';
import { Link } from 'react-router-dom';
import Travel from './Travel';
import Agriculture from './Agriculture';

const Literature = () => {
    const [posts, setPosts] = useState([]);
    const baseURL = axiosInstance.defaults.baseURL;
  
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await axiosInstance.get('api/posts-by-category?category=সাহিত্য');
          setPosts(response.data.data);
        } catch (error) {
          setPosts([]);
        }
      };
  
      fetchPosts();
    }, []);
  
    const lastPost = posts.length > 0 ? posts[0] : null;
    const smallPosts = posts.length > 1 ? posts.slice(1, 6) : [];
  
    const getExcerpt = (details) => {
        const strippedDetails = details.replace(/<\/?[^>]+(>|$)/g, ''); 
        return strippedDetails.split(' ').slice(0, 16).join(' ') + '...';
      };
      
  
    return (
        <section class="category_news_section_three">
            <div class="section_wrapper">
                <div class="row">
                    <div class="col-md-6 col-sm-12">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="category_title">
                                    {posts.length > 0 && (
                                        <Link to={`/category/${posts[0].category.category_id}/posts`}>
                                            <h2>সাহিত্য</h2>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div class="section_broad_news">
                        {lastPost && (
                            <div class="row">
                                <div class="col-md-6 col-sm-12">
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
                                </div>
                                <div class="col-md-6 col-sm-12">
                                    <div class="category_content">
                                        <a href={`/post/${lastPost.id}`}>
                                            <h2>{lastPost.post_title}</h2>
                                        </a>
                                        <p>{getExcerpt(lastPost.post_details)}</p> 
                                        <a href={`/post/${lastPost.id}`} className="btn btn-success read_more">
                                            বিস্তারিত পড়ুন
                                        </a>
                                    </div>
                                </div>
                            </div>
                            )}
                        </div>
                        <div class="section_small_box_news">
                            <div class="two_colum_box">
                                <div class="row">
                                    {smallPosts.map((post, index) => (
                                        
                                        <div class="col-md-6 col-sm-12" key={index}>
                                            <div class="feature_small_box_news">
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
                                                <div class="feature_small_box_title">
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
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="row">
                            <div class="col-md-6 col-sm-12">
                                <Travel />
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <Agriculture />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
};

export default Literature;