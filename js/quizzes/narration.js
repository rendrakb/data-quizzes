import { rand, templated } from "../core/util.js";
const pc = () => rand.int(1, 8) * 10;
const diffInt = (gen, not) => {
  let v;
  do v = gen();
  while (v === not);
  return v;
};
const A = (d, p) => d[p].A,
  B = (d, p) => d[p].B;
const bigger = (x, y, a = "A", b = "B") => (x > y ? a : b),
  smaller = (x, y) => (x < y ? "A" : "B");
const T = [
  [
    {
      en: "What is contribution of {L} in {p}?",
      id: "Berapa kontribusi {L} pada periode {p}?",
    },
    (d, v) => (d["p" + v.p][v.L] / d["p" + v.p].total) * 100 + "%",
  ],
  [
    {
      en: "What is the actual numerical change from 1 to 2 for {L}?",
      id: "Berapa perubahan nilai {L} dari periode 1 ke 2?",
    },
    (d, v) => d.ch[v.L].n,
  ],
  [
    {
      en: "What is the percentage change from 1 to 2 for {L}?",
      id: "Berapa persentase perubahan {L} dari periode 1 ke 2?",
    },
    (d, v) => Math.round(d.ch[v.L].p) + "%",
  ],
  [
    {
      en: "What is the numerical change in total data from 1 to 2?",
      id: "Berapa perubahan nilai total data dari periode 1 ke 2?",
    },
    (d) => d.ch.total.n,
  ],
  [
    {
      en: "What is the percent change in total data from 1 to 2?",
      id: "Berapa persentase perubahan total data dari periode 1 ke 2?",
    },
    (d) => Math.round(d.ch.total.p) + "%",
  ],
  [
    {
      en: "Which letter contributed more in {p}, A or B?",
      id: "Huruf mana yang kontribusinya lebih besar pada periode {p}, A atau B?",
    },
    (d, v) => bigger(d["p" + v.p].A, d["p" + v.p].B),
  ],
  [
    {
      en: "Which letter contributed less in {p}, A or B?",
      id: "Huruf mana yang kontribusinya lebih kecil pada periode {p}, A atau B?",
    },
    (d, v) => smaller(d["p" + v.p].A, d["p" + v.p].B),
  ],
  [
    {
      en: "Which letter contributed more in overall, A or B?",
      id: "Secara keseluruhan, huruf mana yang kontribusinya lebih besar, A atau B?",
    },
    (d) => bigger(d.p1.A + d.p2.A, d.p1.B + d.p2.B),
  ],
  [
    {
      en: "Which letter contributed less in overall, A or B?",
      id: "Secara keseluruhan, huruf mana yang kontribusinya lebih kecil, A atau B?",
    },
    (d) => smaller(d.p1.A + d.p2.A, d.p1.B + d.p2.B),
  ],
  [
    {
      en: "Which letter had the larger relative change from 1 to 2?",
      id: "Huruf mana yang mengalami perubahan relatif lebih besar dari periode 1 ke 2?",
    },
    (d) => bigger(Math.abs(d.ch.A.p), Math.abs(d.ch.B.p)),
  ],
  [
    {
      en: "Which letter had the smaller relative change from 1 to 2?",
      id: "Huruf mana yang mengalami perubahan relatif lebih kecil dari periode 1 ke 2?",
    },
    (d) => smaller(Math.abs(d.ch.A.p), Math.abs(d.ch.B.p)),
  ],
  [
    {
      en: "Which period is bigger, 1 or 2?",
      id: "Periode mana yang nilainya lebih besar, 1 atau 2?",
    },
    (d) => (d.p1.total > d.p2.total ? "1" : "2"),
  ],
  [
    {
      en: "Which period is smaller, 1 or 2?",
      id: "Periode mana yang nilainya lebih kecil, 1 atau 2?",
    },
    (d) => (d.p1.total < d.p2.total ? "1" : "2"),
  ],
];
export default {
  id: "narration",
  color: "#5b5d12",
  title: { en: "Narration", id: "Narasi" },
  newData() {
    const s1 = rand.int(1, 10),
      t1 = s1 * 100,
      a1p = pc(),
      a1 = (a1p / 100) * t1;
    const t2 = diffInt(() => rand.int(1, 10), s1) * 100,
      a2 = (diffInt(pc, a1p) / 100) * t2;
    const p1 = { total: t1, A: a1, B: t1 - a1 },
      p2 = { total: t2, A: a2, B: t2 - a2 };
    const ch = {};
    for (const k of ["total", "A", "B"])
      ch[k] = { n: p2[k] - p1[k], p: ((p2[k] - p1[k]) / p1[k]) * 100 };
    return {
      p1,
      p2,
      ch,
      pctTotal: Math.random() < 0.5,
      pctB: Math.random() < 0.5,
    };
  },
  view(d, lang) {
    const dir = (x) => (x >= 0 ? "increased" : "decreased");
    const change = (x) =>
      lang === "id" ? (x >= 0 ? "meningkat" : "menurun") : dir(x);
    const tc = d.pctTotal
      ? Math.abs(d.ch.total.p).toFixed(2) + "%"
      : Math.abs(d.ch.total.n);
    const bc = d.pctB
      ? Math.abs(d.ch.B.p).toFixed(2) + "%"
      : Math.abs(d.ch.B.n);
    const lines =
      lang === "id"
        ? [
            `Total data pada periode 1 adalah <b>${d.p1.total}</b>`,
            `Total data pada periode 2 <b>${change(d.ch.total.n)}</b> sebesar <b>${tc}</b> dari periode 1`,
            `Data A pada periode 1 adalah <b>${d.p1.A}</b>`,
            `Data B pada periode 2 <b>${change(d.ch.B.n)}</b> sebesar <b>${bc}</b> dari nilainya pada periode 1`,
          ]
        : [
            `Total data in period 1 was <b>${d.p1.total}</b>`,
            `Total data in period 2 was <b>${dir(d.ch.total.n)}</b> by <b>${tc}</b> from period 1`,
            `Data for A in period 1 is <b>${d.p1.A}</b>`,
            `Data for B in period 2 is <b>${dir(d.ch.B.n)}</b> by <b>${bc}</b> from its value in period 1`,
          ];
    return lines.map((s) => `<div class="box">${s}</div>`).join("");
  },
  ask: templated({ L: ["A", "B"], p: ["1", "2"] }, T),
};
