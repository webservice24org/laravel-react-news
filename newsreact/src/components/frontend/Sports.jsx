import React, { useEffect, useState } from 'react';
import axiosInstance from '/axiosConfig';
import { Link } from 'react-router-dom';

const Sports = () => {
  const [posts, setPosts] = useState([]);
  const [cricketPosts, setCricketPosts] = useState([]);
  const [footballPosts, setFootballPosts] = useState([]);
  const [otherSportsPosts, setOtherSportsPosts] = useState([]);
  const baseURL = axiosInstance.defaults.baseURL;

    useEffect(() => {

    const fetchPosts = async () => {
        try {
            const response = await axiosInstance.get('api/posts-by-category?category=খেলাধুলা');
            setPosts(response.data.data);
        } catch (error) {
            setPosts([]);
        }
        };

    const fetchCricketPosts = async () => {
      try {
        const response = await axiosInstance.get('api/posts-by-subcategory?subcategory=ক্রিকেট');
        setCricketPosts(response.data.data);
      } catch (error) {
        setCricketPosts([]);
      }
    };

    const fetchFootballPosts = async () => {
      try {
        const response = await axiosInstance.get('api/posts-by-subcategory?subcategory=ফুটবল');
        setFootballPosts(response.data.data);
      } catch (error) {
        setFootballPosts([]);
      }
    };

    const fetchOtherSportsPosts = async () => {
      try {
        const response = await axiosInstance.get('api/posts-by-subcategory?subcategory=অন্যান্য খেলাধুলা');
        setOtherSportsPosts(response.data.data);
      } catch (error) {
        setOtherSportsPosts([]);
      }
    };

    fetchPosts();
    fetchCricketPosts();
    fetchFootballPosts();
    fetchOtherSportsPosts();
  }, []);

  return (
    <section class="category_news_tabs sports_section">
      <div class="section_wrapper">
        <div class="section_title">
          <div class="row">
            <div class="col-sm-12">
              <div class="title_wrapper">
                <Link to={`/category/${posts[0]?.category?.category_id}/posts`}>
                  <h2>খেলাধুলা</h2>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="pills-cricket-tab" data-bs-toggle="pill" data-bs-target="#pills-cricket" type="button" role="tab" aria-controls="pills-cricket" aria-selected="true">ক্রিকেট</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="pills-football-tab" data-bs-toggle="pill" data-bs-target="#pills-football" type="button" role="tab" aria-controls="pills-football" aria-selected="false">ফুটবল</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="pills-others-tab" data-bs-toggle="pill" data-bs-target="#pills-others" type="button" role="tab" aria-controls="pills-others" aria-selected="false">অন্যান্য</button>
          </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
          <div class="tab-pane fade show active" id="pills-cricket" role="tabpanel" aria-labelledby="pills-cricket-tab" tabindex="0">
            <div class="row">
              {cricketPosts.slice(0, 8).map((post) => (
                <div class="col-md-3 col-sm-12 mb-3" key={post.id}>
                  <div class="sports_box card">
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
                    <div class="category_content card-body">
                      <a href={`/post/${post.id}`}>
                        <h2>{post.post_title}</h2>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div class="tab-pane fade" id="pills-football" role="tabpanel" aria-labelledby="pills-football-tab" tabindex="0">
            <div class="row">
              {footballPosts.slice(0, 8).map((post) => (
                <div class="col-md-3 col-sm-12 mb-3" key={post.id}>
                  <div class="sports_box card">
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
                    <div class="category_content card-body">
                      <a href={`/post/${post.id}`}>
                        <h2>{post.post_title}</h2>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div class="tab-pane fade" id="pills-others" role="tabpanel" aria-labelledby="pills-others-tab" tabindex="0">
            <div class="row">
              {otherSportsPosts.slice(0, 8).map((post) => (
                <div class="col-md-3 col-sm-12 mb-3" key={post.id}>
                  <div class="sports_box card">
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
                    <div class="category_content card-body">
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
    </section>
  );
};

export default Sports;
