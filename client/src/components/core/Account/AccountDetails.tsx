import { Box, Typography } from "@material-ui/core";
import React from "react";
import useAccountStyles from "./account-styles";

interface AccountDetailsProps {
  name: string;
}

const AccountDetails: React.FC<AccountDetailsProps> = ({
  name,
}: AccountDetailsProps) => {
  const classes = useAccountStyles();

  return (
    <Box mb="90px" ml="9vw">
      <Typography className={classes.accountName} variant="h3" color="primary">
        <b>Привет, {name}!</b>
      </Typography>
      <Typography variant="h5">
        <b>Добро пожаловать в ваш профиль.</b>
      </Typography>
    </Box>
  );
};

export default AccountDetails;
