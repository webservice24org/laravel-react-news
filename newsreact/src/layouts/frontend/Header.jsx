import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Leadsection from "../../components/frontend/Leadsection";
import TopVideo from "../../components/frontend/TopVideo";
import axios from '/axiosConfig';

const Header = () => {
    const [headerData, setHeaderData] = useState(null);
    const [menus, setMenus] = useState([]); 

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

                const menuResponse = await axios.get('/api/menu/');
                const menusData = menuResponse.data.data;

                const menusWithSubMenus = await Promise.all(
                    menusData.map(async (menu) => {
                        const subMenuResponse = await axios.get(`/api/menu/${menu.id}/sub-menus`);
                        return {
                            ...menu,
                            sub_menus: subMenuResponse.data.sub_menus
                        };
                    })
                );

                setMenus(menusWithSubMenus);
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
                                        <Link to="/">
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

                    <div className="bottom_header design2">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-10">
                                    <div className="manu_area">
                                        <ul>
                                            <li className="active">
                                                <Link to="/"><i className="fas fa-home"></i></Link>
                                            </li>
                                            {menus.map((menu) => (
                                                <li key={menu.id}>
                                                    <a href={`/${menu.link}`}>
                                                        {menu.name}
                                                        {menu.sub_menus && menu.sub_menus.length > 0 && (
                                                            <span><i className="fa-solid fa-angle-down"></i></span>
                                                        )}
                                                    </a>
                                                    {menu.sub_menus && menu.sub_menus.length > 0 && (
                                                        <ul>
                                                            {menu.sub_menus.map((subMenu) => (
                                                                <li key={subMenu.id}>
                                                                    <a href={`/${subMenu.link}`}>{subMenu.name}</a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>
                                            ))}
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

                {/* Mobile menu will be here */}
            </div>
            <Leadsection />
        </header>
    );
};

export default Header;
