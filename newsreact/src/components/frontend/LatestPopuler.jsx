import React, { useState, useEffect } from 'react';
import axiosInstance from '/axiosConfig';

const LatestPopuler = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [mostViewedPosts, setMostViewedPosts] = useState([]);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await axiosInstance.get('/api/latest-posts');
        setLatestPosts(response.data);
      } catch (error) {
        console.error('Error fetching latest posts:', error);
      }
    };

    const fetchMostViewedPosts = async () => {
      try {
        const response = await axiosInstance.get('/api/most-viewed-posts');
        setMostViewedPosts(response.data);
      } catch (error) {
        console.error('Error fetching most viewed posts:', error);
      }
    };

    fetchLatestPosts();
    fetchMostViewedPosts();
  }, []);

  return (
    <div className="latest_news">
      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">সর্বশেষ প্রকাশিত</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">পাঠকপ্রিয়</button>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
          <div className="latest_news_items">
            {latestPosts.map((post) => (
              <div key={post.id} className="latest_news_single_item">
                <div className="latest_news_img">
                  <img 
                    className="img-fluid" 
                    src={`${axiosInstance.defaults.baseURL}storage/post/${post.post_thumbnail}`} 
                    alt={post.post_title} 
                    onError={(e) => { e.target.src = `${axiosInstance.defaults.baseURL}storage/post/default-post.jpg`; }}
                  />
                </div>
                <div className="latest_news_title">
                  <a href={`/post/${post.id}`}>
                    <h2>{post.post_title}</h2>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
          <div className="latest_news_items">
            {mostViewedPosts.map((post) => (
              <div key={post.id} className="latest_news_single_item">
                <div className="latest_news_img">
                  <img 
                    className="img-fluid" 
                    src={`${axiosInstance.defaults.baseURL}storage/post/${post.post_thumbnail}`} 
                    alt={post.post_title} 
                    onError={(e) => { e.target.src = `${axiosInstance.defaults.baseURL}storage/post/default-post.jpg`; }}
                  />
                </div>
                <div className="latest_news_title">
                  <a href={`/post/${post.id}`}>
                    <h2>{post.post_title}</h2>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestPopuler;
