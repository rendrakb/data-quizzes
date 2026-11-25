import { rand, sum, templated } from "../core/util.js";
const L = ["A", "B", "C", "D", "E"],
  N = ["1", "2", "3", "4"];
const g = (d, l, n) => d[l][n - 1],
  tot = (d, l) => sum(d[l]);
const best = (d, f) => L.reduce((a, b) => (f(tot(d, b), tot(d, a)) ? b : a));
const T = [
  [
    {
      en: "In {n}, what is the difference between {L} & {L2}?",
      id: "Pada {n}, berapa selisih antara {L} dan {L2}?",
    },
    (d, v) => g(d, v.L, v.n) - g(d, v.L2, v.n),
  ],
  [
    {
      en: "In {n}, what is the sum of {L} & {L2}?",
      id: "Pada {n}, berapa jumlah {L} dan {L2}?",
    },
    (d, v) => g(d, v.L, v.n) + g(d, v.L2, v.n),
  ],
  [
    {
      en: "If the value of {L} in {n} increases by 20% in the next number, what will it be?",
      id: "Jika nilai {L} pada {n} meningkat 20% pada angka berikutnya, berapakah nilainya?",
    },
    (d, v) => Math.round(g(d, v.L, v.n) * 1.2),
  ],
  [
    {
      en: "If {L} decreases by 30% since {n}, what is the value in the next number?",
      id: "Jika nilai {L} turun 30% dari {n}, berapa nilainya pada angka berikutnya?",
    },
    (d, v) => Math.round(g(d, v.L, v.n) * 0.7),
  ],
  [
    {
      en: "If the value of {L} in {n} is reduced by 40%, what will it be?",
      id: "Jika nilai {L} pada {n} berkurang 40%, berapa nilainya?",
    },
    (d, v) => Math.round(g(d, v.L, v.n) * 0.6),
  ],
  [
    {
      en: "What percentage does {L} contribute compared to the total of all letters in {n}?",
      id: "Berapa persentase kontribusi {L} terhadap jumlah seluruh huruf pada {n}?",
    },
    (d, v) => {
      const s = sum(L.map((l) => g(d, l, v.n)));
      return s ? Math.round((g(d, v.L, v.n) / s) * 100) + "%" : "0%";
    },
  ],
  [
    {
      en: "What is the total value of {L} across all numbers?",
      id: "Berapa total nilai {L} di semua angka?",
    },
    (d, v) => tot(d, v.L),
  ],
  [
    {
      en: "What is the average value of {L} across all numbers?",
      id: "Berapa rata-rata nilai {L} di semua angka?",
    },
    (d, v) => Math.round(tot(d, v.L) / 4),
  ],
  [
    {
      en: "Which letter has the highest performance?",
      id: "Huruf mana yang memiliki kinerja tertinggi?",
    },
    (d) => best(d, (a, b) => a > b),
  ],
  [
    {
      en: "Which letter has the lowest performance?",
      id: "Huruf mana yang memiliki kinerja terendah?",
    },
    (d) => best(d, (a, b) => a < b),
  ],
];
export default {
  id: "line",
  color: "#7f1d1d",
  title: { en: "Line Chart", id: "Grafik Garis" },
  footnote: {
    en: "Note: Each line tracks one letter across numbers 1 to 4.",
    id: "Keterangan: Setiap garis menunjukkan satu huruf pada angka 1 sampai 4.",
  },
  newData: () =>
    Object.fromEntries(L.map((l) => [l, N.map(() => rand.int(0, 10) * 100)])),
  view: () => `<div id="chart"><canvas></canvas></div>`,
  draw(el, d) {
    const css = getComputedStyle(document.documentElement),
      fg = css.getPropertyValue("--fg"),
      ln = css.getPropertyValue("--line");
    new Chart(el.querySelector("canvas"), {
      type: "line",
      data: {
        labels: N,
        datasets: L.map((l, i) => ({
          label: l,
          data: d[l],
          borderColor: `hsl(${i * 100},80%,50%)`,
          borderDash: [
            [1, 5],
            [2, 4],
            [3, 3],
            [4, 2],
            [5, 1],
          ][i],
          pointStyle: ["circle", "triangle", "rect", "cross", "star"][i],
          pointRadius: 5,
          tension: 0,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        color: fg,
        borderColor: ln,
        scales: {
          y: {
            beginAtZero: true,
            max: 1000,
            ticks: { color: fg },
            grid: { color: ln },
          },
          x: { ticks: { color: fg }, grid: { color: ln } },
        },
        plugins: { legend: { labels: { color: fg, usePointStyle: true } } },
      },
    });
  },
  ask: templated({ L, n: N }, T),
};
