import pc1 from "../../../assets/images/pc1.png";

export interface HomeCarouselFeature {
  headline: string;
  buttonText: string;
  link: string;
  image: string;
}

const homeCarouselFeatures: HomeCarouselFeature[] = [
  {
    headline: "Купить комплектующие, еще никогда не было так легко",
    buttonText: "Заказать сейчас",
    link: "/shop",
    image: pc1,
  },
];

export default homeCarouselFeatures;
