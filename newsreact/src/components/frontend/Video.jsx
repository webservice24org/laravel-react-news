import React, { useState, useEffect } from 'react';
import axios from '/axiosConfig';

const Video = () => {
    const [videos, setVideos] = useState([]); 
    const [activeVideoId, setActiveVideoId] = useState(null); 
    const [activeVideoTitle, setActiveVideoTitle] = useState(""); 

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('/api/video-news');
                if (response.data && Array.isArray(response.data)) {
                    setVideos(response.data);
                }
            } catch (error) {
                console.error('Error fetching video news:', error);
            }
        };

        fetchVideos();
    }, []);

    const openModal = (videoId, videoTitle) => {
        setActiveVideoId(videoId); 
        setActiveVideoTitle(videoTitle); 
        const modal = new window.bootstrap.Modal(document.getElementById('videoModal')); 
        modal.show(); 
    };

    const closeModal = () => {
        setActiveVideoId(null); 
        const iframe = document.querySelector('#videoModal iframe'); 
        if (iframe) {
            iframe.src = '';
        }
    };

    return (
        <>
            <section className="atn_tv_news">
                <div className="section_wrapper">
                    <div className="atn_videos">
                        <div className="section-title">
                            <h4 className="m-0 float-start font-weight-bold">ভিডিও নিউজ</h4>
                        </div>
                        
                        <div className="row">
                            {
                                videos.slice(0, 8).map((video, index) => {
                                    const videoId = video.video_link.split('?')[0].split('/').pop(); // Extract video ID
                                    return (
                                        <div className="col-md-4 mb-2" key={index}>
                                            <div className="video big_news" onClick={() => openModal(videoId, video.video_title)}>
                                                <img 
                                                    src={`${axios.defaults.baseURL}storage/video/${video.video_thumbnail}`}
                                                    alt={video.video_title}
                                                    className="img-fluid"
                                                />
                                                <p>{video.video_title}</p>
                                                <div className="video_icon">
                                                    <i className="fa-brands fa-youtube"></i>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </section>

            <div
                className="modal fade"
                id="videoModal"
                tabIndex="-1"
                aria-labelledby="videoModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="videoModalLabel">{activeVideoTitle}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={closeModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="atnLive">
                                {activeVideoId && (
                                    <iframe
                                        className="responsive-iframe"
                                        src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                                        title={activeVideoTitle}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Video;
