import React from "react";
import { Container, Typography } from "@material-ui/core";
import useAboutUsStyles from "./about-us-styles";

const AboutUs: React.FC = () => {
  const classes = useAboutUsStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h4">
        О магазине PC World
      </Typography>
      <section className={classes.sectionWhite}>
        <Container maxWidth="lg">
          <Typography className={classes.sectionHeader} variant="h5">
            Наша миссия
          </Typography>
          <Typography className={classes.sectionContent} variant="h6">
            Предоставить вам компьютерное оборудование высочайшего качества,
            лучшее обслуживание по лучшей цене.
          </Typography>
        </Container>
      </section>
      <section className={classes.sectionPrimary}>
        <Container maxWidth="lg">
          <Typography className={classes.sectionHeader} variant="h5">
            Наши продукты
          </Typography>
          <Typography className={classes.sectionContent} variant="h6">
            Мы всегда следим за тем, чтобы наши продукты были лучшими качества
            через тестирование и поддержку,чтобы у вас не возникли проблемы с
            нашими продуктами.
          </Typography>
        </Container>
      </section>
      <section className={classes.sectionWhite}>
        <Container maxWidth="lg">
          <Typography className={classes.sectionHeader} variant="h5">
            Наша цель
          </Typography>
          <Typography className={classes.sectionContent} variant="h6">
            Стать крупным поставщиком оборудования для ПК в мире технологий
            сейчас, когда Интернет-магазины становятся все популярнее, чем
            когда-либо. Мы намерены предоставить нашим технически подкованным
            людям наилучший опыт онлайн-покупок.
          </Typography>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;
