import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "/axiosConfig"; 

const TopVideo = () => {
  const [topVideos, setTopVideos] = useState([]);

  useEffect(() => {
    const fetchTopVideos = async () => {
      try {
        const response = await axios.get("/api/top-videos");
        setTopVideos(response.data.data); 
      } catch (error) {
        console.error("Error fetching top videos:", error);
      }
    };

    fetchTopVideos();
  }, []);

  return (
    <>
      {topVideos.map((video, index) => (
        <div className="col-md-4" key={index}>
          <img
            className="topNewsImg"
            src={`${axios.defaults.baseURL}storage/video/${video.video_thumbnail}`}
            alt={video.video_title}
          />
          <Link to={`/video-news/${video.id}`} className="topNewsTitle text-light">
            {video.video_title}
          </Link>
        </div>
      ))}
    </>
  );
};

export default TopVideo;
