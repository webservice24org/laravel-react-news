import React, { useEffect, useState } from 'react';
import axiosInstance from '/axiosConfig';
import Huminity from './Huminity';

const National = () => {
  const [posts, setPosts] = useState([]);
  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('api/posts-by-subcategory?subcategory=জাতীয়');
        setPosts(response.data.data);
      } catch (error) {
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);


  const lastPost = posts.length > 0 ? posts[posts.length - 1] : null;
  const smallPosts = posts.slice(0, posts.length - 1);

  const getExcerpt = (details) => {
    const strippedDetails = details.replace(/<\/?p>/g, '');
    return strippedDetails.split(' ').slice(0, 16).join(' ') + '...';
  };

  return (
    <section className="category_news_section_one">
      <div className="section_wrapper">
        <div className="row">
          <div className="col-md-9 col-sm-12">
            <div className="category_title">
              <a href="category.html">
                <h2>জাতীয়</h2>
              </a>
            </div>
            <div className="category_news">
              <div className="row">
                {lastPost && (
                  <div className="col-md-6 col-sm-12">
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
                    <div className="horizental_advertise mt-3">
                      <a href="#">
                        <img
                          className="img-fluid"
                          src="/src/assets/frontend/img/horizental-ad.jpg"
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                )}

                <div className="col-md-6 col-sm-12">
                  <div className="row">
                    {smallPosts.slice(0, 6).map((post, index) => (
                      <div key={post.id} className="col-md-6 col-sm-12 mb-4">
                        <div className="category_small_items">
                          <div className="sub_lead_img">
                            <a href={`/post/${post.id}`}>
                            <img 
                            className="imgSize" 
                            src={`${baseURL}storage/post/${post.post_thumbnail}`} 
                            alt={post.post_title} 
                          />
                            </a>
                          </div>
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
          <div className="col-md-3 col-sm-12">
            <Huminity />
          </div>
        </div>
      </div>
    </section>
  );
};

export default National;
