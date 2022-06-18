import React, { useState } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { Box } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { CustomButton, FormLayout } from "../../common";
import { shallowEqual } from "recompose";
import { createBrand } from "../../../api/brand";

interface Values {
  name: string;
}

interface State {
  error?: string;
  success?: string;
  lastSubmission: Values;
}

const initialValues = {
  name: "",
};

const validate = (values: Values) => {
  const errors: Partial<Values> = {};

  if (!values.name) {
    errors.name = "Обязательное поле";
  }

  return errors;
};

const BrandForm: React.FC = () => {
  const [state, setState] = useState<State>({
    error: undefined,
    success: undefined,
    lastSubmission: { ...initialValues },
  });

  const onSubmit = (
    values: Values,
    { setSubmitting, resetForm }: FormikHelpers<Values>
  ) => {
    createBrand(values)
      .then(() => {
        setState({
          success: "Производитель успешно добавлен",
          error: undefined,
          lastSubmission: { ...values },
        });
        resetForm();
        setSubmitting(false);
      })
      .catch((err) => {
        setState({
          error: err.response.data.error,
          success: undefined,
          lastSubmission: { ...values },
        });
        setSubmitting(false);
      });
  };

  return (
    <FormLayout
      title="Добавить производителя"
      maxWidth={700}
      error={state.error}
      success={state.success}
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {({ submitForm, isSubmitting, isValid, dirty, values }) => (
          <Form>
            <Box mb="24px" maxWidth="500px">
              <Field
                component={TextField}
                variant="outlined"
                name="name"
                label="Имя производителя"
                fullWidth
              />
            </Box>
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
              Добавить производителя
            </CustomButton>
          </Form>
        )}
      </Formik>
    </FormLayout>
  );
};

export default BrandForm;
