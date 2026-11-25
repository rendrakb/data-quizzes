import { quizzes } from "./registry.js";
import { t, setLang, lang, langs, pickTitle } from "./core/i18n.js";
import { check, rand } from "./core/util.js";

const $ = (id) => document.getElementById(id);
const store = {
  get: (k, d) => {
    try {
      return localStorage.getItem(k) ?? d;
    } catch {
      return d;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
};
const S = {
  quiz: null,
  data: null,
  q: null,
  ok: 0,
  n: 0,
  t0: Date.now(),
  lastT: null,
  done: false,
  shuffle: store.get("shuffle", "0") === "1",
};
const mmss = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// ---------- chrome (language / theme / shuffle) ----------
function chrome() {
  document
    .querySelectorAll("[data-i]")
    .forEach((e) => (e.textContent = t(e.dataset.i)));
  document.title = S.quiz ? `${pickTitle(S.quiz)} · ${t("title")}` : t("title");
  $("lang").textContent = lang.toUpperCase();
  $("theme").textContent =
    document.documentElement.dataset.theme === "light" ? "☀" : "☾";
  $("shuf").textContent = `${t("shuf")}: ${t(S.shuffle ? "on" : "off")}`;
  $("ans").placeholder = t("ph");
  $("score").textContent = `${t("score")}: ${S.ok}/${S.n}`;
  $("grid").innerHTML = "";
  quizzes.forEach((z) => {
    const b = document.createElement("button");
    b.style.background = z.color;
    b.textContent = pickTitle(z);
    b.onclick = () => (location.hash = z.id);
    $("grid").append(b);
  });
}
$("lang").onclick = () => {
  setLang(langs[(langs.indexOf(lang) + 1) % langs.length]);
  store.set("lang", lang);
  chrome();
  if (S.quiz) {
    const answerVisible = !$("a").hidden;
    renderView();
    showQuestion();
    $("a").hidden = !answerVisible;
  }
};
$("theme").onclick = () => {
  const d = document.documentElement;
  d.dataset.theme = d.dataset.theme === "light" ? "dark" : "light";
  store.set("theme", d.dataset.theme);
  chrome();
};
$("shuf").onclick = () => {
  S.shuffle = !S.shuffle;
  store.set("shuffle", S.shuffle ? "1" : "0");
  chrome();
};

// ---------- quiz session ----------
function randomize() {
  const z = S.quiz;
  S.data = z.newData();
  renderView();
  ask();
}
function renderView() {
  $("view").innerHTML = S.quiz.view(S.data, lang);
  if (S.quiz.footnote) {
    const text = S.quiz.footnote[lang] ?? S.quiz.footnote.en;
    $("view").insertAdjacentHTML(
      "beforeend",
      `<p class="table-footnote">${text}</p>`,
    );
  }
  S.quiz.draw?.($("view"), S.data);
}
function ask() {
  S.q = S.quiz.ask(S.data);
  S.done = false;
  showQuestion();
  $("ans").value = "";
  $("fb").textContent = "";
  $("ans").focus();
}
function showQuestion() {
  const { text, answer, logic } = S.q,
    prompt = typeof text === "string" ? text : (text[lang] ?? text.en),
    explanation =
      typeof logic === "string" ? logic : (logic?.[lang] ?? logic?.en);
  $("q").innerHTML =
    `<strong>${prompt}</strong><div id="a" hidden>${t("answer")}: ${answer}${explanation ? `<br>${t("logic")}: ${explanation}` : ""}</div>`;
  $("ans").placeholder = t("ph");
}
// Shuffle mode: any "new question" / "randomize" jumps to another quiz.
function advance(fn) {
  if (S.shuffle) {
    const others = quizzes.filter((z) => z !== S.quiz);
    location.hash = rand.pick(others).id;
  } else fn();
}
$("next").onclick = () => advance(() => (S.quiz.fresh ? randomize() : ask()));
$("rand").onclick = () => advance(randomize);
$("show").onclick = () => ($("a").hidden = false);
function submit() {
  if (S.done) return;
  const ok = check($("ans").value, S.q.answer);
  S.n++;
  if (ok) S.ok++;
  $("fb").textContent = t(ok ? "ok" : "bad");
  $("fb").style.color = ok ? "var(--ok)" : "var(--bad)";
  const now = Date.now();
  if (S.lastT)
    $("last").textContent = `${t("last")}: ${mmss((now - S.lastT) / 1000)}`;
  S.lastT = now;
  S.done = true;
  $("score").textContent = `${t("score")}: ${S.ok}/${S.n}`;
}
$("submit").onclick = submit;
$("ans").onkeydown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    submit();
  }
};
setInterval(
  () =>
    ($("total").textContent =
      `${t("total")}: ${mmss((Date.now() - S.t0) / 1000)}`),
  1000,
);

// ---------- routing (#id) ----------
function route() {
  const z = quizzes.find((q) => q.id === location.hash.slice(1));
  $("hub").hidden = !!z;
  $("quiz").hidden = !z;
  document.title = z ? `${pickTitle(z)} · ${t("title")}` : t("title");
  S.quiz = z || null;
  if (z) randomize();
}
setLang(store.get("lang", navigator.language.startsWith("id") ? "id" : "en"));
document.documentElement.dataset.theme = store.get(
  "theme",
  matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark",
);
chrome();
addEventListener("hashchange", route);
route();
