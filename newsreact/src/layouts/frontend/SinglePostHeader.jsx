// src/layouts/frontend/SinglePostHeader.jsx
import React, { useState, useEffect } from 'react';
import TopVideo from "../../components/frontend/TopVideo";
import axios from '/axiosConfig';
import { Link } from "react-router-dom";

const SinglePostHeader = () => {
    const [headerData, setHeaderData] = useState(null);

    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                const response = await axios.get('/api/header-data/');
                setHeaderData(response.data[0]); 
            } catch (error) {
                console.error("Error fetching header data:", error);
            }
        };

        fetchHeaderData();
    }, []);

    if (!headerData) return null; 
  return (
    <header>

        <div className="header_logo_area">
            <div className="container">
                <div className="row">
                    <div className="col-sm-3">
                        <div className="header_logo">
                            <Link to="#">
                                <img src={`${axios.defaults.baseURL}storage/logo/${headerData.header_logo}`} alt="Header Logo" />
                            </Link>
                        </div>
                    </div>
                    <div className="col-sm-1">
                        <div className="live_button mt-3">
                            <a className="button" href={headerData.video_link} target="_blank" rel="noopener noreferrer">
                                {headerData.video_btn_text}
                            </a>
                        </div>
                    </div>
                    <div className="col-sm-8 pt-3">
                        <div className="row">
                            <TopVideo />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bottom_header">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="mobile_bar">
                            <span><i className="fa-solid fa-bars"></i></span>
                        </div>
                        <div className="mobile_logo">
                            <img src="img/logo.png" alt="" />
                        </div>
                        
                        <div className="manu_area">
                            <ul>
                                <li className="active"><a href="index.html"><i className="fas fa-home"></i></a></li>
                                <li><a href="">বাংলাদেশ <span><i className="fa-solid fa-angle-down"></i></span>
                                    <ul>
                                        <li><a href="All page/national.html">জাতীয়</a></li>
                                        <li><a href="All page/politics.html">রাজনীতি</a></li>
                                        <li><a href="All page/comercial.html">অর্থনীতি</a></li>
                                    </ul>
                                </a></li>
                                <li><a href="All page/over-country.html">দেশজুড়ে <span><i className="fa-solid fa-angle-down"></i></span>
                                    <ul>
                                        <li><a href="All page/district-news.html">জেলার খবর</a></li>
                                    </ul>
                                </a></li>
                                <li><a href="All page/internation.html">আন্তর্জাতিক</a></li>
                                <li><a href="All page/game.html">খেলাধুলা <span><i className="fa-solid fa-angle-down"></i></span>
                                    <ul>
                                        <li><a href="All page/footbal.html">ফুটবল</a></li>
                                        <li><a href="All page/crickcet.html">ক্রিকেট</a></li>
                                    </ul>
                                </a></li>
                                <li><a href="All page/expression.html">মতামত</a></li>
                                <li><a href="All page/entertainment.html">বিনোদন <span><i className="fa-solid fa-angle-down"></i></span>
                                    <ul>
                                        <li><a href="All page/hollywood.html">হলিউড</a></li>
                                        <li><a href="All page/bollywood.html">বলিউড</a></li>
                                    </ul>
                                </a></li>
                                <li><a href="All page/features.html">ফিচার <span><i className="fa-solid fa-angle-down"></i></span>
                                    <ul>
                                        <li><a href="All page/photogallery.html">ফটো গ্যালারি</a></li>
                                        <li><a href="All page/lifestyle.html">লাইফস্টাইল</a></li>
                                        <li><a href="All page/ict.html">অথ্যপ্রযুক্তি</a></li>
                                        <li><a href="All page/travel.html">ভ্রমণ</a></li>
                                        <li><a href="All page/agriculture.html">কৃষি ও প্রকৃতি</a></li>
                                        <li><a href="All page/ekushe.html">একুশে বইমেলা</a></li>
                                    </ul>
                                </a></li>
                                <li className="all_division_parent"><a href="">সকল বিভাগ <span><i className="fa-solid fa-angle-down"></i></span></a>
                                    <div className="all_division">
                                        <div className="container">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="single_division">
                                                        <p><a href="All page/education.html">শিক্ষা</a></p>
                                                        <p><a href="All page/campus.html">ক্যাম্পাস</a></p>
                                                        <p><a href="All page/health.html">স্বাস্থ্য</a></p>
                                                        <p><a href="All page/high-court.html">আইন-আদালত</a></p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="single_division">
                                                        <p><a href="All page/religion.html">ধর্ম</a></p>
                                                        <p><a href="All page/abroad.html">প্রবাস</a></p>
                                                        <p><a href="All page/news-mediam.html">গনমাধ্যম</a></p>
                                                        <p><a href="All page/children.html">নারী ও শিশু</a></p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="single_division">
                                                        <p><a href="All page/comerce-fair.html">বাণিজ্য মেলা</a></p>
                                                        <p><a href="All page/literature.html">সাহিত্য</a></p>
                                                        <p><a href="All page/job.html">জাগো জবস</a></p>
                                                        <p><a href="All page/eid-magazine.html">ঈদ সংখ্যা</a></p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="single_division">
                                                        <p><a href="All page/today.html"><span><i className="fas fa-stopwatch"></i></span> আজকের আয়োজন</a></p>
                                                        <p><a href="archive.html"><span><i className="fas fa-camera-retro"></i></span> আর্কাইভ</a></p>
                                                        <p><a href="All page/social.html"><span><i className="fas fa-share-alt"></i></span> সোশাল মিডিয়া</a></p>
                                                        <p><a href="https://www.jagonews24.com/bangla-converter"><span><i className="fas fa-language"></i></span> ইউনিকোড কনভার্টার</a></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li> 
                            </ul> 
                        </div>
                        
                    </div>
                </div>
            </div>
            
        </div>
        <div className="mobile_manu">
            <div className="mobile_manu_top">
                <a href="index.html"><i className="fas fa-home"></i></a>
                <i className="fas fa-times time_right"></i>
            </div>
            <ul>
                <li><a href="All page/national.html">জাতীয়</a></li>
                <li><a href="All page/politics.html">রাজনীতি</a></li>
                <li><a href="All page/game.html">খেলাধুলা</a></li>
                <li><a href="All page/entertainment.html">বিনোদন</a></li>
                <li><a href="All page/comercial.html">অর্থনীতি</a></li>
                <li><a href="All page/over-country.html">দেশজুড়ে</a></li>
                <li><a href="All page/internation.html">আন্তর্জাতিক</a></li>
                <li><a href="All page/expression.html">মতামত</a></li>
                <li><a href="All page/photogallery.html">ফটোগ্যালারি</a></li>
                <li><a href="All page/features.html">ফিচার</a></li>
                <li><a href="All page/lifestyle.html">লাইফস্টাইল</a></li>
                <li><a href="All page/ict.html">অথ্যপ্রযুক্তি</a></li>
                <li><a href="All page/travel.html">ভ্রমণ</a></li>
                <li><a href="All page/agriculture.html">কৃষি ও প্রকৃতি</a></li>
                <li><a href="All page/job.html">জোক্স</a></li>
                <li><a href="All page/ekushe.html">একুশে বইমেলা</a></li>
                <li><a href="All page/education.html">শিক্ষা</a></li>
                <li><a href="All page/campus.html">ক্যাম্পাস</a></li>
                <li><a href="All page/health.html">স্বাস্থ্য</a></li>
                <li><a href="All page/high-court.html">আইন-আদালত</a></li>
                <li><a href="All page/religion.html">ধর্ম</a></li>
                <li><a href="All page/about.html">প্রবাস</a></li>
                <li><a href="All page/news-mediam.html">গণমাধ্যম</a></li>
                <li><a href="All page/children.html">নারী ও শিশু</a></li>
            </ul>
        </div>

    </header>
  );
};

export default SinglePostHeader;
