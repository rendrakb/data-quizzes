import { rand, tbl } from "../core/util.js";
export default {
  id: "series-table",
  color: "#861c62",
  fresh: true,
  title: { en: "Series Table", id: "Tabel Deret" },
  footnote: {
    en: "Note: Each row pairs a term with its value. Both the terms and values follow a pattern.",
    id: "Keterangan: Setiap baris memasangkan urutan dengan nilainya. Urutan dan nilai mengikuti pola.",
  },
  newData() {
    for (;;) {
      const sign = Math.random() < 0.5 ? 1 : -1,
        step = rand.int(1, 99),
        off = rand.int(-500, 500);
      const f = (u) => off + sign * step * u;
      const ok = [];
      for (let u = 1; u <= 100; u++) if (Math.abs(f(u)) <= 999) ok.push(u);
      if (ok.length < 6) continue;
      const pick = rand.sample(ok, 6),
        qu = pick.pop();
      const rows = pick.sort((a, b) => a - b).map((u) => [u, f(u)]);
      const byVal = Math.random() < 0.5;
      return {
        rows,
        answer: byVal ? qu : f(qu),
        text: byVal
          ? {
              en: `What is the term number of value ${f(qu)}?`,
              id: `Berapakah urutan dari nilai ${f(qu)}?`,
            }
          : {
              en: `What is the value of term ${qu}?`,
              id: `Berapa nilai urutan ${qu}?`,
            },
        logic: {
          en: `Value = ${off || ""}${off ? (sign > 0 ? " + " : " − ") : sign > 0 ? "" : "−"}${step} × term`,
          id: `Nilai = ${off || ""}${off ? (sign > 0 ? " + " : " − ") : sign > 0 ? "" : "−"}${step} × urutan`,
        },
      };
    }
  },
  view: (d, lang) =>
    tbl(d.rows, lang === "id" ? ["Urutan", "Nilai"] : ["Term", "Value"]),
  ask: (d) => d,
};
