import { rand, sum, tbl, templated } from "../core/util.js";
const N = ["A", "B", "C", "D"];
const row = (d, l) => d.find((r) => r.name === l);
const pv = (d, l, p) =>
  Math.round((row(d, l)[p] / 100) * row(d, l)[p.slice(-1)]);
const tt = (d, l) => row(d, l)[1] + row(d, l)[2];
const ext = (d, f) => N.reduce((a, b) => (f(b, a) ? b : a));
const T = [
  [
    {
      en: "What is the actual value of {P} of {L}?",
      id: "Berapa nilai sebenarnya {P} dari {L}?",
    },
    (d, v) => pv(d, v.L, v.P),
  ],
  [
    {
      en: "Which letter has the highest actual value of {P}?",
      id: "Huruf mana yang memiliki nilai sebenarnya {P} tertinggi?",
    },
    (d, v) => ext(d, (b, a) => pv(d, b, v.P) > pv(d, a, v.P)),
  ],
  [
    {
      en: "Which letter has the lowest actual value of {P}?",
      id: "Huruf mana yang memiliki nilai sebenarnya {P} terendah?",
    },
    (d, v) => ext(d, (b, a) => pv(d, b, v.P) < pv(d, a, v.P)),
  ],
  [
    {
      en: "What is the average of {c} across all letters?",
      id: "Berapa rata-rata {c} dari semua huruf?",
    },
    (d, v) => Math.round(sum(d.map((r) => r[v.c])) / 4),
  ],
  [
    {
      en: "Which letter has the biggest total sum between 1 and 2?",
      id: "Huruf mana yang memiliki jumlah total terbesar pada periode 1 dan 2?",
    },
    (d) => ext(d, (b, a) => tt(d, b) > tt(d, a)),
  ],
  [
    {
      en: "Which letter has the lowest total sum between 1 and 2?",
      id: "Huruf mana yang memiliki jumlah total terkecil pada periode 1 dan 2?",
    },
    (d) => ext(d, (b, a) => tt(d, b) < tt(d, a)),
  ],
  [
    {
      en: "What is the average of 1 and 2 for {L}?",
      id: "Berapa rata-rata nilai {L} pada periode 1 dan 2?",
    },
    (d, v) => Math.round(tt(d, v.L) / 2),
  ],
  [
    {
      en: "What is the percentage contribution of {L} towards the sum of {c}?",
      id: "Berapa persentase kontribusi {L} terhadap jumlah {c}?",
    },
    (d, v) =>
      Math.round((row(d, v.L)[v.c] / sum(d.map((r) => r[v.c]))) * 100) + "%",
  ],
];
export default {
  id: "table",
  color: "#155e75",
  title: { en: "Table", id: "Tabel" },
  newData: () =>
    N.map((name) => {
      const x1 = rand.int(0, 100),
        x2 = rand.int(0, 100);
      return {
        name,
        1: rand.int(0, 999),
        x1,
        y1: 100 - x1,
        2: rand.int(0, 999),
        x2,
        y2: 100 - x2,
      };
    }),
  view: (d, lang) =>
    tbl(
      d.map((r) => [r.name, r[1], r.x1, r.y1, r[2], r.x2, r.y2]),
      lang === "id"
        ? ["Nama", "1", "X1 (%)", "Y1 (%)", "2", "X2 (%)", "Y2 (%)"]
        : ["Name", "1", "X1 (%)", "Y1 (%)", "2", "X2 (%)", "Y2 (%)"],
    ),
  ask: (d) =>
    templated({ L: N, P: ["x1", "y1", "x2", "y2"], c: ["1", "2"] }, T)(d),
};
