import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Grid, TextField } from "@material-ui/core";
import { CustomButton, FormLayout } from "../../common";
import {
  Address as IAddress,
  getAddress,
  saveAddress,
} from "../../../api/address";
import { useCancelToken } from "../../../helpers";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { TextField as TextFieldFormik } from "formik-material-ui";
import { shallowEqual } from "recompose";
import useAddressStyles from "./address-styles";
import axios from "axios";

interface State {
  error?: string;
  success?: string;
  lastSubmission: IAddress;
}

const initialValues: IAddress = {
  firstName: "",
  lastName: "",
  addressLine: "",
  country: "",
  city: "",
  province: "",
  postalCode: "",
  phone: "",
};

const validate = (values: IAddress) => {
  const errors: Partial<IAddress> = {};
  const keys = Object.keys(initialValues);
  if (!/^\d+$/.test(values.phone)) {
    errors.phone = "Only numerals are allowed";
  }
  keys.forEach((key) => {
    if (!values[key as keyof IAddress]) {
      errors[key as keyof IAddress] = "Обязательное поле";
    }
  });

  return errors;
};

const Address: React.FC = () => {
  const classes = useAddressStyles();
  const cancelSource = useCancelToken();
  const [state, setState] = useState<State>({
    error: undefined,
    success: undefined,
    lastSubmission: initialValues,
  });
  const [formValues, setFormValues] = useState<IAddress>(initialValues);
  const [loaded, setLoaded] = useState(false);

  useEffect(
    () => {
      getAddress(cancelSource.current?.token)
        .then((response) => {
          if (response.data) {
            setFormValues(response.data);
          }
          setLoaded(true);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            console.log(err.response.data.error);
          }
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onSubmit = (
    values: IAddress,
    { setSubmitting }: FormikHelpers<IAddress>
  ) => {
    saveAddress(values, cancelSource.current?.token)
      .then(() => {
        setState({
          success: "Ваш адрес сохранен",
          error: undefined,
          lastSubmission: values,
        });
        setSubmitting(false);
      })
      .catch((err) => {
        setState({
          error: err.response.data.error,
          success: undefined,
          lastSubmission: values,
        });
        setSubmitting(false);
      });
  };

  return (
    <FormLayout
      title="Адрес"
      maxWidth={700}
      error={state.error}
      success={state.success}
    >
      {loaded ? (
        <Formik
          initialValues={formValues}
          validate={validate}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ submitForm, isSubmitting, isValid, dirty, values }) => (
            <Form>
              <Box mb="24px">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextFieldFormik}
                      variant="outlined"
                      name="firstName"
                      label="Имя"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextFieldFormik}
                      variant="outlined"
                      name="lastName"
                      label="Фамилия"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box mb="24px">
                <Field
                  component={TextFieldFormik}
                  variant="outlined"
                  name="addressLine"
                  label="Адрес"
                  fullWidth
                />
              </Box>
              <Box mb="12px">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextFieldFormik}
                      variant="outlined"
                      name="country"
                      label="Страна"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextFieldFormik}
                      variant="outlined"
                      name="city"
                      label="Город"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box mb="24px">
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={6}>
                    <Field
                      component={TextFieldFormik}
                      variant="outlined"
                      name="province"
                      label="Улица"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <Field
                      component={TextFieldFormik}
                      variant="outlined"
                      name="postalCode"
                      label="Почтовый индекс"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>
              <div className={classes.phoneContainer}>
                <Field name="phone">
                  {(props: FieldProps) => (
                    <TextField
                      {...props.field}
                      variant="outlined"
                      label="Телефон"
                      error={props.meta.touched && Boolean(props.meta.error)}
                      helperText={props.meta.touched && <>{props.meta.error}</>}
                      fullWidth
                    />
                  )}
                </Field>
              </div>
              <CustomButton
                variant="contained"
                color="primary"
                disabled={
                  isSubmitting ||
                  !(dirty && isValid) ||
                  shallowEqual(state.lastSubmission, values)
                }
                isSubmitting={isSubmitting}
                onClick={submitForm}
              >
                Сохранить адрес
              </CustomButton>
            </Form>
          )}
        </Formik>
      ) : (
        <Box display="flex" justifyContent="center">
          <CircularProgress disableShrink />
        </Box>
      )}
    </FormLayout>
  );
};

export default Address;
