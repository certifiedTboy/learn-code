import * as Yup from "yup";

export const validateRegform = () => {
  const Schema = Yup.object().shape({
    firstName: Yup.string().required("Full name is required"),
    lastName: Yup.string().required("Last name is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
    email: Yup.string()
      .email("Invalid email")
      .required("You need to provide an email"),
  });

  return Schema;
};

export const validateVerificationform = () => {
  const Schema = Yup.object().shape({
    verificationCode: Yup.string()
      .required("Verification code is required")
      .matches(/^\d{6}$/, "Verification code must be 6 digits"),
  });

  return Schema;
};
