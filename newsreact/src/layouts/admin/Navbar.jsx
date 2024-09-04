import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "/axiosConfig"; 
import { toast } from "react-toastify";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('api/auth/logout');
            localStorage.removeItem('token');
            toast.success('Logout successful');
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
            toast.error('An error occurred during logout');
        }
    };

    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            <Link className="navbar-brand ps-3" to="/admin">অনুসন্ধান নিউজ</Link>

            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" to="#!">
                <i className="fas fa-bars"></i>
            </button>
            <Link className="btn btn-success" to="/" target="__blank">Visit Site</Link>
            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                <div className="input-group">
                    <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                    <button className="btn btn-primary" id="btnNavbarSearch" type="button">
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </form>

            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" id="navbarDropdown" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="fas fa-user fa-fw"></i>
                    </Link>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><Link className="dropdown-item" to="#!">Settings</Link></li>
                        <li><Link className="dropdown-item" to="#!">Activity Log</Link></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link className="dropdown-item" to="#" onClick={handleLogout}>Logout</Link></li>
                    </ul>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
