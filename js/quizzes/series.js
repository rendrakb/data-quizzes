import { rand, tbl } from "../core/util.js";
const S = {
  addition: "+",
  subtraction: "-",
  multiplication: "×",
  division: "÷",
};
const step = (op, v, x) =>
  ({
    addition: x + v,
    subtraction: x - v,
    multiplication: x * v,
    division: x / v,
  })[op];
const sg = (n) => (n >= 0 ? `+${n}` : `${n}`);
const ARITH = {
  addition: [1, 100, -100, 100],
  subtraction: [1, 100, -100, 100],
  multiplication: [2, 10, -10, 10],
  division: [2, 10, -10, 10],
}; // vmin,vmax,smin,smax
const VAL = {
  addition: [1, 100],
  subtraction: [1, 100],
  multiplication: [2, 10],
};

function arithmetic(op, n) {
  const [a, b, c, d] = ARITH[op],
    v = rand.int(a, b);
  const start =
    op === "division"
      ? rand.nz(c, d) * v ** (n - 1)
      : op === "multiplication"
        ? rand.nz(c, d)
        : rand.int(c, d);
  const t = [start];
  for (let i = 1; i < n; i++) t.push(step(op, v, t[i - 1]));
  const labels = {
    addition: "ditambah",
    subtraction: "dikurangi",
    multiplication: "dikali",
    division: "dibagi",
  };
  return {
    t,
    logic: { en: `Always ${S[op]}${v}`, id: `Selalu ${labels[op]} ${v}` },
  };
}
function alternating(n) {
  const [x, y] = rand.pick([
    ["addition", "subtraction"],
    ["addition", "multiplication"],
    ["subtraction", "multiplication"],
  ]);
  const vx = rand.int(...VAL[x]);
  let vy = rand.int(...VAL[y]);
  if (vx === vy) vy = rand.int(...VAL[y]);
  const t = [rand.nz(-50, 50)];
  for (let i = 1; i < n; i++)
    t.push(i % 2 ? step(x, vx, t[i - 1]) : step(y, vy, t[i - 1]));
  const labels = {
    addition: "tambah",
    subtraction: "kurang",
    multiplication: "kali",
    division: "bagi",
  };
  return {
    t,
    logic: {
      en: `Alternating ${S[x]}${vx} and ${S[y]}${vy}`,
      id: `Bergantian ${labels[x]} ${vx} dan ${labels[y]} ${vy}`,
    },
  };
}
function squares(n) {
  const max = 31,
    up = Math.random() < 0.5,
    f = up ? rand.int(1, max - n + 1) : rand.int(n, max);
  return {
    t: Array.from({ length: n }, (_, i) => (f + (up ? i : -i)) ** 2),
    logic: {
      en: `${up ? "Ascending" : "Descending"} squares from ${f}²`,
      id: `Bilangan kuadrat ${up ? "menaik" : "menurun"} dari ${f}²`,
    },
  };
}
function meta(alt, n) {
  const s = rand.sign(),
    d0 = rand.int(1, 10),
    ch = rand.int(1, 5),
    t = [rand.int(-100, 100)],
    ds = [];
  for (let i = 0; i < n - 1; i++) {
    const m = d0 + i * ch,
      d = alt ? (i % 2 ? -1 : 1) * s * m : s * m;
    ds.push(d);
    t.push(t[i] + d);
  }
  return {
    t,
    logic: {
      en: `Meta ${alt ? "alternating " : ""}series: steps ${alt ? `alternate in sign and grow by ${ch}` : `change by ${sg(s * ch)} each time`} (${ds.slice(0, 4).map(sg).join(", ")}, ...)`,
      id: `Deret meta${alt ? " bergantian" : ""}: langkah ${alt ? `berganti tanda dan bertambah ${ch}` : `berubah sebesar ${sg(s * ch)} setiap kali`} (${ds.slice(0, 4).map(sg).join(", ")}, ...)`,
    },
  };
}
const BUILD = [
  ...Object.keys(ARITH).map((op) => (n) => arithmetic(op, n)),
  alternating,
  squares,
  (n) => meta(false, n),
  (n) => meta(true, n),
];

export default {
  id: "series",
  color: "#166534",
  fresh: true,
  title: { en: "Series", id: "Deret" },
  newData() {
    for (;;) {
      const r = rand.pick(BUILD)(9);
      if (
        r.t.every((n) => Number.isInteger(n) && Math.abs(n) <= 999) &&
        new Set(r.t).size > 1
      )
        return {
          vis: r.t.slice(0, 8),
          text: {
            en: "What is the missing number?",
            id: "Berapa angka yang hilang?",
          },
          answer: r.t[8],
          logic: r.logic,
        };
    }
  },
  view: (d) => tbl([[...d.vis.map((n) => `${n}`), "[ ? ]"]]),
  ask: (d) => d,
};
