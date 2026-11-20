import { lang } from "./i18n.js";

export const rand = {
  int: (a, b) => Math.floor(Math.random() * (b - a + 1)) + a,
  nz: (a, b) => {
    let v;
    do v = rand.int(a, b);
    while (!v);
    return v;
  },
  sign: () => (Math.random() < 0.5 ? 1 : -1),
  pick: (a) => a[Math.floor(Math.random() * a.length)],
  shuffle(a) {
    a = [...a];
    for (let i = a.length - 1; i > 0; i--) {
      const j = rand.int(0, i);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  sample: (a, n) => rand.shuffle(a).slice(0, n),
};
export const sum = (a) => a.reduce((x, y) => x + y, 0);
export const tbl = (rows, head) =>
  `<table>${head ? `<thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead>` : ""}<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;

// Numeric answers (also "42%") compare as numbers; everything else compares as text.
export const check = (user, answer) => {
  const n = (s) => parseFloat(String(s).replace(/[,%\s]/g, ""));
  if (typeof answer === "number" || /%$/.test(answer)) {
    const x = n(user),
      y = n(answer);
    return !isNaN(x) && Math.abs(x - y) < 0.01;
  }
  return (
    String(user)
      .trim()
      .toLowerCase()
      .replace(/[.)\s]+$/, "") === String(answer).toLowerCase()
  );
};

// Template helper: T = [[ { en: "text", id: "text" }, (data, vars) => answer ], ...]
// {X2}, {X3}... draw a different value from the same pool as {X}.
export const templated = (pools, T) => (d) => {
  const [text, fn] = rand.pick(T),
    v = {};
  for (const [, k] of text.en.matchAll(/\{(\w+)\}/g)) {
    if (k in v) continue;
    const base = k.replace(/\d$/, "");
    const used = Object.keys(v)
      .filter((x) => x.replace(/\d$/, "") === base)
      .map((x) => v[x]);
    v[k] = rand.pick(pools[base].filter((x) => !used.includes(x)));
  }
  const replace = (s) => s.replace(/\{(\w+)\}/g, (_, k) => v[k]);
  return {
    text: { en: replace(text.en), id: replace(text.id) },
    answer: fn(d, v),
  };
};
