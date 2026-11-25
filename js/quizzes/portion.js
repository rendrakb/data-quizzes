import { rand, templated } from "../core/util.js";
const K = ["A", "B", "C", "D"];
const split = (rem, d) => {
  const C = Math.round((rem + (d.more ? d.diff : -d.diff)) / 2);
  return [C, rem - C];
};
const vals = (d) => ({ A: d.A, B: d.B, C: d.C, D: d.D });
const afterA = (d) => {
  const A = d.A - 100,
    B = Math.round((d.Bp / 100) * A),
    [C, D] = split(d.total - A - B, d);
  return { A, B, C, D };
};
const top = (d, f) => K.reduce((a, b) => (f(d[b], d[a]) ? b : a));
const T = [
  [
    { en: "What is the value of {i}?", id: "Berapa nilai {i}?" },
    (d, v) => d[v.i],
  ],
  [
    {
      en: "What percentage of the total does {i} contribute?",
      id: "Berapa persentase kontribusi {i} dari total?",
    },
    (d, v) => Math.round((d[v.i] / d.total) * 100) + "%",
  ],
  [
    {
      en: "Which item has the largest value?",
      id: "Barang mana yang nilainya paling besar?",
    },
    (d) => top(d, (a, b) => a > b),
  ],
  [
    {
      en: "Which item has the smallest value?",
      id: "Barang mana yang nilainya paling kecil?",
    },
    (d) => top(d, (a, b) => a < b),
  ],
  [
    {
      en: "What is the sum of {i} and {i2}?",
      id: "Berapa jumlah {i} dan {i2}?",
    },
    (d, v) => d[v.i] + d[v.i2],
  ],
  [
    {
      en: "What is the difference between {i} and {i2}?",
      id: "Berapa selisih antara {i} dan {i2}?",
    },
    (d, v) => Math.abs(d[v.i] - d[v.i2]),
  ],
  [
    {
      en: "Which is larger, {i} or {i2}?",
      id: "Mana yang lebih besar, {i} atau {i2}?",
    },
    (d, v) => (d[v.i] > d[v.i2] ? v.i : v.i2),
  ],
  [
    {
      en: "Which is smaller, {i} or {i2}?",
      id: "Mana yang lebih kecil, {i} atau {i2}?",
    },
    (d, v) => (d[v.i] < d[v.i2] ? v.i : v.i2),
  ],
  [
    {
      en: "If the proportion is maintained & the total is reduced by 100, what is the new value of {i}?",
      id: "Jika proporsinya tetap dan total dikurangi 100, berapa nilai baru {i}?",
    },
    (d, v) => Math.round((d.total - 100) * (d[v.i] / d.total)),
  ],
  [
    {
      en: "If the total is maintained & A is reduced by 100, what is the new value of {i}?",
      id: "Jika total tetap dan A dikurangi 100, berapa nilai baru {i}?",
    },
    (d, v) => afterA(d)[v.i],
  ],
];
export default {
  id: "portion",
  color: "#6b21a8",
  title: { en: "Portion", id: "Proporsi" },
  footnote: {
    en: "Note: The values describe the known portions of the overall total.",
    id: "Keterangan: Nilai-nilai tersebut menunjukkan bagian yang diketahui dari total keseluruhan.",
  },
  newData() {
    for (;;) {
      const A = rand.int(1, 4) * 100,
        Bp = rand.int(1, 15) * 10,
        B = Math.round((Bp / 100) * A);
      const min = Math.ceil((A + B + 300) / 100);
      if (min > 10) continue;
      const total = rand.int(min, 10) * 100,
        rem = total - A - B;
      if (rem < 300) continue;
      const diff = Math.max(
        Math.round((rand.int(1, 8) / 10) * rem),
        50 + rand.int(0, 9) * 10,
      );
      const d = { total, A, B, Bp, diff, more: Math.random() < 0.5 };
      [d.C, d.D] = split(rem, d);
      if (d.C > 50 && d.D > 50 && Math.abs(d.C - d.D) >= 50) return d;
    }
  },
  view: (d, lang) =>
    (lang === "id"
      ? [
          `Nilai total semua barang adalah <b>${d.total}</b>`,
          `A bernilai <b>${d.A}</b>`,
          `B bernilai <b>${d.Bp}% dari A</b>`,
          `C bernilai <b>${d.diff} ${d.more ? "lebih banyak" : "lebih sedikit"}</b> daripada D`,
          `Nilai D <b>belum diketahui</b>`,
        ]
      : [
          `The total value of all items is <b>${d.total}</b>`,
          `A is <b>${d.A}</b>`,
          `B is <b>${d.Bp}% of A</b>`,
          `C is <b>${d.diff} ${d.more ? "more" : "less"}</b> than D`,
          `D is <b>unknown</b>`,
        ]
    )
      .map((s) => `<div class="box">${s}</div>`)
      .join(""),
  ask: templated({ i: K }, T),
};
