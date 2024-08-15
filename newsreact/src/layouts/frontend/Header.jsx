import React from "react";
import { Link } from "react-router-dom";
import Leadsection from "../../components/frontend/Leadsection";

const Header = () => {
    return (
        <header className="site_header">
            <div className="overlay_header">
                <div className="design2_header">
                    <div className="header_logo_area">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-2">
                                    <div className="header_logo">
                                        <Link to="#">
                                            <img src="/src/assets/frontend/img/logo.png" alt="Our First Blog Site" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-sm-2">
                                    <div className="live_button mt-3">
                                        <a className="button" data-bs-toggle="modal" data-bs-target="#exampleModal" href="#">ATN Live</a>
                                    </div>
                                </div>
                                <div className="col-sm-8 pt-3">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <img className="topNewsImg" src="/src/assets/frontend/img/outdoors.webp" alt="news title" />
                                            <Link to="#" className="topNewsTitle text-light">স্নিগ্ধ আমেজের লুকে সাফা কবির, পূজা চেরী ও নুসরাত</Link>
                                        </div>
                                        <div className="col-md-4">
                                            <img className="topNewsImg" src="/src/assets/frontend/img/yamin.webp" alt="news title" />
                                            <Link to="#" className="topNewsTitle text-light">কোটা সংস্কার আন্দোলন: গুলিবিদ্ধ আরও একজন মারা</Link>
                                        </div>
                                        <div className="col-md-4">
                                            <img className="topNewsImg" src="/src/assets/frontend/img/untitled_6.webp" alt="news title" />
                                            <Link to="#" className="topNewsTitle text-light">জাতিকে নিয়ে মশকরা কইরেন না: হাইকোর্ট</Link>
                                        </div>
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
                            <Link className="navbar-brand" to="home4.html"><img src="img/logo.png" className="mobile_logo" alt="Our First Blog Site" /></Link>
                            <div className="live_button">
                                <a className="button" data-bs-toggle="modal" data-bs-target="#exampleModal" href="#">ATN Live</a>
                            </div>
                            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li className="nav-item">
                                        <Link className="nav-link active" aria-current="page" to="index.html"><i className="fas fa-home"></i></Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            বাংলাদেশ
                                        </Link>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><Link className="dropdown-item" to="All page/national.html">জাতীয়</Link></li>
                                            <li><Link className="dropdown-item" to="All page/politics.html">রাজনীতি</Link></li>
                                            <li><Link className="dropdown-item" to="All page/comercial.html">অর্থনীতি</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            দেশজুড়ে
                                        </Link>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><Link className="dropdown-item" to="All page/district-news.html">জেলার খবর</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="All page/internation.html">আন্তর্জাতিক</Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            খেলাধুলা
                                        </Link>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><Link className="dropdown-item" to="All page/footbal.html">ফুটবল</Link></li>
                                            <li><Link className="dropdown-item" to="All page/crickcet.html">ক্রিকেট</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="All page/expression.html">মতামত</Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            বিনোদন
                                        </Link>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><Link className="dropdown-item" to="All page/hollywood.html">হলিউড</Link></li>
                                            <li><Link className="dropdown-item" to="All page/bollywood.html">বলিউড</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            ফিচার
                                        </Link>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><Link className="dropdown-item" to="All page/photogallery.html">ফটো গ্যালারি</Link></li>
                                            <li><Link className="dropdown-item" to="All page/lifestyle.html">লাইফস্টাইল</Link></li>
                                            <li><Link className="dropdown-item" to="All page/ict.html">অথ্যপ্রযুক্তি</Link></li>
                                            <li><Link className="dropdown-item" to="All page/travel.html">ভ্রমণ</Link></li>
                                            <li><Link className="dropdown-item" to="All page/agriculture.html">কৃষি ও প্রকৃতি</Link></li>
                                            <li><Link className="dropdown-item" to="All page/ekushe.html">একুশে বইমেলা</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            সকল বিভাগ
                                        </Link>
                                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <div className="row">
                                                <div className="col-6">
                                                    <Link className="dropdown-item" to="All page/education.html">শিক্ষা</Link>
                                                    <Link className="dropdown-item" to="All page/campus.html">ক্যাম্পাস</Link>
                                                    <Link className="dropdown-item" to="All page/health.html">স্বাস্থ্য</Link>
                                                    <Link className="dropdown-item" to="All page/high-court.html">আইন-আদালত</Link>
                                                </div>
                                                <div className="col-6">
                                                    <Link className="dropdown-item" to="All page/religion.html">ধর্ম</Link>
                                                    <Link className="dropdown-item" to="All page/abroad.html">প্রবাস</Link>
                                                    <Link className="dropdown-item" to="All page/news-mediam.html">গনমাধ্যম</Link>
                                                    <Link className="dropdown-item" to="All page/children.html">নারী ও শিশু</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="All page/comerce-fair.html">বাণিজ্য মেলা</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="All page/literature.html">সাহিত্য</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="All page/job.html">জাগো জবস</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="All page/eid-magazine.html">ঈদ সংখ্যা</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="All page/today.html"><span><i className="fas fa-stopwatch"></i></span> আজকের আয়োজন</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="archive.html"><span><i className="fas fa-camera-retro"></i></span> আর্কাইভ</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="All page/social.html"><span><i className="fas fa-share-alt"></i></span> সোশাল মিডিয়া</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="https://www.jagonews24.com/bangla-converter"><span><i className="fas fa-language"></i></span> ইউনিকোড কনভার্টার</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                <Leadsection />
            </div>
        </header>
    );
}

export default Header;
