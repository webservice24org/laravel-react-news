import React from 'react';



const PhotoGallery = () => {
  return (
        <section class="photo_gallery">
            <div class="section_wrapper">
                <div class="row">
                    
                    <div class="col-md-6">
                        <div class="section-title">
                            <h4 class="m-0 float-start font-weight-bold">ফটো গ্যালারি </h4>
                        </div>
                        <div id="carouselExampleSlidesOnly" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                <img src="/src/assets/frontend/img/car1.webp" class="d-block img-fluid w-100" alt="..." />
                                <div class="carousel-caption d-none d-md-block">
                                    
                                    <p>আমন রোপণের মৌসুমে ব্যস্ত সময় পার করছেন কৃষকেরা।  </p>
                                    <small>ছবি: মঈনুল ইসলাম</small>
                                </div>
                                </div>
                                <div class="carousel-item">
                                <img src="/src/assets/frontend/img/car3.webp" class="d-block img-fluid w-100" alt="..." />
                                <div class="carousel-caption d-none d-md-block">
                                    <p>বিল থেকে গবাদিপশুর খাবার ঘাস সংগ্রহ করে বাড়ি ফিরছেন এক কৃষক। </p>
                                    <small> ছবি: আলীমুজ্জামান </small>
                                </div>
                                </div>
                                <div class="carousel-item">
                                <img src="/src/assets/frontend/img/car4.webp" class="d-block img-fluid w-100" alt="..." />
                                <div class="carousel-caption d-none d-md-block">
                                    <p>ছুটির দিনে টিকিট কেটে পুকুরে বড়শি ফেলেছেন শৌখিন মৎস্যশিকারিরা। মাছও পাচ্ছেন বেশ ভালোই। </p>
                                    <small> ছবি: আলীমুজ্জামান </small>
                                </div>
                                </div>
                            </div>
                            </div>
                    </div>
                    <div class="col-md-6">
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <div class="top_news">
                                    <div class="img_box">
                                        <a href="single.html"><img class="img-fluid" src="/src/assets/frontend/img/image_102494_1720443059.webp" alt="news title" /></a>
                                    </div>
                                    <a href="single.html"><h2>হেলেনাকে অভিযুক্ত করে পুলিশের চার্জশিট
                                    </h2></a>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="top_news">
                                    <div class="img_box">
                                        <a href="single.html"><img class="img-fluid" src="/src/assets/frontend/img/image_102494_1720443059.webp" alt="news title" /></a>
                                    </div>
                                    <a href="single.html"><h2>হেলেনাকে অভিযুক্ত করে পুলিশের চার্জশিট
                                    </h2></a>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="top_news">
                                    <div class="img_box">
                                        <a href="single.html"><img class="img-fluid" src="/src/assets/frontend/img/image_102494_1720443059.webp" alt="news title" /></a>
                                    </div>
                                    <a href="single.html"><h2>হেলেনাকে অভিযুক্ত করে পুলিশের চার্জশিট
                                    </h2></a>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <div class="top_news">
                                    <div class="img_box">
                                        <a href="single.html"><img class="img-fluid" src="/src/assets/frontend/img/image_102494_1720443059.webp" alt="news title" /></a>
                                    </div>
                                    <a href="single.html"><h2>হেলেনাকে অভিযুক্ত করে পুলিশের চার্জশিট
                                    </h2></a>
                                </div>
                            </div>

                            <div class="horizental_advertise">
                                <a href="#">
                                    <img class="img-fluid" src="/src/assets/frontend/img/fpsyg-05-00166-g006.jpg" alt="" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PhotoGallery;