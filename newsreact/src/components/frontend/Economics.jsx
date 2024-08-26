import React, { useEffect, useState } from 'react';
import axiosInstance from '/axiosConfig';
import { Link } from 'react-router-dom';
import Huminity from './Huminity';

const LatestPopuler = () => {
  const [posts, setPosts] = useState([]);
  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('api/posts-by-subcategory?subcategory=অর্থনীতি');
        setPosts(response.data.data);
      } catch (error) {
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  const lastPost = posts.length > 0 ? posts[0] : null;
  const smallPosts = posts.length > 1 ? posts.slice(1, 4) : [];

  const getExcerpt = (details) => {
    const strippedDetails = details.replace(/<\/?p>/g, '');
    return strippedDetails.split(' ').slice(0, 16).join(' ') + '...';
  };


    return (
        <section class="category_news_section_two">
            <div class="section_wrapper">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="category_title">
                            {posts.length > 0 && posts[0].subcategories.length > 0 && (
                                <Link
                                to={`/category/${posts[0].category.category_id}/subcategory/${posts[0].subcategories[0].id}/posts`}
                                >
                                <h2>অর্থনীতি</h2>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div class="row">
                    
                    <div class="col-md-6 col-sm-12">
                        {lastPost && (
                            <div class="category_broad_news">
                                <div class="img_box">
                                    <a href={`/post/${lastPost.id}`}>
                                        <img 
                                            className="img-fluid" 
                                            src={`${baseURL}storage/post/${lastPost.post_thumbnail}`} 
                                            alt={lastPost.post_title} 
                                        />
                                    </a>
                                </div>
                                <div class="category_content">
                                <a href={`/post/${lastPost.id}`}>
                                    <h2>{lastPost.post_title}</h2>
                                </a>
                                <p>{getExcerpt(lastPost.post_details)}</p> 
                                    <a href={`/post/${lastPost.id}`} class="btn btn-success read_more">বিস্তারিত পড়ুন</a>
                                </div>
                            </div>
                        )}
                    </div>

                    <div class="col-md-6 col-sm-12">
                        <div class="two_colum_box">
                            <div class="row">
                                {smallPosts.map((post, index) => (
                                    <div class="col-md-6 col-sm-12" key={index}>
                                        <div class="two_colum_news_item">
                                            <div class="img_box">
                                                <a href={`/post/${post.id}`}>
                                                    <img 
                                                        className="img-fluid" 
                                                        src={`${baseURL}storage/post/${post.post_thumbnail}`} 
                                                        alt={post.post_title} 
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
                </div>
            </div>
        </section>
    );
};

export default LatestPopuler;