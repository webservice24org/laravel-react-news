import React, { useEffect, useState } from 'react';
import axiosInstance from '/axiosConfig';
import { Link } from 'react-router-dom';
import Abroad from './Abroad';

const International = () => {
  const [posts, setPosts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('api/posts-by-category?category=আন্তর্জাতিক');
        setPosts(response.data.data);
      } catch (error) {
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      const fetchSubCategories = async () => {
        try {
          const response = await axiosInstance.get(`api/categories/${posts[0].category.category_id}/subcategories`);
          setSubCategories(response.data.subCategories); 
        } catch (error) {
          setSubCategories([]);
        }
      };

      fetchSubCategories();
    }
  }, [posts]);

  const lastPost = posts.length > 0 ? posts[0] : null;
  const nextPosts = posts.length > 1 ? posts.slice(1, 6) : [];

  const getExcerpt = (details) => {
    const strippedDetails = details.replace(/<\/?p>/g, '');
    return strippedDetails.split(' ').slice(0, 16).join(' ') + '...';
  };

  return (
    <section className="category_news_section_one international_cat">
      <div className="section_wrapper">
        <div className="row">
          <div className="col-md-9 col-sm-12">
            <div className="row category_title">
              <div className="col-md-2">
                {posts.length > 0 && (
                    <Link to={`/category/${posts[0].category.category_id}/posts`}>
                        <h2>আন্তর্জাতিক</h2>
                    </Link>
                  )}
              </div>
              <div className="col-md-10 p-0">
                <ul className="nav">
                  {subCategories.length > 0 ? (
                    subCategories.map((subCategory) => (
                      <li key={subCategory.id} className="nav-item">
                        <a href={`/category/${posts[0].category.category_id}/subcategory/${subCategory.id}/posts`} className="nav-link">
                          {subCategory.name}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="nav-item">
                      <span className="nav-link">No subcategories available</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="category_news">
              <div className="row">
                <div className="col-md-7 col-sm-12">
                  {lastPost && (
                    <div className="category_broad_news">
                      <div className="img_box">
                        <a href={`/post/${lastPost.id}`}>
                        <img
                            className="img-fluid"
                            src={lastPost.post_thumbnail ? `${baseURL}storage/post/${lastPost.post_thumbnail}` : '/path/to/default-thumbnail.jpg'}
                            alt={lastPost.thumbnail_alt || lastPost.post_title}
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
                  )}
                </div>

                <div className="col-md-5 col-sm-12">
                  <div className="category_small_items">
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
          <div className="col-md-3 col-sm-12">
            <Abroad />
          </div>
        </div>
      </div>
    </section>
  );
};

export default International;
