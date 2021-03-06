import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Carousel, CustomButton } from "../../../common";
import { motion } from "framer-motion";
import useHomeCarouselStyles from "./home-carousel-styles";
import carouselAnimationVariants from "./carousel-animation-variants";
import { HomeCarouselFeature } from "../home-carousel-features";
import { Link } from "react-router-dom";

interface HomeCarouselProps {
  features: HomeCarouselFeature[];
}

const HomeCarousel: React.FC<HomeCarouselProps> = React.memo(
  ({ features }: HomeCarouselProps) => {
    const classes = useHomeCarouselStyles();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const MotionBox = motion(Box);
    const {
      topHeadlineVariants,
      bottomHeadlineVariants,
    } = carouselAnimationVariants;

    const [variant, setVariant] = useState("hidden");
    useEffect(() => {
      setVariant("visible");
    }, []);

    return (
      <Carousel>
        <Box p="90px 12%">
          <Box height="376px" p="3%">
            <Grid
              className={classes.slide}
              container
              direction="column"
              justify="space-between"
              alignItems="center"
            >
              <Grid
                component={Box}
                item
                alignSelf={isMobile ? "center" : "flex-start"}
              >
                <Typography variant="h1">
                  <MotionBox
                    fontWeight={700}
                    textAlign={isMobile ? "center" : "left"}
                    initial="hidden"
                    animate={variant}
                    variants={topHeadlineVariants}
                  >
                    Оставайтесь дома
                  </MotionBox>
                </Typography>
              </Grid>
              <Grid
                component={Box}
                item
                alignSelf={isMobile ? "center" : "flex-end"}
              >
                <Typography variant="h1">
                  <MotionBox
                    fontWeight={700}
                    textAlign={isMobile ? "center" : "left"}
                    initial="hidden"
                    animate={variant}
                    variants={bottomHeadlineVariants}
                  >
                    Покупайте безопасно
                  </MotionBox>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {features.map((feature, i) => (
          <Box key={i} p="90px 12%">
            <Box height="376px">
              <Grid
                className={classes.slide}
                container
                justify="space-between"
                alignItems="center"
                direction={isMobile ? "column-reverse" : "row"}
              >
                <Grid
                  component={Box}
                  item
                  sm={5}
                  textAlign={isMobile ? "center" : "left"}
                >
                  <Box
                    mb={3}
                    fontSize={isMobile ? "h4.fontSize" : "h2.fontSize"}
                    fontWeight={700}
                  >
                    {feature.headline}
                  </Box>
                  <CustomButton
                    component={Link}
                    to={feature.link}
                    variant="contained"
                    color="secondary"
                  >
                    {feature.buttonText}
                  </CustomButton>
                </Grid>
                <Grid
                  component={Box}
                  item
                  sm={6}
                  height={isMobile ? "55%" : "100%"}
                >
                  <img className={classes.image} src={feature.image} />
                </Grid>
              </Grid>
            </Box>
          </Box>
        ))}
      </Carousel>
    );
  }
);

HomeCarousel.displayName = "HomeCarousel";

export default HomeCarousel;
