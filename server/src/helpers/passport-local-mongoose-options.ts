const passwordValidator = (
  password: string,
  cb: (error?: string) => string
): string => {
  if (!someValidationErrorExists(password)) {
    return cb(
      "Ващ пароль должен иметь минимум 8 символов, одну заглавную, одну строчную, однцу цифру и один спец символ"
    );
  }
  // return an empty cb() on success
  return cb();
};

const someValidationErrorExists = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*\d)(?=.*[ !"#$%&'()*+,-./:\\;<=>?@[\]^_`{|}~])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password);
};

export const options = {
  usernameField: "email",
  errorMessages: {},
  limitAttempts: true,
  maxAttempts: 5,
  passwordValidator: passwordValidator,
};

options.errorMessages = {
  MissingUsernameError: "Email отсутсвует",
  IncorrectPasswordError: "Паролль или email не верны",
  IncorrectUsernameError: "Паролль или email не верны",
  UserExistsError: "Пользователь с таким email уже существует",
};
