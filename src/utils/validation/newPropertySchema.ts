export const validationSchema = {
  title(value: string) {
    if (!value) return "Property title is required";
    if (value?.length <= 6)
      return "Property name must be at least 6 characters long";

    return true;
  },
  city(value: string) {
    if (!value) return "City is required";
    return true;
  },
  price(value: string) {
    if (!value) return "Price is required";
    if (+value === 0) return "Price must be greater than 0";
    if (/^[0-9]+$/.test(value)) return true;
    return "Price must be a number";
  },
  bedroom(value: string) {
    if (value) return true;
    return "Select a number of bedrooms";
  },
  bathroom(value: string) {
    if (value) return true;
    return "Select a number of bathrooms";
  },
  parking(value: string) {
    if (value) return true;
    return "Select a number of parking spaces";
  },
  description(value: string) {
    if (value) return true;
    return "Description is required";
  },
};

export const imageSchema = {
  image(value: string) {
    if (value) return true;
    return "Image is required";
  },
};
