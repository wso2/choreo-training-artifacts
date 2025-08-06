import { BankAccount } from "../api";

export function getAccountMap(items: BankAccount[]) {
  const map = new Map<number, BankAccount>();
  items.forEach((item) => {
    map.set(item.id, item);
  });
  return map;
}
