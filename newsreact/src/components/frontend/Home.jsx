// src/components/frontend/Home.jsx
import React from 'react';
import Featuresection from "./Featuresection";
import National from "./National";
import International from './International';
import Foryou from './Foryou';
import FourboxOne from './FourboxOne';
import PoliticsLaw from './PoliticsLaw';
import HorizentalAdd from './HorizentalAdd';
import Economics from './Economics';
import SpecialNews from './SpecialNews';
import Literature from './Literature';
import Sports from './Sports';
import FourboxTwo from './FourboxTwo';
import PhotoGallery from './PhotoGallery';
import Video from './Video';



const Home = () => {
  return (
    <>
      <Featuresection />
      <National />
      <International />
      <Foryou />
      <FourboxOne />
      <PoliticsLaw />
      <HorizentalAdd />
      <Economics />
      <SpecialNews />
      <Literature />
      <Sports />
      <FourboxTwo />
      
      <Video />
    </>
  );
};

export default Home;
