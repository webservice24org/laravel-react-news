import React, { useState, useEffect } from 'react';
import axiosInstance from '/axiosConfig'; 

const Leadsection = () => {
  const [post, setPost] = useState(null); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get('/api/lead-post'); 
        setPost(response.data.data); 
      } catch (error) {
        console.error('Error fetching post:', error); 
        setError('Failed to fetch post'); 
      }
    };

    fetchPost(); 
  }, []);

  const getExcerpt = (details) => {
    const strippedDetails = details.replace(/<\/?p>/g, '');
    return strippedDetails.split(' ').slice(0, 30).join(' ') + '...';
  };

  return (
    <>
      <section className="lead_section design2">
        <div className="container">
          <div className="row">
            {error ? (
              <div className="col-md-12 col-sm-12">
                <p>{error}</p>
              </div>
            ) : post ? (
              <div className="col-md-12 col-sm-12">
                <div className="lead_title design2">
                  <a href={`/post/${post.id}`}>
                    <h2>{post.post_title}</h2>
                  </a>
                  <p className="news_exerpt">
                    {getExcerpt(post.post_details)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="col-md-12 col-sm-12">
                <p>No post available.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <div
        className="header_section_bg bg_css"
        style={{ 
          background: `url(${axiosInstance.defaults.baseURL}storage/post/${post ? post.post_thumbnail : 'default-thumbnail.jpg'}) no-repeat center center`,
          backgroundSize: 'cover'
        }}
      ></div>
    </>
  );
};

export default Leadsection;
