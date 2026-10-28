export function formatPrice(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatDate(value) {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat("en-PH", { dateStyle: "medium" }).format(date)
    : "—";
}

export function errorMessage(error) {
  return error?.message?.replace(/^Firebase:\s*/i, "") || "Something went wrong. Please try again.";
}
