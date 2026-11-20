import { rand, tbl } from "../core/util.js";
const LO = -999,
  HI = 999,
  LETTERS = ["a", "b", "c", "d", "e"];
const SY = {
  addition: "+",
  subtraction: "−",
  multiplication: "×",
  division: "÷",
};
const REL = {
  equal: ["is equal to", "=", "equal", (a, b) => a === b, "sama dengan"],
  bigger: [
    "is bigger than",
    ">",
    "smaller",
    (a, b) => a > b,
    "lebih besar dari",
  ],
  smaller: [
    "is smaller than",
    "<",
    "bigger",
    (a, b) => a < b,
    "lebih kecil dari",
  ],
};
const fmt = (n) => (n < 0 ? `(−${-n})` : String(n));
const mk = (op, a, b, v) => ({
  v,
  text: `${fmt(a)} ${SY[op]} ${fmt(b)}`,
  key:
    op +
    "|" +
    (op === "addition" || op === "multiplication" ? [a, b].sort() : [a, b]),
});

// Expression "a op b" whose operands and result are integers in range and equals target.
function expr(target) {
  for (const op of rand.shuffle(Object.keys(SY))) {
    if (op === "addition") {
      const lo = Math.max(LO, target - HI),
        hi = Math.min(HI, target - LO);
      for (let i = 0; i < 50; i++) {
        const a = rand.int(lo, hi),
          b = target - a;
        if (a && b) return mk(op, a, b, target);
      }
    }
    if (op === "subtraction") {
      const lo = Math.max(LO, LO - target),
        hi = Math.min(HI, HI - target);
      for (let i = 0; i < 50; i++) {
        const b = rand.int(lo, hi),
          a = target + b;
        if (a && b) return mk(op, a, b, target);
      }
    }
    if (op === "multiplication") {
      const abs = Math.abs(target),
        f = [];
      for (let d = 2; d <= abs / 2; d++) if (abs % d === 0) f.push(d);
      if (f.length) {
        let a = rand.pick(f),
          b = abs / a;
        if (target < 0) rand.sign() > 0 ? (a = -a) : (b = -b);
        return mk(op, a, b, target);
      }
    }
    if (op === "division") {
      const m = Math.min(12, Math.floor(HI / Math.abs(target)));
      if (m >= 2) {
        const b = rand.int(2, m) * rand.sign();
        return mk(op, target * b, b, target);
      }
    }
  }
}
function statement(seed, want) {
  const gap = Math.ceil(Math.abs(seed) / 10) - 1,
    c = [];
  if (gap < 1) return null;
  for (const r in REL)
    for (let o = -gap; o <= gap; o++) {
      const x = seed + o;
      if (x && x >= LO && x <= HI && REL[r][3](seed, x) === want)
        c.push([r, x]);
    }
  if (!c.length) return null;
  const [r, other] = rand.pick(c);
  for (let i = 0; i < 30; i++) {
    const s = expr(seed),
      o = expr(other);
    if (!s || !o) return null;
    if (s.key === o.key) continue;
    const sw = Math.random() < 0.5,
      l = sw ? o : s,
      rt = sw ? s : o,
      rel = sw ? REL[r][2] : r;
    return {
      l,
      r: rt,
      rel,
      text: {
        en: `${l.text} ${REL[rel][0]} ${rt.text}`,
        id: `${l.text} ${REL[rel][4]} ${rt.text}`,
      },
      ok: REL[rel][3](l.v, rt.v),
    };
  }
  return null;
}
export default {
  id: "equation",
  color: "#3730a3",
  fresh: true,
  title: { en: "Equation", id: "Persamaan" },
  newData() {
    for (let n = 0; n < 200; n++) {
      const seeds = new Set();
      while (seeds.size < 5) seeds.add(rand.int(20, HI) * rand.sign());
      const ci = rand.int(0, 4),
        st = [...seeds].map((s, i) => statement(s, i === ci));
      if (st.some((s) => !s) || new Set(st.map((s) => s.text)).size < 5)
        continue;
      return {
        st,
        text: {
          en: "Which statement is right?",
          id: "Pernyataan mana yang benar?",
        },
        answer: LETTERS[ci],
        logic: {
          en: st
            .map(
              (s, i) =>
                `${LETTERS[i]}. ${s.l.v} ${REL[s.rel][1]} ${s.r.v} → ${s.ok ? "TRUE" : "false"}`,
            )
            .join("<br>"),
          id: st
            .map(
              (s, i) =>
                `${LETTERS[i]}. ${s.l.v} ${REL[s.rel][1]} ${s.r.v} → ${s.ok ? "BENAR" : "salah"}`,
            )
            .join("<br>"),
        },
      };
    }
  },
  view: (d, lang) =>
    tbl(
      d.st.map((s, i) => [
        LETTERS[i] + ".",
        typeof s.text === "string" ? s.text : (s.text[lang] ?? s.text.en),
      ]),
    ),
  ask: (d) => d,
};
