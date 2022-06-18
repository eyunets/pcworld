interface Sort {
  value: string;
  name: string;
}

const sort: Sort[] = [
  {
    value: "sold",
    name: "Лучшее по продажам",
  },
  {
    value: "createdAt",
    name: "Новые",
  },
  {
    value: "priceLowHigh",
    name: "По цене (от низкой к высокой)",
  },
  {
    value: "priceHighLow",
    name: "По цене (от высокой к низкой)",
  },
];

export default sort;
