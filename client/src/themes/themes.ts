import { createTheme, responsiveFontSizes } from "@material-ui/core";

export const lightTheme = responsiveFontSizes(
  createTheme({
    palette: {
      type: "light",
      primary: {
        main: "#121435",
      },
      secondary: {
        main: "#ff5722",
      },
    },
    props: {
      // Name of the component ⚛️
      MuiButtonBase: {
        // The default props to change
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
    overrides: {
      MuiCssBaseline: {
        "@global": {
          html: {
            height: "100%",
          },
          body: {
            height: "100%",
            "& > #root": {
              height: "100%",
              display: "flex",
              flexDirection: "column",
            },
          },
          footer: {
            flexShrink: 0,
          },
          a: {
            WebkitTapHighlightColor: "transparent",
          },
        },
      },
    },
  })
);
