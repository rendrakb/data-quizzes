import { rand, tbl } from "../core/util.js";
const S = {
  addition: "+",
  subtraction: "−",
  multiplication: "×",
  division: "÷",
};
const OPS = Object.keys(S);
const apply = (op, a, b) =>
  ({
    addition: a + b,
    subtraction: a - b,
    multiplication: a * b,
    division: a / b,
  })[op];

function triple(op, ma, mb, k) {
  for (let i = 0; i < 100; i++) {
    let a, b;
    if (op === "division") {
      const dv = rand.int(2, 10) * rand.sign();
      a = (rand.nz(-30, 30) * dv) / ma;
      b = dv / mb;
    } else if (op === "multiplication") {
      a = rand.nz(-12, 12);
      b = rand.nz(-12, 12);
    } else {
      a = rand.int(-99, 99);
      b = rand.int(-99, 99);
    }
    if (!Number.isInteger(a) || !Number.isInteger(b)) continue;
    const c = apply(op, a * ma, b * mb) + k;
    if (Number.isInteger(c)) return [a, b, c];
  }
}
function formula(mod) {
  const op = rand.pick(OPS),
    byCol = Math.random() < 0.5;
  let ma = 1,
    mb = 1,
    k = 0;
  if (mod === "double") Math.random() < 0.5 ? (ma = 2) : (mb = 2);
  if (mod === "constant") k = rand.int(1, 99) * rand.sign();
  const tr = [0, 1, 2].map(() => triple(op, ma, mb, k));
  if (tr.some((x) => !x)) return null;
  const m = tr.map((r, i) => r.map((_, j) => (byCol ? tr[i][j] : tr[j][i])));
  const n = byCol
    ? ["Column A", "Column B", "Column C"]
    : ["Row 1", "Row 2", "Row 3"];
  const ni = byCol
    ? ["Kolom A", "Kolom B", "Kolom C"]
    : ["Baris 1", "Baris 2", "Baris 3"];
  const w = (s, x) => (x === 2 ? `(${s} × 2)` : s);
  return {
    m,
    logic: {
      en: `${n[2]} = ${w(n[0], ma)} ${S[op]} ${w(n[1], mb)}${k ? ` ${k > 0 ? "+" : "−"} ${Math.abs(k)}` : ""}`,
      id: `${ni[2]} = ${w(ni[0], ma)} ${S[op]} ${w(ni[1], mb)}${k ? ` ${k > 0 ? "+" : "−"} ${Math.abs(k)}` : ""}`,
    },
  };
}
function series() {
  const a = rand.int(1, 99);
  let b = rand.int(1, 99);
  const alt = Math.random() < 0.5;
  if (alt && a === b) b = a === 99 ? 98 : a + 1;
  const s = [rand.int(-999, 999)];
  for (let i = 1; i < 9; i++) s.push(s[i - 1] + (!alt || i % 2 ? a : b));
  const sh = rand.shuffle(s);
  return {
    m: [0, 1, 2].map((r) => sh.slice(r * 3, r * 3 + 3)),
    logic: {
      en: `Sorted ascending: ${s.join(", ")} (${alt ? `alternating +${a} and +${b}` : `+${a} each step`})`,
      id: `Urutan menaik: ${s.join(", ")} (${alt ? `bergantian +${a} dan +${b}` : `+${a} setiap langkah`})`,
    },
  };
}
const valid = (r) =>
  r &&
  r.m.flat().every((n) => Number.isInteger(n) && Math.abs(n) <= 999) &&
  new Set(r.m.flat()).size > 1;

export default {
  id: "matrix",
  color: "#9a3412",
  fresh: true,
  title: { en: "Matrix", id: "Matriks" },
  newData() {
    for (;;) {
      const r = rand.pick([
        () => formula("none"),
        () => formula("double"),
        () => formula("constant"),
        series,
      ])();
      if (!valid(r)) continue;
      const h = [rand.int(0, 2), rand.int(0, 2)];
      return {
        ...r,
        h,
        text: { en: "What is the value of x?", id: "Berapa nilai x?" },
        answer: r.m[h[0]][h[1]],
      };
    }
  },
  view: (d) =>
    tbl(
      d.m.map((row, r) =>
        row.map((n, c) => (r === d.h[0] && c === d.h[1] ? "[ x ]" : `${n}`)),
      ),
    ),
  ask: (d) => d,
};
