import React, { useState, useEffect } from 'react';
import axiosInstance from '/axiosConfig';
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

const Foryou = () => {
  const [posts, setPosts] = useState([]);
  const baseURL = axiosInstance.defaults.baseURL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('api/posts-by-subcategory?subcategory=আপনার জন্য');
        setPosts(response.data.data);
      } catch (error) {
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  const chunkPosts = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const chunkedPosts = chunkPosts(posts, 4);

  return (
    <section className="category_news_section_one news_for_you">
      <div className="container-fluid pt-5 mb-3">
        <div className="section_wrapper">
          <div className="section-title">
            {posts.length > 0 && posts[0].subcategories.length > 0 && (
              <Link
                to={`/category/${posts[0].category.category_id}/subcategory/${posts[0].subcategories[0].id}/posts`}
              >
                <h4 className="m-0 text-uppercase font-weight-bold">আপনার জন্য</h4>
              </Link>
            )}
          </div>
          
          <Carousel 
            showThumbs={false}
            infiniteLoop={false}
            showStatus={false}
            autoPlay={true}
            interval={3000}
            transitionTime={1000}
            showArrows={true}
            emulateTouch={true}
          >
            {chunkedPosts.map((group, index) => (
              <div key={index} className="row">
                {group.map((post, subIndex) => (
                  <div key={subIndex} className="col-md-3 position-relative overflow-hidden" style={{ height: "300px" }}>
                    <a href={`/post/${post.id}`}>
                      <img 
                        className="img-fluid h-100" 
                        src={`${baseURL}storage/post/${post.post_thumbnail}`} 
                        alt={post.post_title} 
                        onError={(e) => { e.target.src = `${baseURL}storage/post/default-post.jpg`; }}
                        style={{ objectFit: "cover" }}
                      />
                    </a>
                    <div className="overlay">
                      <a className="h6 m-0 text-white" href={`/post/${post.id}`}>
                        {post.post_title}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </Carousel>
          
        </div>
      </div>
    </section>
  );
};

export default Foryou;
