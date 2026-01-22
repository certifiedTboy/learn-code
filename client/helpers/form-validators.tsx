import * as Yup from "yup";

export const validateRegform = () => {
  const Schema = Yup.object().shape({
    firstName: Yup.string().required("Full name is required"),
    lastName: Yup.string().required("Last name is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[@$#!%*?&]/,
        "Password must contain at least one special character",
      ),
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

export const validateUpdatePasswordForm = () => {
  const Schema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/\d/, "Password must contain at least one number")
      .matches(
        /[@$#!%*?&]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  });

  return Schema;
};

export const validatePasswordResetRequestForm = () => {
  const Schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email")
      .required("You need to provide an email"),
  });

  return Schema;
};
