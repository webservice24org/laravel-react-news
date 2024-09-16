//categoryPost.jsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '/axiosConfig';
import LatestPopuler from './LatestPopuler';
const CategoryPost = () => {
    const { categoryId } = useParams();
    const [posts, setPosts] = useState([]);
    const [lastPost, setLastPost] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [subCategories, setSubCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(6);
    const baseURL = axiosInstance.defaults.baseURL;

    useEffect(() => {
        axiosInstance.get(`/api/posts/category/${categoryId}`)
          .then(response => {
            setCategoryName(response.data.categoryName);
            const allPosts = response.data.posts;
            if (allPosts && allPosts.length > 0) {
              setLastPost(allPosts[allPosts.length - 1]);
              const postsToDisplay = allPosts.slice(0, -1).slice(-(postsPerPage + 1));
              setPosts(postsToDisplay);
            }
          })
          .catch(error => {
            console.error('Error fetching posts:', error);
          });

        axiosInstance.get(`/api/categories/${categoryId}/subcategories`)
          .then(response => {
            setSubCategories(response.data.subCategories);
          })
          .catch(error => {
            console.error('Error fetching sub-categories:', error);
          });
    }, [categoryId]);

    const getExcerpt = (details) => {
        const strippedDetails = details.replace(/<\/?[^>]+(>|$)/g, '');
        return strippedDetails.split(' ').slice(0, 35).join(' ') + '...';
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <>
        <section className="bredcumb_sec">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="single_bredcumb">
                            <ul>
                                <li><a href="/"><i className="fa-solid fa-house"></i></a> <span className="bredcumb_devider"><i className="fa-solid fa-angles-right"></i></span></li>
                                <li><Link to={`/category/${categoryId}/posts`}>{categoryName}</Link><span className="bredcumb_devider"><i className="fa-solid fa-angles-right"></i></span></li>
                                { 
                                    subCategories.map((subCategory, index) => (
                                        <li key={index}>
                                            <Link to={`/category/${categoryId}/subcategory/${subCategory.id}/posts`}>{subCategory.name}</Link>
                                            {index !== subCategories.length - 1 && (
                                                <span className="bredcumb_devider"><i className="fa-solid fa-grip-lines-vertical ps-1"></i></span>
                                            )}
                                        </li>
                                    ))
                                }

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
                                    <p>Loading...</p>
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
};

export default CategoryPost;
