import { object, string, ref, boolean, array, number } from "yup";

export const registerSchema = object({
  //   firstName: string().required("First name is required"),
  //   lastName: string().required("Last name is required"),
  email: string()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/\d/, "Password must contain a number")
    .matches(/[@$!%*#?&]/, "Password must contain a special character"),
  confirmPassword: string()
    .oneOf([ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const accountVerificationSchema = object({
  //   firstName: string().required("First name is required"),
  //   lastName: string().required("Last name is required"),
  verificationCode: string()
    .required("Verification code is required")
    .min(6, "Verification code must be 6 characters")
    .max(6, "Verification code must be 6 characters")
    .matches(/^\d+$/, "Verification code must be a number"),
});

export const loginSchema = object({
  email: string().required("Email is required"),
  password: string().required("Password is required"),
});
