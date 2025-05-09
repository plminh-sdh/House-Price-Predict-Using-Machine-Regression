export function formatNumber(value: number | string) {
  if (value === null || value === undefined) return value;
  if (isNaN(Number(value.toString())) || value.toString().trim() === "") {
    return value;
  } else {
    const separated = value.toString().split(".");

    return (
      separated[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      (separated[1]
        ? "." + separated[1] + (separated[1].length === 1 ? "0" : "")
        : "")
    );
  }
}
