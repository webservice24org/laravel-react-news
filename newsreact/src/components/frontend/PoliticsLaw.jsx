import React, { useEffect, useState } from 'react';
import axiosInstance from '/axiosConfig';
import { Link } from 'react-router-dom';

import Law from './Law';

const PoliticsLaw = () => {
  const [posts, setPosts] = useState([]);
  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('api/posts-by-subcategory?subcategory=রাজনীতি');
        setPosts(response.data.data);
      } catch (error) {
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  const lastPost = posts.length > 0 ? posts[0] : null;
  const nextPosts = posts.length > 1 ? posts.slice(1, 6) : [];

  const getExcerpt = (details) => {
    const strippedDetails = details.replace(/<\/?p>/g, '');
    return strippedDetails.split(' ').slice(0, 16).join(' ') + '...';
  };


    return (
        <section class="category_news_section_one">
            <div class="section_wrapper">
                <div class="row">
                    <div class="col-md-7 col-sm-12">
                        <div class="category_title">
                            {posts.length > 0 && posts[0].subcategories.length > 0 && (
                                <Link
                                to={`/category/${posts[0].category.category_id}/subcategory/${posts[0].subcategories[0].id}/posts`}
                                >
                                <h2>রাজনীতি</h2>
                                </Link>
                            )}

                        </div>
                        <div class="category_news">
                            <div class="row">

                            {lastPost && (
                                <div className="col-md-7 col-sm-12">
                                    <div className="category_broad_news">
                                    <div className="img_box">
                                        <a href={`/post/${lastPost.id}`}>
                                        <img 
                                            className="img-fluid" 
                                            src={`${baseURL}storage/post/${lastPost.post_thumbnail}`} 
                                            alt={lastPost.post_title} 
                                        />
                                        </a>
                                    </div>
                                    <div className="category_content">
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

                                <div class="col-md-5 col-sm-12">
                                    <div class="category_small_items">
                                        
                                        {nextPosts.map((post, index) => (
                                            <div className="row" key={index}>
                                                <div className="col-md-5 col-sm-12">
                                                <div className="sub_lead_img">
                                                    <a href={`/post/${post.id}`}>
                                                    <img
                                                        className="img-fluid"
                                                        src={post.post_thumbnail ? `${baseURL}storage/post/${post.post_thumbnail}` : '/path/to/default-thumbnail.jpg'}
                                                        alt={post.thumbnail_alt || post.post_title}
                                                    />
                                                    </a>
                                                </div>
                                                </div>
                                                <div className="col-md-7 col-sm-12">
                                                <div className="sub_lead_title">
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
                    </div>
                    <div class="col-md-3 col-sm-12">
                        <Law />
                    </div>
                    <div class="col-md-2 side_advertise">
                        <a href="#">
                            <img class="img-fluid" src="/src/assets/frontend/img/advert2.png" alt="" />
                        </a>
                    </div>
                    
                </div>
            </div>
        </section>
    );
};

export default PoliticsLaw;