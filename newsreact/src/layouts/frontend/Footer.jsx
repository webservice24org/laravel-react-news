import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
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
                        style={{ width: "120px" }}
                        src="src/assets/frontend/img/logo-transferent.png"
                        alt="logo"
                      />
                    </Link>
                    <p className="footerAbout">
                      রাজনীতি, বাণিজ্য, খেলাধুলা, জাতীয়-আন্তর্জাতিক ব্রেকিং
                      নিউজ, বিশ্লেষণমূলক সংবাদসহ যাবতীয় খবর পেতে চোখ রাখুন
                      এটিএন নিউজে
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
                          হাসান প্লাজা, ৫৩, কাওরান বাজার সি/এ, ঢাকা-১২১৫,
                          বাংলাদেশ।
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="fa-solid fa-phone-volume"></i>
                        </span>
                        <span className="ms-2">
                          ফোনঃ +৮৮-০২ ৪১০১০৪৬৫-৬৭
                        </span>{" "}
                        <br />
                        <span>
                          <i className="fa-solid fa-fax"></i>
                        </span>
                        <span className="ms-2">
                          {" "}
                          ফ্যাক্সঃ +৮৮ ০২ ৪১০১০৪৭০
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="footerWidgets">
                  <h5 className="text-light">ড. মাহফুজুর রহমান</h5>
                  <p className="text-light">চেয়ারম্যান ও ব্যবস্থাপনা পরিচালক</p>
                </div>
              </div>
              <div className="col-sm-2">
                <div className="footerWidgets">
                  <h5 className="text-light">মো. মোশাররফ হোসেন</h5>
                  <p className="text-light">নির্বাহী পরিচালক</p>
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
                <p>সর্বস্বত্ব স্বত্বাধিকার সংরক্ষিত © ২০২৪ এটিএন নিউজ লিমিটেড</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
