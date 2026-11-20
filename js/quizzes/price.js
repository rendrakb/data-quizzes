import { rand, sum, tbl, templated } from "../core/util.js";
const K = ["A", "B", "C", "D", "E", "F"];
const u = (d, k) => d.items[k].p / d.items[k].q,
  r2 = (x) => +x.toFixed(2);
const qty = (d) => sum(K.map((k) => d.items[k].q));
const top = (d, f) => K.reduce((a, b) => (f(u(d, b), u(d, a)) ? b : a));
const T = [
  [
    {
      en: "What item is the cheapest per unit?",
      id: "Barang mana yang paling murah per unit?",
    },
    (d) => top(d, (a, b) => a < b),
  ],
  [
    {
      en: "What item is the most expensive per unit?",
      id: "Barang mana yang paling mahal per unit?",
    },
    (d) => top(d, (a, b) => a > b),
  ],
  [
    {
      en: "What is the price per unit of {i}?",
      id: "Berapa harga per unit {i}?",
    },
    (d, v) => r2(u(d, v.i)),
  ],
  [
    {
      en: "Which is more expensive per unit? {i} or {i2}",
      id: "Mana yang lebih mahal per unit, {i} atau {i2}?",
    },
    (d, v) => (u(d, v.i) > u(d, v.i2) ? v.i : v.i2),
  ],
  [
    {
      en: "Which is cheaper per unit? {i} or {i2}?",
      id: "Mana yang lebih murah per unit, {i} atau {i2}?",
    },
    (d, v) => (u(d, v.i) < u(d, v.i2) ? v.i : v.i2),
  ],
  [
    {
      en: "What percentage is total price of {i} towards the total price overall?",
      id: "Berapa persentase total harga {i} dari keseluruhan harga?",
    },
    (d, v) => Math.round((d.items[v.i].p / d.total) * 100) + "%",
  ],
  [
    {
      en: "What is the price per unit difference between {i} and {i2}?",
      id: "Berapa selisih harga per unit antara {i} dan {i2}?",
    },
    (d, v) => r2(Math.abs(u(d, v.i) - u(d, v.i2))),
  ],
  [
    {
      en: "What is the total quantity of all items combined?",
      id: "Berapa jumlah kuantitas seluruh barang?",
    },
    (d) => qty(d),
  ],
  [
    {
      en: "What is the average of total price of all items?",
      id: "Berapa rata-rata total harga semua barang?",
    },
    (d) => r2(d.total / 6),
  ],
  [
    {
      en: "What percentage of the total quantity is {i}?",
      id: "Berapa persentase kuantitas {i} dari total kuantitas?",
    },
    (d, v) => Math.round((d.items[v.i].q / qty(d)) * 100) + "%",
  ],
  [
    {
      en: "If all items had the same price per unit as {i}, what would the overall total price be?",
      id: "Jika semua barang memiliki harga per unit yang sama dengan {i}, berapa total harganya?",
    },
    (d, v) => Math.round(u(d, v.i) * qty(d)),
  ],
  [
    {
      en: "If all items had the same quantity as {i}, what would the overall total price be?",
      id: "Jika semua barang memiliki kuantitas yang sama dengan {i}, berapa total harganya?",
    },
    (d, v) => Math.round(sum(K.map((k) => u(d, k))) * d.items[v.i].q),
  ],
];
export default {
  id: "price",
  color: "#1d4ed8",
  title: { en: "Price", id: "Harga" },
  newData() {
    const items = Object.fromEntries(
      K.map((k) => [
        k,
        { q: rand.int(1, 20) * 5, p: rand.int(0, 18) * 50 + 100 },
      ]),
    );
    return { items, total: sum(K.map((k) => items[k].p)) };
  },
  view: (d, lang) =>
    tbl(
      K.map((k) => [k, d.items[k].q, "$" + d.items[k].p]),
      lang === "id" ? ["Barang", "Jumlah", "Total"] : ["Item", "Qty", "Total"],
    ),
  ask: templated({ i: K }, T),
};
