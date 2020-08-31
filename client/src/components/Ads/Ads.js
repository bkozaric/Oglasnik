import React, { useState, useEffect, useContext } from 'react';
import "./Ads.css";
import Ad from "./Ad/Ad";
import { LoggedContext } from '../../LoggedContext';
import AdFilter from "../AdFilter/AdFilter";

function Ads() {
  const [ads, setAds] = useState([]);
  const [adsConst, setAdsConst] = useState([]);
  const sessionInfo = useContext(LoggedContext);

  const getAds = async () => {
    try {
      const response = await fetch("/api/ads/");
      const adsJson = await response.json();
      setAdsConst(adsJson);
      setAds(adsJson);
    }
    catch (err) {
      console.error(err);
    }
  }

  const getCategories = async () => {
    try {
      const response = await fetch("/api/categories/");
      const categoriesAds = await response.json();
      //console.log(categoriesAds);
    }
    catch (err) {
      console.error(err);
    }
  }

  const filterList = async (input) => {
    let filteredList = [];
    adsConst.forEach((ad) => {
      if (ad.title.toLowerCase().includes(input.toLowerCase())) {
        filteredList.push(ad);
      }
    })
    setAds(filteredList);
  }

  useEffect(() => {
    getAds();
    getCategories();
  }, []);

  return (
    <div className="container">
      <AdFilter filterList={filterList} />
      {ads.map((ad) => (<Ad refreshComponent={getAds} key={ad.id} id={ad.id} title={ad.title} desc={ad.description} price={ad.price} image={ad.image} addedBy={ad.addedBy} sessionInfo={sessionInfo} />))}
    </div>
  );
}

export default Ads;
