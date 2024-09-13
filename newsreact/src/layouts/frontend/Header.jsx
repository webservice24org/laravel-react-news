import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Leadsection from "../../components/frontend/Leadsection";
import TopVideo from "../../components/frontend/TopVideo";
import axios from '/axiosConfig';

const Header = () => {
    const [headerData, setHeaderData, menuData, setMenuData] = useState(null);

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

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const response = await axios.get('/api/menu-data');
                setMenuData(response.data); 
            } catch (error) {
                console.error("Error fetching menu data:", error);
            }
        };

        fetchMenuData();
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

                    {/* Menu will Here */}
                    <div className="bottom_header design2">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-10">
                                    <div className="manu_area">
                                        <ul>
                                            {/* Home Link */}
                                            <li className="active">
                                                <Link to="/"><i className="fas fa-home"></i></Link>
                                            </li>

                                            {/* Loop through categories */}
                                            {menuData.categories.map(category => (
                                                <li key={category.id}>
                                                    <Link to="#">{category.category_name} <span><i className="fa-solid fa-angle-down"></i></span></Link>
                                                    <ul>
                                                        {category.subcategories.map(sub => (
                                                            <li key={sub.id}>
                                                                <Link to={`/category/${category.id}/subcategory/${sub.id}`}>{sub.sub_category_name}</Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ))}

                                            {/* Loop through divisions */}
                                            <li className="all_division_parent">
                                                <Link to="#">সকল বিভাগ <span><i className="fa-solid fa-angle-down"></i></span></Link>
                                                <div className="all_division">
                                                    <div className="container">
                                                        <div className="row">
                                                            {menuData.divisions.map(division => (
                                                                <div className="col-md-3" key={division.id}>
                                                                    <div className="single_division">
                                                                        <p><Link to={`/division/${division.id}`}>{division.division_name}</Link></p>
                                                                        {division.districts.map(district => (
                                                                            <p key={district.id}>
                                                                                <Link to={`/division/${division.id}/district/${district.id}`}>{district.district_name}</Link>
                                                                            </p>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
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
