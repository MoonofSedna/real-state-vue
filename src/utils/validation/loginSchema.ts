export const loginSchema = {
  email(value: string) {
    if (!value) {
      return "Email is required";
    }
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!regex.test(value)) {
      return "Email not valid";
    }
    return true;
  },
  password(value: string) {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters long";
    if (value.length > 20)
      return "Password must be less than 20 characters long";
    return true;
  },
};
