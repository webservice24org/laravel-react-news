import React from 'react';
import Travel from './Travel';
import Agriculture from './Agriculture';
const Literature = () => {
    return (
        <section class="category_news_section_three">
            <div class="section_wrapper">
                <div class="row">
                    <div class="col-md-6 col-sm-12">
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="category_title">
                                    <a href="category.html"><h2>সাহিত্য</h2></a>
                                </div>
                            </div>
                        </div>
                        <div class="section_broad_news">
                            <div class="row">
                                <div class="col-md-6 col-sm-12">
                                    <div class="img_box">
                                        <a href="single.html"><img class="img-fluid" src="/src/assets/frontend/img/bcdf2ed7d408.webp" alt="news title" /></a>
                                    </div>
                                </div>
                                <div class="col-md-6 col-sm-12">
                                    <div class="category_content">
                                        <a href="single.html"><h2>ইতিহাস-কারিগরের কলমে প্রগতি সাহিত্য আন্দোলনের আদ্যোপান্ত  
                                        </h2></a>
                                        <p>বাংলা ভাষায় প্রগতি সাহিত্য আন্দোলনের ইতিহাসের অনুবাদ প্রকাশিত হয়েছে। রোশনাই নামের বইটি সাজ্জাদ জহিরের লেখা। এ বই নিয়ে কথা বলা মানে সমান গুরুত্ব দিয়ে দুটো বিষয় মাথায় রাখা, সাহিত্য আন্দোলন আর সাজ্জাদ জহির।</p>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div class="section_small_box_news">
                            <div class="two_colum_box">
                                <div class="row">
                                    <div class="col-md-6 col-sm-12">
                                        <div class="feature_small_box_news">
                                            <div class="img_box">
                                                <a href="single.html"><img class="img-fluid" src="/src/assets/frontend/img/41fb98b.webp" alt="news title" /></a>
                                            </div>
                                            <div class="feature_small_box_title">
                                                <a href="#"><h2>বাতিঘরে মুক্ত আলাপন, গান ও বর্ষা
                                                </h2></a>
                                            </div>
                                        </div>
                                    </div>
    
                                    <div class="col-md-6 col-sm-12">
                                        <div class="feature_small_box_news">
                                            <div class="img_box">
                                                <a href="single.html"><img class="img-fluid" src="/src/assets/frontend/img/image_91597_1716797466.webp" alt="news title" /></a>
                                            </div>
                                            <div class="feature_small_box_title">
                                                <a href="#"><h2>ম. রাশেদুল হাসান খানের কবিতা ‘সময়ের আলোকবর্তিকা’ 
                                                </h2></a>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6 col-sm-12">
                                        <div class="feature_small_box_news">
                                            <div class="img_box">
                                                <a href="single.html"><img class="img-fluid" src="/src/assets/frontend/img/image_91597_1716797466.webp" alt="news title" /></a>
                                            </div>
                                            <div class="feature_small_box_title">
                                                <a href="#"><h2>উৎকলিত রহমানের কবিতা ‘জ্যোতিষ্ময়ীর গান’</h2></a>
                                            </div>
                                        </div>
                                    </div>
    
                                    <div class="col-md-6 col-sm-12">
                                        <div class="feature_small_box_news">
                                            <div class="img_box">
                                                <a href="single.html"><img class="img-fluid" src="/src/assets/frontend/img/image_100292_1719776695.webp" alt="news title" /></a>
                                            </div>
                                            <div class="feature_small_box_title">
                                                <a href="#"><h2>মারা গেছেন কবি আসাদ বিন হাফিজ
                                                </h2></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-12">
                                        <div class="feature_small_box_news">
                                            <div class="img_box">
                                                <a href="single.html"><img class="img-fluid" src="/src/assets/frontend/img/news1.jpg" alt="news title" /></a>
                                            </div>
                                            <div class="feature_small_box_title">
                                                <a href="#"><h2>আতঙ্ক কেটে গেছে-সংবাদ বিশ্লেষণ </h2></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-12">
                                        <div class="feature_small_box_news">
                                            <div class="img_box">
                                                <a href="single.html"><img class="img-fluid" src="/src/assets/frontend/img/image_100561_1719851477.webp" alt="news title" /></a>
                                            </div>
                                            <div class="feature_small_box_title">
                                                <a href="#"><h2>‘অসীম সাহা কবিতায় নিজস্ব মুদ্রা তৈরি করেছেন’
                                                </h2></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                        <div class="row">
                            <div class="col-md-6 col-sm-12">
                                <Travel />
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <Agriculture />
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
};

export default Literature;