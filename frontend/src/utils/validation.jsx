// utils/validation.jsx
export const getSignupFormErrors = ({ name, email, password, confirmPassword }) => {
  const errors = {};

  if (!name.trim()) errors.name = "Name is required";
  if (name.trim() && name.trim().length < 2) errors.name = "Name must be at least 2 characters";

  if (!email.trim()) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Please enter a valid email";

  if (!password.trim()) errors.password = "Password is required";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters";

  if (!confirmPassword.trim()) errors.confirmPassword = "Please confirm your password";
  else if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";

  return errors;
};

export const getLoginFormErrors = ({ email, password }) => {
  const errors = {};

  if (!email.trim()) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Please enter a valid email";

  if (!password.trim()) errors.password = "Password is required";
  else if (password.length < 6) errors.password = "Password must be at least 6 characters";

  return errors;
};