import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import {
  Badge,
  Box,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from "@material-ui/core";
import { useHistory, useLocation, Link as RouterLink } from "react-router-dom";
import useNavBarStyles from "./nav-bar-styles";
import clsx from "clsx";
import { useAuth, useFacets } from "../../../context";
import {
  PersonOutlineOutlined,
  ShoppingCartOutlined,
} from "@material-ui/icons";
import { NavLink } from "../../common";
import NavDropDownMenus from "./NavDropDownMenus";
import SearchAppBar from "./SearchAppBar";
import { LogInIcon, LogoSecondary, LogOutIcon } from "../../../assets";
import Hamburger from "hamburger-react";
import SideBar from "./SideBar";

interface ElevationScrollProps {
  children: React.ReactElement;
  isHomePage: boolean;
}

const ElevationScroll: React.FC<ElevationScrollProps> = ({
  children,
  isHomePage,
}: ElevationScrollProps) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: isHomePage && !trigger ? 0 : 4,
  });
};

const NavBar: React.FC = () => {
  const classes = useNavBarStyles();
  const theme = useTheme();
  const history = useHistory();
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const { categories, brands, badget } = useFacets();

  const [openSideBar, setOpenSideBar] = useState(false);

  const isLaptop = useMediaQuery(theme.breakpoints.up(1102));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <ElevationScroll isHomePage={pathname === "/" ? true : false}>
        <AppBar>
          <Toolbar className={classes.toolbar}>
            <div className={classes.logoContainer}>
              <LogoSecondary
                tabIndex={0}
                className={classes.logo}
                fill={pathname === "/" ? theme.palette.secondary.main : "#fff"}
                onClick={() => history.push("/")}
                onKeyDown={(e) => e.key === "Enter" && history.push("/")}
              />
            </div>
            <Box flexGrow={1} textAlign="center" p="0 2%">
              {!isMobile && (
                <Box
                  width={isLaptop ? "364px" : "240px"}
                  display="inline-block"
                  textAlign="end"
                >
                  <SearchAppBar />
                </Box>
              )}
            </Box>
            {user && !isMobile && (
              <NavLink
                className={classes.link}
                component={RouterLink}
                to="#"
                color="inherit"
                onClick={() => logout()}
              >
                <LogOutIcon className={classes.navLinkIcon} />
                {!isMobile && "??????????"}
              </NavLink>
            )}
            {!user && (
              <NavLink
                className={classes.link}
                component={RouterLink}
                to="/login"
                color="inherit"
              >
                <LogInIcon className={classes.navLinkIcon} />
                {!isMobile && "??????????"}
              </NavLink>
            )}
            {user && (
              <NavLink
                className={classes.link}
                component={RouterLink}
                to="/account"
                color={pathname === "/account" ? "secondary" : "inherit"}
              >
                <PersonOutlineOutlined
                  className={clsx(classes.navLinkIcon, "account")}
                />
                {!isMobile && "??????????????"}
              </NavLink>
            )}
            <NavLink
              className={clsx(classes.link, "cart")}
              component={RouterLink}
              to="/cart"
              color={pathname === "/cart" ? "secondary" : "inherit"}
            >
              <Box
                className={clsx(classes.navLinkIcon, "cart")}
                display="inline"
              >
                <Badge badgeContent={badget} color="secondary">
                  <ShoppingCartOutlined />
                </Badge>
              </Box>
              {!isMobile && "??????????????"}
            </NavLink>
            {isMobile && (
              <NavLink className={classes.link} color="inherit">
                <Box width="35px" height="42px">
                  <Hamburger
                    toggled={openSideBar}
                    toggle={setOpenSideBar}
                    rounded
                    size={22}
                    distance="sm"
                  />
                </Box>
              </NavLink>
            )}
            {isMobile && (
              <SideBar
                facets={{ categories, brands }}
                sideBarState={{ openSideBar, setOpenSideBar }}
              />
            )}
          </Toolbar>
          <Box
            className={classes.categoryBar}
            bgcolor="primary.main"
            color="primary.contrastText"
          >
            {isMobile ? (
              <Box width="70vw">
                <SearchAppBar />
              </Box>
            ) : (
              <NavDropDownMenus facets={{ categories, brands }} />
            )}
          </Box>
        </AppBar>
      </ElevationScroll>
      <Toolbar className={classes.toolbar} />
      <Box height="48px" />
      <Box
        height="33px"
        bgcolor={pathname === "/" ? "primary.main" : "transparent"}
      />
    </>
  );
};

export default NavBar;
