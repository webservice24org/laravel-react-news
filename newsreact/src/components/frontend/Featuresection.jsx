import React, { useEffect, useState } from 'react';
import axiosInstance from '/axiosConfig'; 
import LatestPopuler from "./LatestPopuler";
import { Link } from 'react-router-dom';

const Featuresection = () => {
  const [posts, setPosts] = useState([]);
  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('api/lead-posts');
        setPosts(response.data.data); 
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const getExcerpt = (details) => {
    const strippedDetails = details.replace(/<\/?p>/g, '');
    return strippedDetails.split(' ').slice(0, 16).join(' ') + '...';
  };

  return (
    <section className="feature_news design2">
      <div className="section_wrapper">
        <div className="row">
          <div className="col-md-9 col-sm-12">
            <div className="feature_box">
              <div className="row">
                {posts.map((post, index) => (
                  <div className="col-md-4 col-sm-12" key={index}>
                    <div className="single_feature_news card">
                      <div className="img_box">
                        <a href="#">
                        <img 
                            className="img-fluid" 
                            src={`${baseURL}storage/post/${post.post_thumbnail}`} 
                            alt={post.post_title} 
                          />
                        </a>
                      </div>
                      <div className="card-body">
                        <a href="#">
                          <h2>{post.post_title}</h2>
                        </a>
                        <p>{getExcerpt(post.post_details)}</p>
                        <Link to={`/post/${post.id}`} className="btn btn-success read_more">
                            বিস্তারিত পড়ুন
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="horizental_advertise feature_horizontal_advert text-center mt-3">
              <a href="#">
                <img className="img-fluid" src="/src/assets/frontend/img/lead-horizontal-advert12.png" alt="advertisement" />
              </a>
            </div>
          </div>
          <div className="col-md-3 col-sm-12">
            <LatestPopuler />

            <div className="feature_advertisement mt-2 text-center">
              <a href="#"><img src="/src/assets/frontend/img/feature-advert91.avif" className='img-fluid' alt="feature advertisement" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Featuresection;
