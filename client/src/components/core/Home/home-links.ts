export interface HomeLink {
  text: string;
  to: string;
}

const homeLinks: HomeLink[] = [
  {
    text: "Блог",
    to: "/blog",
  },
  {
    text: "Отзывы",
    to: "/reviews",
  },
  {
    text: "О нас",
    to: "/about-us",
  },
];

export default homeLinks;
