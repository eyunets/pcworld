import { Box, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { updateUser } from "../../../api/user";
import { useAuth } from "../../../context";
import { CustomButton, FormLayout } from "../../common";
import useAccountInformationStyles from "./account-information-styles";

interface State {
  edit: boolean;
  value: string;
  isSubmitting: boolean;
  error?: string;
}

const AccountInformation: React.FC = () => {
  const classes = useAccountInformationStyles();
  const { user, setUser } = useAuth();
  const [state, setState] = useState<State>({
    value: user?.name as string,
    edit: false,
    isSubmitting: false,
  });

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setState({ ...state, value });
  };

  const onSubmit = () => {
    setState({ ...state, isSubmitting: true });
    updateUser(state.value)
      .then((response) => {
        const updatedUser = response.data;
        setState({
          value: updatedUser.name,
          edit: false,
          isSubmitting: false,
        });
        setUser({ user: updatedUser, isLoading: false });
      })
      .catch((err) => {
        setState({
          isSubmitting: false,
          value: user?.name as string,
          edit: false,
          error: err.response.data.error,
        });
      });
  };

  return (
    <FormLayout title="Информация о профиле" maxWidth={700} error={state.error}>
      {state.edit ? (
        <Box maxWidth="700px">
          <TextField
            fullWidth
            variant="outlined"
            autoComplete="off"
            label="Имя"
            name="name"
            value={state.value}
            onChange={onChange}
          />
          <div className={classes.buttonsContainer}>
            <CustomButton
              className={classes.save}
              buttonClassName={classes.buttons}
              variant="contained"
              color="primary"
              disabled={
                user?.name === state.value.trim() ||
                state.isSubmitting ||
                state.value.length === 0
              }
              isSubmitting={state.isSubmitting}
              onClick={onSubmit}
            >
              Сохранить
            </CustomButton>
            <CustomButton
              buttonClassName={classes.buttons}
              variant="outlined"
              color="primary"
              onClick={() => setState({ ...state, edit: false })}
            >
              Отменить
            </CustomButton>
          </div>
        </Box>
      ) : (
        <>
          <Typography className={classes.label} variant="h6">
            Имя
          </Typography>
          <div className={classes.info}>
            <Typography noWrap>{user?.name}</Typography>
            <CustomButton
              color="primary"
              onClick={() => setState({ ...state, edit: true })}
            >
              Редактировать
            </CustomButton>
          </div>
        </>
      )}
      <Typography className={classes.label} variant="h6">
        Email
      </Typography>
      <div className={classes.info}>
        <Typography noWrap>{user?.email}</Typography>
        <CustomButton disabled color="primary">
          Редактировать
        </CustomButton>
      </div>
      <Typography className={classes.label} variant="h6">
        Пароль
      </Typography>
      <div className={classes.info}>
        <Typography>Пароль профиля</Typography>
        <CustomButton component={Link} to="/password" color="primary">
          Редактировать
        </CustomButton>
      </div>
    </FormLayout>
  );
};

export default AccountInformation;
