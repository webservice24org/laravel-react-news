
import React from 'react';
import ArtCulture from './ArtCulture';
import Openion from './Openion';
import Crime from './Crime';
import Entertainment from './Entertainment';


const FourboxOne = () => {
  return (
    <section class="category_card_news">
        <div class="section_wrapper">
            <div class="row">
                <div class="col-md-3 col-sm-12">
                    <ArtCulture />
                </div>
                <div class="col-md-3 col-sm-12">
                    <Openion />
                </div>
                <div class="col-md-3 col-sm-12">
                    <Crime />
                </div>
                <div class="col-md-3 col-sm-12">
                    <Entertainment />
                </div>
            </div>
            
        </div>
    </section>
  );
};

export default FourboxOne;

