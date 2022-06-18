import React from "react";
import useAuthLayoutStyles from "./auth-layout-styles";
import {
  Box,
  Container,
  Link,
  Paper,
  Typography,
  useTheme,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { LogoPrimary } from "../../../assets";
import { Link as RouterLink } from "react-router-dom";

interface AuthLayoutProps {
  headline: string;
  authType: "login" | "signup";
  footer: string;
  children: JSX.Element | null;
  error?: string;
  success?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  headline,
  authType,
  footer,
  children,
  error,
  success,
}: AuthLayoutProps) => {
  const classes = useAuthLayoutStyles();
  const theme = useTheme();

  return (
    <Container maxWidth="sm">
      <Box my="90px">
        <Box flexDirection="column" alignItems="center" display="flex">
          <LogoPrimary
            width="20%"
            height="20%"
            fill={theme.palette.primary.main}
          />
          <Typography className={classes.headline} align="center" variant="h4">
            {headline}
          </Typography>
        </Box>

        <Paper className={classes.paper} elevation={7}>
          {(error || success) && (
            <Box mb="24px">
              <Alert severity={error ? "error" : "success"}>
                {success ? success : error}
              </Alert>
            </Box>
          )}
          {children}
        </Paper>
        <Box display="flex" justifyContent="center">
          <Typography variant="subtitle1" align="center">
            {footer}{" "}
            <Link
              component={RouterLink}
              to={`/${authType === "signup" ? "login" : "signup"}`}
            >
              {authType === "signup" ? "Войти" : "Зарегистрироваться"}!
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default AuthLayout;
