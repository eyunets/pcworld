interface MenuItem {
  itemTitle: string;
  itemURL: string;
}

const menuItems: MenuItem[] = [
  {
    itemTitle: "Домой",
    itemURL: "/",
  },
  {
    itemTitle: "Войти",
    itemURL: "/login",
  },
  {
    itemTitle: "Зарегистрироваться",
    itemURL: "/signup",
  },
];

export default menuItems;
