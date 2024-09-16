import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '/axiosConfig'; 
import LatestPopuler from "./LatestPopuler";

const SingleVideo = () => {
  const { id } = useParams();  
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axiosInstance.get(`/api/video-news/${id}`);
        setVideoData(response.data.video);  
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideoData();
  }, [id]);

  const baseURL = axiosInstance.defaults.baseURL;

  if (!videoData) {
    return <div>Loading...</div>; 
  }

  return (
    <section className="single_news_page">
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-sm-12">
            <div className="single_news_part">
              <div className="single_news_title">
                <h2>{videoData.video_title}</h2> 
              </div>
              <div className="single_news_article">
                <div className="img_box">
                  
                <iframe
                    width="100%"  
                    height="450px"  
                    src={`https://www.youtube.com/embed/${videoData.video_link}`}
                    title={videoData.video_title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>

                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-12">
            <LatestPopuler />
            {/* Advertisement placeholders */}
            <div className="single_page_sidebar_advert">
              <a href="#"><img className="img-fluid" src="img/facebook_Ad_examples-1024x576.png" alt="advertisement" /></a>
            </div>
            <div className="single_page_sidebar_advert mt-3">
              <a href="#"><img className="img-fluid" src="img/Digital_advertising_sign.width-880.webp" alt="advertisement" /></a>
            </div>
            <div className="single_page_sidebar_advert mt-2 text-center">
              <a href="#"><img src="img/feature-advert91.avif" alt="feature advertisement" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleVideo;
