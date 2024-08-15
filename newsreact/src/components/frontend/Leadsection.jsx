
import React from 'react';

const Leadsection = () => {
  return (
    <>
      <section className="lead_section design2">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="lead_title design2">
                <a href="#">
                  <h2>ট্রেন চলাচল বন্ধ, কর্মহীন শত শত মানুষ</h2>
                </a>
                <p className="news_exerpt">
                  রাজু আহম্মেদ (২৫)। বাড়ি ভৈরব জেলার আশুগঞ্জ থানার সোনারামপুর গ্রামে। বিগত দশ বছরের অধিক সময় ধরে ময়মনসিংহ রেলওয়ে স্টেশনের দুই নম্বর প্লাটফর্মে খাঁচিতে করে ব্যবসা করেন কলা-রুটির।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        className="header_section_bg bg_css"
        style={{ background: "url('src/assets/frontend/img/metro.webp')" }}
      ></div>
    </>
  );
};

export default Leadsection;

