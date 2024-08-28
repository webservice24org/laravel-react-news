import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '/axiosConfig'; 
import { toast } from 'react-toastify';
import LatestPopuler from "./LatestPopuler";
import formatDate from '/formatDate';

const SinglePost = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(`/api/posts/${postId}`);
        setPost(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch post details.');
        setLoading(false);
        toast.error('Failed to fetch post details.');
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <section className="bredcumb_sec">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="single_bredcumb">
                <ul>
                  <li>
                    <Link to="/">
                      <i className="fa-solid fa-house"></i>
                    </Link> 
                    <span className="bredcumb_devider"><i className="fa-solid fa-angles-right"></i></span>
                  </li>
                  {post && post.category && (
                    <>
                      <li>
                        <Link to={`/category/${post.category.id}/posts`}>{post.category.category_name}</Link>
                        <span className="bredcumb_devider"><i className="fa-solid fa-angles-right"></i></span>
                      </li>
                      {post.subcategories && post.subcategories.length > 0 && (
                        <li>
                          {post.subcategories.map((subcategory) => (
                            <>
                            <Link
                              key={subcategory.id}
                              to={`/category/${post.category.id}/subcategory/${subcategory.id}/posts`}
                            >
                              {subcategory.sub_category_name}
                            </Link>
                            <span className="bredcumb_devider"><i className="fa-solid fa-angles-right"></i></span>
                            </>
                          ))}
                        </li>
                      )}

                    </>
                  )}
                  <li>
                    <span className="bredcumb_title">{post.post_title}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="single_news_page">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-sm-12">
              {post && (
                <div className="single_news_part">
                  <div className="single_news_title">
                    <h2>{post.post_title}</h2>
                  </div>
                  <div className="news_author">
                    <div className="row">
                      <div className="col-md-8 col-sm-12">
                        <div className="author_img">
                          <img src="" alt="" />
                        </div>
                        <div className="author_name">
                          <a href="#">Desk Reporter</a>
                        </div>
                        <div className="news_date">
                          <p>
                            <a href="#">প্রকাশঃ <span><i className="fa-solid fa-calendar-days"></i></span> {formatDate(post.created_at)}</a> 
                            <span>||</span> 
                            <a href="#"> আপডেটঃ {formatDate(post.updated_at)}</a>
                          </p>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-12">
                        <div className="social_share_buttons text-end">
                          <ul>
                            <li><span>Share Now</span></li>
                            <li><a href=""><i className="fa-brands fa-square-facebook"></i></a></li>
                            <li><a href=""><i className="fa-brands fa-square-twitter"></i></a></li>
                            <li><a href=""><i className="fa-brands fa-linkedin"></i></a></li>
                            <li><a href=""><i className="fa-solid fa-square-envelope"></i></a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="single_news_article">
                    <div className="img_box">
                      <img className="rounded img-fluid w-100" src={`${baseURL}storage/post/${post.post_thumbnail}`} alt={post.post_title} onError={(e) => { e.target.src = `${baseURL}storage/post/default-post.jpg`; }} />
                    </div>
                    <div className="news_post">
                      <div dangerouslySetInnerHTML={{ __html: post.post_details }} />
                    </div>
                  </div>
                  <div className="bottom_share">
                    <div className="social_share_buttons text-start">
                      <ul>
                        <li><span>Share Now</span></li>
                        <li><a href=""><i className="fa-brands fa-square-facebook"></i></a></li>
                        <li><a href=""><i className="fa-brands fa-square-twitter"></i></a></li>
                        <li><a href=""><i className="fa-brands fa-linkedin"></i></a></li>
                        <li><a href=""><i className="fa-solid fa-square-envelope"></i></a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="comment_box">
                    <p>comment will here</p>
                  </div>
                </div>
              )}
            </div>
            <div className="col-md-4 col-sm-12">
              <LatestPopuler />
              <div className="single_page_sidebar_advert">
                <a href="#">
                  <img className="img-fluid" src="img/facebook_Ad_examples-1024x576.png" alt="advertisement" />
                </a>
              </div>
              <div className="single_page_sidebar_advert mt-3">
                <a href="#">
                  <img className="img-fluid" src="img/Digital_advertising_sign.width-880.webp" alt="advertisement" />
                </a>
              </div>
              <div className="single_page_sidebar_advert mt-2 text-center">
                <a href="#"><img src="img/feature-advert91.avif" alt="feature advertisement" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SinglePost;
