import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import HomeCarousel from "./HomeCarousel";
import homeCarouselFeatures from "./home-carousel-features";
import homeFeatures from "./home-features";
import HomeFeatures from "./HomeFeatures";
import ReviewCarousel from "./ReviewCarousel";
import carouselReviews from "./carousel-reviews";
import HomeLinks from "./HomeLinks";
import homeLinks from "./home-links";
import { ProductSlider } from "../../common";
import { getProducts, Product } from "../../../api/product";
import axios from "axios";
import { useCancelToken } from "../../../helpers";
import HomeBrands from "./HomeBrands";
import homeBrands from "./home-brands";

const Home: React.FC = () => {
  const cancelSource = useCancelToken();
  const [productsBySell, setProductsBySell] = useState<Product[]>([]);
  const [productsByArrival, setProductsByArrival] = useState<Product[]>([]);

  const loadProductsBySell = () => {
    getProducts({ sortBy: "sold", limit: 10 }, cancelSource.current?.token)
      .then((response) => {
        setProductsBySell([...response.data.products]);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.log(err.response.data.error);
        }
      });
  };

  const loadProductsByArrival = () => {
    getProducts({ sortBy: "createdAt", limit: 10 }, cancelSource.current?.token)
      .then((response) => {
        setProductsByArrival([...response.data.products]);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          console.log(err.response.data.error);
        }
      });
  };

  useEffect(
    () => {
      setTimeout(() => {
        loadProductsBySell();
        loadProductsByArrival();
      }, 1500);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <HomeCarousel features={homeCarouselFeatures} />
      <HomeFeatures features={homeFeatures} />
      <ReviewCarousel reviews={carouselReviews} />
      <HomeLinks links={homeLinks} />
      {
        // productsBySell.length !== 0 &&
        <Box mb="200px">
          <ProductSlider title="???????????????????? ????????????" products={productsBySell} />
        </Box>
      }
      {
        // productsByArrival.length !== 0 &&
        <Box mb="200px">
          <ProductSlider title="?????????? ????????????????" products={productsByArrival} />
        </Box>
      }
      <Box mb="90px">
        <HomeBrands brands={homeBrands} />
      </Box>
    </>
  );
};

export default Home;
