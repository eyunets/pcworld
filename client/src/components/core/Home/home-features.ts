import {
  Stars as StarIcon,
  MonetizationOn as DollarIcon,
} from "@material-ui/icons";
import { SvgIconTypeMap } from "@material-ui/core";
import { OverrideProps } from "@material-ui/core/OverridableComponent";

export interface Feature {
  icon: React.FC<
    OverrideProps<SvgIconTypeMap<Record<string, unknown>, "svg">, "svg">
  >;
  title: string;
  subtitle: string;
}

const homeFeatures: Feature[] = [
  {
    icon: StarIcon,
    title: "Последние новинки",
    subtitle: "Мы первые предоставим вам новейшие интересные продукты.",
  },
  {
    icon: DollarIcon,
    title: "Низкие цены",
    subtitle: "Всегда лучшие цены! Только у нас!",
  },
];

export default homeFeatures;
