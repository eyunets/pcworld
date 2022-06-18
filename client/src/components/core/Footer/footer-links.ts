interface FooterLink {
  text: string;
  to: string;
}

const footerLinks: FooterLink[] = [
  {
    text: "Блог",
    to: "/blog",
  },
  {
    text: "О нас",
    to: "/about-us",
  },
];

export default footerLinks;
