import React, { useState } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { Box } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import { CustomButton, FormLayout } from "../../common";
import { shallowEqual } from "recompose";
import { createPost } from "../../../api/post";

interface Values {
  title: string;
  content: string;
}

interface State {
  error?: string;
  success?: string;
  lastSubmission: Values;
}

const initialValues = {
  title: "",
  content: "",
};

const validate = (values: Values) => {
  const errors: Partial<Values> = {};

  if (!values.title) {
    errors.title = "Обязательное поле";
  }
  if (!values.content) {
    errors.content = "Обязательное поле";
  }

  return errors;
};

const PostForm: React.FC = () => {
  const [state, setState] = useState<State>({
    error: undefined,
    success: undefined,
    lastSubmission: { ...initialValues },
  });

  const onSubmit = (
    values: Values,
    { setSubmitting, resetForm }: FormikHelpers<Values>
  ) => {
    createPost(values)
      .then(() => {
        setState({
          success: "Новость успешно создана",
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
      title="Создать сообшение"
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
                name="title"
                label="Заголовок"
                fullWidth
              />
            </Box>
            <Box mb="24px" maxWidth="500px">
              <Field
                component={TextField}
                variant="outlined"
                name="content"
                label="Текст"
                multiline
                rows={9}
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
              Создать
            </CustomButton>
          </Form>
        )}
      </Formik>
    </FormLayout>
  );
};

export default PostForm;
