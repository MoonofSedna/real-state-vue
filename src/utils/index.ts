export const normalizePrice = (price: string) => {
  return Number(price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const minDate = new Date().toISOString().split("T")[0];

export const rooms = [1, 2, 3, 4, 5, 6];
