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
      en: "What is the actual value of {P} for {L}?",
      id: "Berapa nilai sebenarnya {P} untuk {L}?",
    },
    (d, v) => pv(d, v.L, v.P.value),
  ],
  [
    {
      en: "Which letter has the highest actual value of {P}?",
      id: "Huruf mana yang memiliki nilai sebenarnya {P} tertinggi?",
    },
    (d, v) =>
      ext(d, (b, a) => pv(d, b, v.P.value) > pv(d, a, v.P.value)),
  ],
  [
    {
      en: "Which letter has the lowest actual value of {P}?",
      id: "Huruf mana yang memiliki nilai sebenarnya {P} terendah?",
    },
    (d, v) =>
      ext(d, (b, a) => pv(d, b, v.P.value) < pv(d, a, v.P.value)),
  ],
  [
    {
      en: "What is the average of {c} across all letters?",
      id: "Berapa rata-rata {c} dari semua huruf?",
    },
    (d, v) => Math.round(sum(d.map((r) => r[v.c.value])) / 4),
  ],
  [
    {
      en: "Which letter has the biggest total sum between Period 1 and Period 2?",
      id: "Huruf mana yang memiliki jumlah total terbesar antara Periode 1 dan Periode 2?",
    },
    (d) => ext(d, (b, a) => tt(d, b) > tt(d, a)),
  ],
  [
    {
      en: "Which letter has the lowest total sum between Period 1 and Period 2?",
      id: "Huruf mana yang memiliki jumlah total terkecil antara Periode 1 dan Periode 2?",
    },
    (d) => ext(d, (b, a) => tt(d, b) < tt(d, a)),
  ],
  [
    {
      en: "What is the average of Period 1 and Period 2 for {L}?",
      id: "Berapa rata-rata nilai {L} pada Periode 1 dan Periode 2?",
    },
    (d, v) => Math.round(tt(d, v.L) / 2),
  ],
  [
    {
      en: "What is the percentage contribution of {L} towards the sum of {c}?",
      id: "Berapa persentase kontribusi {L} terhadap jumlah {c}?",
    },
    (d, v) => {
      const c = v.c.value;
      return (
        Math.round((row(d, v.L)[c] / sum(d.map((r) => r[c]))) * 100) + "%"
      );
    },
  ],
];
export default {
  id: "table",
  color: "#155e75",
  title: { en: "Table", id: "Tabel" },
  footnote: {
    en: "Note: X1 and Y1 split Period 1 by percentage; X2 and Y2 split Period 2. X and Y add up to 100% for each period.",
    id: "Keterangan: X1 dan Y1 membagi Persentase pada Periode 1; X2 dan Y2 membagi Periode 2. Jumlah X dan Y untuk setiap periode adalah 100%.",
  },
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
    `${tbl(
      d.map((r) => [r.name, r[1], r.x1, r.y1, r[2], r.x2, r.y2]),
      lang === "id"
        ? [
            "Nama",
            "Periode 1",
            "X1 (%)",
            "Y1 (%)",
            "Periode 2",
            "X2 (%)",
            "Y2 (%)",
          ]
        : [
            "Name",
            "Period 1",
            "X1 (%)",
            "Y1 (%)",
            "Period 2",
            "X2 (%)",
            "Y2 (%)",
          ],
    )}`,
  ask: (d) =>
    templated(
      {
        L: N,
        P: [
          { en: "X1 (Period 1)", id: "X1 (Periode 1)", value: "x1" },
          { en: "Y1 (Period 1)", id: "Y1 (Periode 1)", value: "y1" },
          { en: "X2 (Period 2)", id: "X2 (Periode 2)", value: "x2" },
          { en: "Y2 (Period 2)", id: "Y2 (Periode 2)", value: "y2" },
        ],
        c: [
          { en: "Period 1", id: "Periode 1", value: "1" },
          { en: "Period 2", id: "Periode 2", value: "2" },
        ],
      },
      T,
    )(d),
};
