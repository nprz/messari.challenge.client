export function getDate(date: string | undefined) {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString();
}

export function getNumber(num: number | undefined) {
  if (!num) return "-";

  return `$${num
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
