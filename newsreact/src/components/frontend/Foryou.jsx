import React from 'react';


const Foryou = () => {
  return (
    <section class="category_news_section_one news_for_you">
    <div class="container-fluid pt-5 mb-3">
        <div class="section_wrapper">
            <div class="section-title">
                <h4 class="m-0 text-uppercase font-weight-bold">আপনার জন্য </h4>
            </div>
            <div class="owl-carousel news-carousel carousel-item-4 position-relative">
                <div class="position-relative overflow-hidden" style={{height: "300px;"}}>
                    <img class="img-fluid h-100" src="/src/assets/frontend/img/news-700x435-1.jpg" style={{ objectFit: "cover" }}  />
                    <div class="overlay">
                        <div class="mb-2">
                        </div>
                        <a class="h6 m-0 text-white " href="">সরকার ইন্টারনেট বন্ধ করেনি, বন্ধ হয়ে গেছে...</a>
                    </div>
                </div>
                <div class="position-relative overflow-hidden" style={{height: "300px;"}}>
                    <img class="img-fluid h-100" src="/src/assets/frontend/img/news-700x435-2.jpg" style={{ objectFit: "cover" }}  />
                    <div class="overlay">
                        <div class="mb-2">
                        </div>
                        <a class="h6 m-0 text-white " href="">যুক্তরাষ্ট্র থেকে শাফিনের মরদেহ আসছে ...</a>
                    </div>
                </div>
                <div class="position-relative overflow-hidden" style={{height: "300px;"}}>
                    <img class="img-fluid h-100" src="/src/assets/frontend/img/news-700x435-3.jpg" style={{ objectFit: "cover" }}  />
                    <div class="overlay">
                        <div class="mb-2">
                        </div>
                        <a class="h6 m-0 text-white " href="">ছয় দিনেও আসেনি এক দিনের সমান প্রবাসী আয় 
                        </a>
                    </div>
                </div>
                <div class="position-relative overflow-hidden" style={{height: "300px;"}}>
                    <img class="img-fluid h-100" src="/src/assets/frontend/img/news-700x435-4.jpg" style={{ objectFit: "cover" }}  />
                    <div class="overlay">
                        <div class="mb-2">
                        </div>
                        <a class="h6 m-0 text-white " href="">কাল থেকে ব্যাংকের সব শাখা খোলা</a>
                    </div>
                </div>
                <div class="position-relative overflow-hidden" style={{height: "300px;"}}>
                    <img class="img-fluid h-100" src="/src/assets/frontend/img/news-700x435-5.jpg" style={{ objectFit: "cover" }}  />
                    <div class="overlay">
                        <div class="mb-2">
                        </div>
                        <a class="h6 m-0 text-white text-uppercase font-weight-semi-bold" href="">আহতদের যথাযথ চিকিৎসার আশ্বাস প্রধানমন্ত্রীর
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
  );
};

export default Foryou;
