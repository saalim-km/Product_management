import * as Yup from "yup";

export const signupSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required")
    .min(5, "Full name must be at least 5 characters")
    .max(50, "Full name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "Full name can only contain letters and spaces"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});
