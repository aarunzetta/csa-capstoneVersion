export type ColorMap = Record<string, string>;

export const getStatusColor = (
  value: string,
  map: ColorMap,
  fallback = "text-white",
): string => {
  return map[value] || fallback;
};
