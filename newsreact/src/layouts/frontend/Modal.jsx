import React, { useEffect, useState } from 'react';
import axios from '/axiosConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Modal = () => {
  const [headerData, setHeaderData] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/auth/login', { email, password });

      if (response.data.message === "Login successful") {
        toast.success('Login successful');
        localStorage.setItem('token', response.data.access_token);
        const loginModal = document.getElementById('loginModal');
        const modal = bootstrap.Modal.getInstance(loginModal);
        modal.hide();
        navigate('/admin/');

      } else {
        toast.error('Invalid credentials');
      }
    } catch (err) { 
      toast.error('An error occurred during login', err);
    }
  };

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
    <>
      <div className="goTop">
        <span className="back-to-top">
          <i className="fa-solid fa-arrow-up"></i>
        </span>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                ATN LIVE
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="atnLive">
                <iframe
                  className="responsive-iframe"
                  src={`https://www.youtube.com/embed/${headerData.video_link}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/** Login Modal */}
      <div
        className="modal fade"
        id="loginModal"
        tabIndex="-1"
        aria-labelledby="loginModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="loginModalLabel">
                Login
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="loginForm">
                <form onSubmit={handleLogin}>
                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      id="form2Example1"
                      className="form-control"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      id="form2Example2"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row mb-4">
                    <div className="col d-flex justify-content-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="form2Example31"
                          defaultChecked
                        />
                        <label className="form-check-label" htmlFor="form2Example31">
                          Remember me
                        </label>
                      </div>
                    </div>

                    <div className="col">
                      <a href="#!">Forgot password?</a>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-4"
                  >
                    Sign in
                  </button>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
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

export default Modal;
