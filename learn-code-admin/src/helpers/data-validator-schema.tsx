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

/**
 * Course creation validators
 */
export const subTopicSchema = object({
  title: string().required("Title is required"),
  contentURI: string().required("URI is required"),
  isVideo: boolean().default(false),
});

export const courseContentSchema = object({
  mainTopic: string().min(1, "Main topic is required"),
  description: string().min(1, "Description is required"),
  subTopics: array(subTopicSchema).min(1, "At least one sub-topic required"),
});

export const courseFormSchema = object({
  name: string().min(3, "Name must be at least 3 characters"),
  description: string().min(10, "Description is required"),
  image: string().url("Must be a valid image URL").optional(),
  price: number().min(0, "Price must be positive"),
  totalTopics: number().min(1, "Must have at least 1 topic"),
  requiredDuration: number().min(1, "Duration required (weeks)"),
  contents: array(courseContentSchema).optional(),
  skills: string(),
});

export const passwordResetSchema = object({
  email: string()
    .email("Enter a valid email address")
    .required("Email is required"),
});

export const updatePasswordResetSchema = object({
  passwordResetCode: string()
    .required("Verification code is required")
    .min(6, "Verification code must be 6 characters")
    .max(6, "Verification code must be 6 characters")
    .matches(/^\d+$/, "Verification code must be a number"),
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

export const userProfileSchema = object({
  firstName: string().required("First name is required"),
  lastName: string().required("Last name is required"),
  bio: string().required("Last name is required"),
  email: string()
    .email("Enter a valid email address")
    .required("Email is required"),
});
