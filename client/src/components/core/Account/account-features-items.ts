import { SvgIconTypeMap } from "@material-ui/core";
import { OverrideProps } from "@material-ui/core/OverridableComponent";
import {
  OrdersIcon,
  AccountEditIcon,
  AddressIcon,
  PasswordResetIcon,
  WishListIcon,
  CategoryIcon,
  ProductIcon,
  PostIcon,
} from "../../../assets";

interface AccountFeaturesItems {
  Svg: React.FC<
    OverrideProps<SvgIconTypeMap<Record<string, unknown>, "svg">, "svg">
  >;
  title: string;
  subtitle: string;
  url: string;
  role: 0 | 1;
}

const accountFeaturesItems: AccountFeaturesItems[] = [
  {
    Svg: OrdersIcon,
    title: "Ваши заказы",
    subtitle: "Отслеживайте свои заказы",
    url: "/orders",
    role: 0,
  },
  {
    Svg: AccountEditIcon,
    title: "Ваш профиль",
    subtitle: "редактировать ваш профиль",
    url: "/account-information",
    role: 0,
  },
  {
    Svg: WishListIcon,
    title: "Лист желаемого",
    subtitle: "Добавляйте товары в ваш лист желаемого",
    url: "/wishlist",
    role: 0,
  },
  {
    Svg: AddressIcon,
    title: "Ваш адрес",
    subtitle: "Редактировать ваш адрес",
    url: "/address",
    role: 0,
  },
  {
    Svg: PasswordResetIcon,
    title: "Изменить пароль",
    subtitle: "Изменить ваш пароль",
    url: "/password",
    role: 0,
  },
  {
    Svg: CategoryIcon,
    title: "Создать категорию",
    subtitle: "Создать новую категорию",
    url: "/category/create",
    role: 1,
  },
  {
    Svg: CategoryIcon,
    title: "Добавить производителя",
    subtitle: "Добавить нового производителя",
    url: "/brand/create",
    role: 1,
  },
  {
    Svg: ProductIcon,
    title: "Ваши продукты",
    subtitle: "Создать и редактировать ваши продукты",
    url: "/my/products",
    role: 1,
  },
  {
    Svg: PostIcon,
    title: "Ваш блог",
    subtitle: "Создать и редактировать ваши сообщения",
    url: "/my/posts",
    role: 1,
  },
];

export default accountFeaturesItems;
