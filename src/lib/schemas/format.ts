export function formatCurrency(price: string, currency: string) {
  const num = Number(price);
  if (Number.isNaN(num)) return price;
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: currency ?? "VND",
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${num.toLocaleString()} ${currency}`;
  }
}
