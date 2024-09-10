import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Leadsection from "../../components/frontend/Leadsection";
import TopVideo from "../../components/frontend/TopVideo";
import axios from '/axiosConfig';

const Header = () => {
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
        <header className="site_header">
            <div className="overlay_header">
                <div className="design2_header">
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

                    {/* Test menu start */}
                    <div className="bottom_header design2">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-10">
                                    <div className="manu_area">
                                        <ul>
                                            <li className="active"><Link to="/"><i className="fas fa-home"></i></Link></li>
                                            <li>
                                                <Link to="#">বাংলাদেশ <span><i className="fa-solid fa-angle-down"></i></span></Link>
                                                <ul>
                                                    <li><Link to="All page/national.html">জাতীয়</Link></li>
                                                    <li><Link to="All page/politics.html">রাজনীতি</Link></li>
                                                    <li><Link to="All page/comercial.html">অর্থনীতি</Link></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <Link to="All page/over-country.html">দেশজুড়ে <span><i className="fa-solid fa-angle-down"></i></span></Link>
                                                <ul>
                                                    <li><Link to="All page/district-news.html">জেলার খবর</Link></li>
                                                </ul>
                                            </li>
                                            <li><Link to="All page/internation.html">আন্তর্জাতিক</Link></li>
                                            <li>
                                                <Link to="All page/game.html">খেলাধুলা <span><i className="fa-solid fa-angle-down"></i></span></Link>
                                                <ul>
                                                    <li><Link to="All page/footbal.html">ফুটবল</Link></li>
                                                    <li><Link to="All page/crickcet.html">ক্রিকেট</Link></li>
                                                </ul>
                                            </li>
                                            <li><Link to="All page/expression.html">মতামত</Link></li>
                                            <li>
                                                <Link to="All page/entertainment.html">বিনোদন <span><i className="fa-solid fa-angle-down"></i></span></Link>
                                                <ul>
                                                    <li><Link to="All page/hollywood.html">হলিউড</Link></li>
                                                    <li><Link to="All page/bollywood.html">বলিউড</Link></li>
                                                </ul>
                                            </li>
                                            <li>
                                                <Link to="All page/features.html">ফিচার <span><i className="fa-solid fa-angle-down"></i></span></Link>
                                                <ul>
                                                    <li><Link to="All page/photogallery.html">ফটো গ্যালারি</Link></li>
                                                    <li><Link to="All page/lifestyle.html">লাইফস্টাইল</Link></li>
                                                    <li><Link to="All page/ict.html">অথ্যপ্রযুক্তি</Link></li>
                                                    <li><Link to="All page/travel.html">ভ্রমণ</Link></li>
                                                    <li><Link to="All page/agriculture.html">কৃষি ও প্রকৃতি</Link></li>
                                                    <li><Link to="All page/ekushe.html">একুশে বইমেলা</Link></li>
                                                </ul>
                                            </li>
                                            <li className="all_division_parent">
                                                <Link to="#">সকল বিভাগ <span><i className="fa-solid fa-angle-down"></i></span></Link>
                                                <div className="all_division">
                                                    <div className="container">
                                                        <div className="row">
                                                            <div className="col-md-3">
                                                                <div className="single_division">
                                                                    <p><Link to="All page/education.html">শিক্ষা</Link></p>
                                                                    <p><Link to="All page/campus.html">ক্যাম্পাস</Link></p>
                                                                    <p><Link to="All page/health.html">স্বাস্থ্য</Link></p>
                                                                    <p><Link to="All page/high-court.html">আইন-আদালত</Link></p>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="single_division">
                                                                    <p><Link to="All page/religion.html">ধর্ম</Link></p>
                                                                    <p><Link to="All page/abroad.html">প্রবাস</Link></p>
                                                                    <p><Link to="All page/news-mediam.html">গনমাধ্যম</Link></p>
                                                                    <p><Link to="All page/children.html">নারী ও শিশু</Link></p>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="single_division">
                                                                    <p><Link to="All page/comerce-fair.html">বাণিজ্য মেলা</Link></p>
                                                                    <p><Link to="All page/literature.html">সাহিত্য</Link></p>
                                                                    <p><Link to="All page/job.html">জাগো জবস</Link></p>
                                                                    <p><Link to="All page/eid-magazine.html">ঈদ সংখ্যা</Link></p>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <div className="single_division">
                                                                    <p><Link to="All page/today.html"><span><i className="fas fa-stopwatch"></i></span> আজকের আয়োজন</Link></p>
                                                                    <p><Link to="archive.html"><span><i className="fas fa-camera-retro"></i></span> আর্কাইভ</Link></p>
                                                                    <p><Link to="All page/social.html"><span><i className="fas fa-share-alt"></i></span> সোশাল মিডিয়া</Link></p>
                                                                    <p><Link to="https://www.jagonews24.com/bangla-converter"><span><i className="fas fa-language"></i></span> ইউনিকোড কনভার্টার</Link></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <a className="loginBtn btn btn-light" data-bs-toggle="modal" data-bs-target="#loginModal" href="#">Login</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mobile_manu">
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container-fluid">
                            <Link className="navbar-brand" to="home4.html"><img src={`/src/assets/frontend/img/${headerData.header_logo}`} className="mobile_logo" alt="Header Logo" /></Link>
                            <div className="live_button">
                                <a className="button" href={headerData.video_link} target="_blank" rel="noopener noreferrer">
                                    {headerData.video_btn_text}
                                </a>
                            </div>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                    <li className="nav-item">
                                        <Link className="nav-link active" to="/">Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="#">বাংলাদেশ <i className="fa-solid fa-angle-down"></i></Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="#">দেশজুড়ে <i className="fa-solid fa-angle-down"></i></Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="#">আন্তর্জাতিক</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="#">খেলাধুলা <i className="fa-solid fa-angle-down"></i></Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="#">মতামত</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="#">বিনোদন <i className="fa-solid fa-angle-down"></i></Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="#">ফিচার <i className="fa-solid fa-angle-down"></i></Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="#">সকল বিভাগ <i className="fa-solid fa-angle-down"></i></Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            <Leadsection />
        </header>
    );
};

export default Header;
