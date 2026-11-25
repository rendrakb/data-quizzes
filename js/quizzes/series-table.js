import { rand, tbl } from "../core/util.js";
export default {
  id: "series-table",
  color: "#861c62",
  fresh: true,
  title: { en: "Series Table", id: "Tabel Deret" },
  footnote: {
    en: "Note: Each row connects a unit number with its value.",
    id: "Keterangan: Setiap baris menghubungkan nomor unit dengan nilainya.",
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
              en: `What is the unit number of value ${f(qu)}?`,
              id: `Berapakah nomor unit untuk nilai ${f(qu)}?`,
            }
          : {
              en: `What is the value of unit ${qu}?`,
              id: `Berapa nilai unit ${qu}?`,
            },
        logic: {
          en: `Value = ${off || ""}${off ? (sign > 0 ? " + " : " − ") : sign > 0 ? "" : "−"}${step} × unit`,
          id: `Nilai = ${off || ""}${off ? (sign > 0 ? " + " : " − ") : sign > 0 ? "" : "−"}${step} × unit`,
        },
      };
    }
  },
  view: (d, lang) =>
    tbl(d.rows, lang === "id" ? ["Unit", "Nilai"] : ["Unit", "Value"]),
  ask: (d) => d,
};
