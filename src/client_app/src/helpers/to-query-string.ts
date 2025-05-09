export const toQueryString = (
  params: Record<
    string,
    | string
    | number
    | boolean
    | Array<string | number | boolean>
    | null
    | undefined
  >
): string => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null) // Exclude undefined or null values
    .flatMap(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle array values by repeating the key for each array element
        return value.map(
          (item) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`
        );
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`; // Convert value to string
    })
    .join("&");
};
