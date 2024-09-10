import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '/axiosConfig';

const Footer = () => {
  const [footerInfo, setFooterInfo] = useState(null);

  useEffect(() => {
    const fetchFooterInfo = async () => {
      try {
        const response = await axios.get('/api/footer-infos');
        if (response.data && response.data.length > 0) {
          setFooterInfo(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching footer information:', error);
      }
    };

    fetchFooterInfo();
  }, []);

  if (!footerInfo) {
    return <div>Loading...</div>;
  }

  return (
    <footer>
      <div className="topFooter" style={{ background: "url('src/assets/frontend/img/footer-bg.jpg')" }}>
        <div className="topFooterBg">
          <div className="container">
            <div className="row">
              <div className="col-sm-4">
                <div className="footerWidgets">
                  <div className="footerLogo">
                    <Link to="#">
                      <img
                        className="img-fluid"
                        src={`${axios.defaults.baseURL}storage/logo/${footerInfo.footer_logo}`}
                        alt="logo"
                      />
                    </Link>
                    <p className="footerAbout">
                      {footerInfo.footer_info}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="footerWidgets">
                  <div className="footerLinks">
                    <h2 className="footerTitle">যোগাযোগঃ</h2>
                    <span className="footerTitleBorder"></span>
                    <ul>
                      <li>
                        <span>
                          <i className="fa-solid fa-location-dot"></i>
                        </span>
                        <span className="ms-2">
                          {footerInfo.address_one}, {footerInfo.address_two}
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="fa-solid fa-phone-volume"></i>
                        </span>
                        <span className="ms-2">
                          ফোনঃ {footerInfo.phone}
                        </span>{" "}
                        <br />
                        <span>
                          <i className="fa-solid fa-mobile-screen-button"></i>
                        </span>
                        <span className="ms-2">
                          মোবাইলঃ {footerInfo.mobile}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="footerWidgets">
                  <h5 className="text-light">{footerInfo.chairman_name}</h5>
                  <p className="text-light">{footerInfo.chairman_designation}</p>
                </div>
              </div>
              <div className="col-sm-2">
                <div className="footerWidgets">
                  <h5 className="text-light">{footerInfo.md_name}</h5>
                  <p className="text-light">{footerInfo.md_designation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bottomFooter">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="siteWoner">
                <p>সর্বস্বত্ব স্বত্বাধিকার সংরক্ষিত © ২০২৪ অনুসন্ধান নিউজ লিমিটেড</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
