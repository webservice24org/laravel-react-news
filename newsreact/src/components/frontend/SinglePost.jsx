// src/components/frontend/SinglePost.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '/axiosConfig'; 
import { toast } from 'react-toastify';
import LatestPopuler from "./LatestPopuler";



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
    
    <section class="single_news_page">
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-sm-12">
            {post && (
                <div class="single_news_part">
                    <div class="single_news_title">
                        <h2>{post.post_title}</h2>
                    </div>
                    <div class="news_author">
                        <div class="row">
                            <div class="col-md-6 col-sm-12">
                                <div class="author_img">
                                <img src="" alt="" />
                                    
                                </div>
                                <div class="author_name">
                                    <a href="#">Desk Reporter</a>
                                </div>
                                <div class="news_date">
                                    <p><a href="#">প্রকাশঃ <span><i class="fa-solid fa-calendar-days"></i></span> ২৩ মে, ২০২৩</a> <span>||</span> <a href="#"> আপডেটেডঃ ২৪ মে, ২০২৩</a></p>
                                </div>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <div class="social_share_buttons text-end">
                                    <ul>
                                        <li><span>Share Now</span></li>
                                        <li><a href=""><i class="fa-brands fa-square-facebook"></i></a></li>
                                        <li><a href=""><i class="fa-brands fa-square-twitter"></i></a></li>
                                        <li><a href=""><i class="fa-brands fa-linkedin"></i></a></li>
                                        <li><a href=""><i class="fa-solid fa-square-envelope"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="single_news_article">
                        <div class="img_box">
                        <img src={`${baseURL}storage/post/${post.post_thumbnail}`} alt={post.post_title} />
                        </div>
                        <div class="news_post">
                        <div dangerouslySetInnerHTML={{ __html: post.post_details }} />
                        </div>
                    </div>
                    <div class="bottom_share">
                        <div class="social_share_buttons text-start">
                            <ul>
                                <li><span>Share Now</span></li>
                                <li><a href=""><i class="fa-brands fa-square-facebook"></i></a></li>
                                <li><a href=""><i class="fa-brands fa-square-twitter"></i></a></li>
                                <li><a href=""><i class="fa-brands fa-linkedin"></i></a></li>
                                <li><a href=""><i class="fa-solid fa-square-envelope"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="comment_box">
                        <p>comment will here</p>
                    </div>
                </div>
            )}
            </div>
            <div class="col-md-4 col-sm-12">
            <LatestPopuler />
                <div class="single_page_sidebar_advert">
                    <a href="#">
                        <img class="img-fluid" src="img/facebook_Ad_examples-1024x576.png" alt="advertisement" />
                        
                    </a>
                </div>
                <div class="single_page_sidebar_advert mt-3">
                    <a href="#">
                        <img class="img-fluid" src="img/Digital_advertising_sign.width-880.webp" alt="advertisement" />
                        
                    </a>
                </div>
                <div class="single_page_sidebar_advert mt-2 text-center">
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
