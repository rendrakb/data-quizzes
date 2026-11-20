const D = {
  en: {
    title: "Data Quizzes",
    subtitle: "Randomized quizzes for rapid data reading",
    submit: "Submit",
    show: "Show answer",
    next: "New question",
    rand: "Randomize data",
    ok: "Correct.",
    bad: "Wrong",
    score: "Score",
    last: "Last",
    total: "Total",
    answer: "Answer",
    logic: "Logic",
    shuf: "Shuffle",
    on: "on",
    off: "off",
    ph: "Answer",
  },
  id: {
    title: "Kuis Data",
    subtitle: "Kuis acak untuk membaca data dengan cepat",
    submit: "Kirim",
    show: "Lihat jawaban",
    next: "Soal baru",
    rand: "Acak data",
    ok: "Benar.",
    bad: "Salah",
    score: "Skor",
    last: "Terakhir",
    total: "Total",
    answer: "Jawaban",
    logic: "Logika",
    shuf: "Acak kuis",
    on: "aktif",
    off: "mati",
    ph: "Jawaban",
  },
};
export let lang = "en";
export const setLang = (l) => {
  lang = D[l] ? l : "en";
  document.documentElement.lang = lang;
};
export const t = (k) => D[lang][k] ?? k;
export const pickTitle = (q) => q.title[lang] ?? q.title.en;
export const langs = Object.keys(D);
