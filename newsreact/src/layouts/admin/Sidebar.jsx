import React from "react";
import {Link} from "react-router-dom";
const Sidebar = () =>{
    return (
        <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
                <div className="nav">
                    <div className="sb-sidenav-menu-heading">Core</div>
                    <Link className="nav-link" to="/admin/">
                        <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                        Dashboard
                    </Link>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#collapsePostManagement" aria-expanded="false" aria-controls="collapsePostManagement">
                        <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                        News Posts
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="collapsePostManagement" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/admin/posts">All News Posts</Link>
                            <Link className="nav-link" to="/admin/posts/create">Add New Post</Link>
                            <Link className="nav-link" to="/admin/video-news">Video News</Link>
                        </nav>
                    </div>
                    
                    <div className="sb-sidenav-menu-heading">Interface</div>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#collapseUserManagement" aria-expanded="false" aria-controls="collapseUserManagement">
                        <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                        User Management
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="collapseUserManagement" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/admin/role">User Roles</Link>
                            <Link className="nav-link" to="/admin/permission">User Permissions</Link>
                            <Link className="nav-link" to="/admin/users">Users</Link>
                        </nav>
                    </div>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#collapseDivisionManagement" aria-expanded="false" aria-controls="collapseDivisionManagement">
                        <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                        News Settings
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="collapseDivisionManagement" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/admin/division">Divisions</Link>
                            <Link className="nav-link" to="/admin/district">Districts</Link>
                            <Link className="nav-link" to="/admin/categories">Categories</Link>
                            <Link className="nav-link" to="/admin/sub-categories">Sub Categories</Link>
                            <Link className="nav-link" to="/admin/tags">Tags</Link>
                        </nav>
                    </div>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#collapseThemeSettings" aria-expanded="false" aria-controls="collapseThemeSettings">
                        <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                        Theme Settings
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="collapseThemeSettings" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav">
                            <Link className="nav-link" to="/admin/footer-settings">Footer Settings</Link>
                            <Link className="nav-link" to="/admin/header-settings">Header Settings</Link>
                            <Link className="nav-link" to="/admin/menu-settings">Menu Settings</Link>
                            <Link className="nav-link" to="/admin/sub-menu-settings">Sub Menu Settings</Link>
                        </nav>
                    </div>
                    <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages">
                        <div className="sb-nav-link-icon"><i className="fas fa-book-open"></i></div>
                        Pages
                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                    </Link>
                    <div className="collapse" id="collapsePages" aria-labelledby="headingTwo" data-bs-parent="#sidenavAccordion">
                        <nav className="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                            <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#pagesCollapseAuth" aria-expanded="false" aria-controls="pagesCollapseAuth">
                                Authentication
                                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                            </Link>
                            <div className="collapse" id="pagesCollapseAuth" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordionPages">
                                <nav className="sb-sidenav-menu-nested nav">
                                    <Link className="nav-link" to="login.html">Login</Link>
                                    <Link className="nav-link" to="register.html">Register</Link>
                                    <Link className="nav-link" to="password.html">Forgot Password</Link>
                                </nav>
                            </div>
                            <Link className="nav-link collapsed" to="#" data-bs-toggle="collapse" data-bs-target="#pagesCollapseError" aria-expanded="false" aria-controls="pagesCollapseError">
                                Error
                                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                            </Link>
                            <div className="collapse" id="pagesCollapseError" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordionPages">
                                <nav className="sb-sidenav-menu-nested nav">
                                    <Link className="nav-link" to="401.html">401 Page</Link>
                                    <Link className="nav-link" to="404.html">404 Page</Link>
                                    <Link className="nav-link" to="500.html">500 Page</Link>
                                </nav>
                            </div>
                        </nav>
                    </div>
                    <Link className="nav-link" to="/admin/advertising">
                        <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                        Advertising
                    </Link>
                    
                </div>
            </div>
        </nav>
    );
}

export default Sidebar;