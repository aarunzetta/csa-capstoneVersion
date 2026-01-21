export const capitalize = (value: string | null | undefined): string => {
  if (!value) return "";
  const s = String(value).trim();
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const capitalizeWords = (value: string | null | undefined): string => {
  if (!value) return "";
  return String(value)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => capitalize(w))
    .join(" ");
};
