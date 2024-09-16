import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '/axiosConfig';
import LatestPopuler from './LatestPopuler'; // Adjust import based on your file structure

const baseURL = axios.defaults.baseURL; // Replace with your actual API base URL
const postsPerPage = 6; // Adjust the number of posts per page as needed

function DistrictPosts() {
    const { districtId } = useParams(); // Get the district ID from the URL
    const [posts, setPosts] = useState([]);
    const [divisionName, setDivisionName] = useState('');
    const [districtName, setDistrictName] = useState('');
    const [divisionId, setDivisionId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch district-wise news data
        axios.get(`${baseURL}api/district-news/${districtId}`)
            .then(response => {
                setPosts(response.data.news);
                setDivisionName(response.data.division_name);
                setDistrictName(response.data.district_name);
                setDivisionId(response.data.division_id);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error fetching the news data!", error);
                setLoading(false);
            });
    }, [districtId]);

    const getExcerpt = (details) => {

        const strippedDetails = details.replace(/<\/?[^>]+(>|$)/g, '');
        return strippedDetails.split(' ').slice(0, 35).join(' ') + '...';
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > Math.ceil(posts.length / postsPerPage)) return;
        setCurrentPage(page);
    };

    const currentPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

    if (loading) {
        return <p>Loading...</p>;
    }

    const lastPost = currentPosts.length > 0 ? currentPosts[0] : null;

    return (
        <>
            <section className="bredcumb_sec">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="single_bredcumb">
                                <ul>
                                    <li><Link to="/"><i className="fa-solid fa-house"></i></Link> <span className="bredcumb_devider"><i className="fa-solid fa-angles-right"></i></span></li>
                                    <li><Link to={`/division/${divisionId}/posts`}>{divisionName}</Link><span className="bredcumb_devider"><i className="fa-solid fa-angles-right"></i></span></li>
                                    <li><Link to={`/district/${districtId}/posts`}>{districtName}</Link></li>
                                </ul>
                            </div>
                        </div> 
                    </div>
                </div>
            </section>
            <section className="single_news_page">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 col-sm-12">
                            <div className="category_news_part">
                                <div className="category_big_news">
                                    {lastPost ? (
                                        <>
                                            <div className="img_box">
                                                <a href={`/post/${lastPost.id}`}>
                                                    <img 
                                                        className="img-fluid" 
                                                        src={`${baseURL}storage/post/${lastPost.post_thumbnail}`} 
                                                        alt={lastPost.post_title} 
                                                        onError={(e) => { e.target.src = `${baseURL}storage/post/default-post.jpg`; }}
                                                    />
                                                </a>
                                            </div>
                                            <div className="category_news_post">
                                                <a href={`/post/${lastPost.id}`}>
                                                    <h2>{lastPost.post_title}</h2>
                                                </a>
                                                <p>{getExcerpt(lastPost.post_details)}</p>
                                                <a href={`/post/${lastPost.id}`} className="btn btn-success read_more">বিস্তারিত পড়ুন</a>
                                            </div>
                                        </>
                                    ) : (
                                        <p>No news available.</p>
                                    )}
                                </div>

                                <div className="category_posts">
                                    <div className="row">
                                        {currentPosts.map(post => (
                                            <div key={post.id} className="col-md-4 col-sm-12">
                                                <a href={`/post/${post.id}`}>
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <img className="img-fluid" src={`${baseURL}storage/post/${post.post_thumbnail}`} alt={post.post_title} onError={(e) => { e.target.src = `${baseURL}storage/post/default-post.jpg`; }} />
                                                            <h2>{post.post_title}</h2>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pagination">
                                    <nav aria-label="Page navigation example">
                                        <ul className="pagination">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <a className="page-link" href="#" onClick={() => handlePageChange(currentPage - 1)}>Previous</a>
                                            </li>
                                            {[...Array(Math.ceil(posts.length / postsPerPage))].map((_, index) => (
                                                <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                    <a className="page-link" href="#" onClick={() => handlePageChange(index + 1)}>{index + 1}</a>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === Math.ceil(posts.length / postsPerPage) ? 'disabled' : ''}`}>
                                                <a className="page-link" href="#" onClick={() => handlePageChange(currentPage + 1)}>Next</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>

                                <div className="horizental_advertise mt-3">
                                    <a href="#">
                                        <img className="img-fluid" src="img/horizental-ad.jpg" alt="" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <LatestPopuler />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default DistrictPosts;
