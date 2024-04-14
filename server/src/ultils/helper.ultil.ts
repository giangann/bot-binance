export function priceToPercent(p1: number, p2: number) {
  if (p1 < p2) return (p2 / p1 - 1) * 100;
  else return -(p1 / p2 - 1) * 100;
}
export function compareDate(date1: string, date2: string) {
  if (date1 >= date2) return -1;
  else return 1;
}
