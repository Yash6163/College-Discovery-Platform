export const money = (value?: number | null) => value == null ? "Not reported" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0, notation: value >= 100000 ? "compact" : "standard" }).format(value);
export const packageMoney = (value?: number | null) => value == null ? "Not reported" : `₹${(value / 100000).toFixed(value % 100000 ? 1 : 0)} LPA`;
