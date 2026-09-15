export const zar = (value: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);

export const monthly = (price: number, months = 3, rate = 0.12) => {
  const r = rate / 12;
  if (r === 0) return price / months;
  return (price * r) / (1 - Math.pow(1 + r, -months));
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
