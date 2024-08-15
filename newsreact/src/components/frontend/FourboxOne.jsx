
import React from 'react';
import Lifestyle from './Lifestyle';
import Religion from './Religion';
import Technology from './Technology';
import Jobs from './Jobs';


const FourboxOne = () => {
  return (
    <section class="box_categories">
        <div class="section_wrapper">
            <div class="row">
                <div class="col-md-3 col-sm-12">
                    <Lifestyle />
                </div>
                <div class="col-md-3 col-sm-12">
                    <Religion />
                </div>
                <div class="col-md-3 col-sm-12">
                    <Technology />
                </div>
                <div class="col-md-3 col-sm-12">
                    <Jobs />
                </div>
            </div>
            
        </div>
    </section>
  );
};

export default FourboxOne;

