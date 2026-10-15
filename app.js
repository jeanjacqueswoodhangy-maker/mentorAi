const APP_VERSION = "mentor-ai-landing-v2";

const MODEL_SCHEMA = {
  users: ["id", "firstName", "age", "language", "profile", "preferences", "createdAt"],
  goals: ["userId", "goal", "category", "description", "startDate", "deadline", "status"],
  missions: ["goalId", "description", "date", "duration", "status", "points"],
  progress: ["userId", "goalId", "percent", "completedMissions", "streaks", "stats"],
  reminders: ["userId", "type", "date", "time", "repeat", "status"],
  conversations: ["userId", "date", "content", "context", "allowedMemory"],
  preferences: ["language", "mentorStyle", "notifications", "schedule", "permissions"],
};

const state = {
  lang: localStorage.getItem("mentor-ai-lang") || "fr",
  theme: localStorage.getItem("mentor-ai-theme") || "light",
  completed: localStorage.getItem("mentor-ai-preview-completed") === "true",
  dict: {},
};

const $ = (selector, parent = document) => parent.querySelector(selector);

function pathValue(path) {
  return path.split(".").reduce((value, key) => value?.[key], state.dict) ?? "";
}

function t(path, params = {}) {
  let value = pathValue(path);
  Object.entries(params).forEach(([key, replacement]) => {
    value = value.replaceAll(`{${key}}`, replacement);
  });
  return value;
}

function list(path) {
  const value = pathValue(path);
  return Array.isArray(value) ? value : [];
}

async function loadTranslations(lang) {
  const response = await fetch(`i18n/${lang}.json?v=${APP_VERSION}`, { cache: "no-cache" });
  state.dict = await response.json();
  document.documentElement.lang = lang === "ht" ? "ht" : "fr";
}

function icon(index) {
  return ["ET", "TR", "EN", "FI", "DP", "VQ", "15", "+", "AI", "%"][index] || "M";
}

function sectionHeading(titlePath, bodyPath) {
  return `
    <div class="section-heading">
      <h2>${t(titlePath)}</h2>
      <p>${t(bodyPath)}</p>
    </div>
  `;
}

function cardGrid(items, className, render) {
  return `<div class="grid ${className}">${items.map(render).join("")}</div>`;
}

function renderHero() {
  return `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-inner">
        <div>
          <span class="eyebrow">${t("hero.eyebrow")}</span>
          <h1 id="hero-title">MENTOR AI</h1>
          <p class="hero-subtitle">${t("hero.subtitle")}</p>
          <div class="hero-actions">
            <a class="button button-primary" href="#start">${t("hero.cta")}</a>
            <a class="button button-secondary" href="#how">${t("hero.secondary")}</a>
          </div>
          <div class="trust-row" aria-label="${t("hero.trustLabel")}">
            ${list("hero.trust").map((item) => `<div class="trust-item"><span class="trust-dot" aria-hidden="true"></span><span>${item}</span></div>`).join("")}
          </div>
        </div>
        <div class="phone-shell" aria-label="${t("missionPreview.aria")}">
          <div class="phone-screen">
            <div class="phone-top">
              <span>${t("missionPreview.topLeft")}</span>
              <span>${t("missionPreview.topRight")}</span>
            </div>
            <div class="mission-preview">
              <span class="eyebrow">${t("missionPreview.eyebrow")}</span>
              <h2>${t("missionPreview.title")}</h2>
              <p>${t("missionPreview.intro")}</p>
              <div class="mission-card">
                <div class="mission-meta">
                  <span class="pill">${t("missionPreview.duration")}</span>
                  <span class="pill">${t("missionPreview.points")}</span>
                </div>
                <p>${t("missionPreview.task")}</p>
                <div class="mission-progress" aria-label="${t("missionPreview.progress")}">
                  <span></span>
                </div>
                <div class="mini-stats">
                  ${list("missionPreview.stats").map((item) => `<div class="mini-stat"><strong>${item.value}</strong><span>${item.label}</span></div>`).join("")}
                </div>
                <button class="button button-primary check-button" id="missionDone" type="button">${state.completed ? t("missionPreview.done") : t("missionPreview.button")}</button>
                <div class="points-toast" id="pointsToast" aria-live="polite">${t("missionPreview.toast")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderMain() {
  const domains = list("domains.items");
  const features = list("features.items");
  const mentors = list("mentors.items");

  $("#main").innerHTML = `
    <div class="offline-note" id="offlineNote" role="status">${t("offline")}</div>
    ${renderHero()}
    <section class="section" id="problem">
      <div class="section-inner split-visual">
        <div>${sectionHeading("problem.title", "problem.body")}</div>
        <div class="before-after">
          ${list("problem.states").map((item) => `<div class="state-panel"><strong>${item.title}</strong><p>${item.body}</p></div>`).join("")}
        </div>
      </div>
    </section>
    <section class="section" id="how">
      <div class="section-inner">
        ${sectionHeading("steps.title", "steps.body")}
        <div class="steps">
          ${list("steps.items").map((item) => `<article class="step"><h3>${item.title}</h3><p>${item.body}</p></article>`).join("")}
        </div>
      </div>
    </section>
    <section class="section" id="domains">
      <div class="section-inner">
        ${sectionHeading("domains.title", "domains.body")}
        ${cardGrid(domains, "domain-grid", (item, index) => `<article class="card domain-card"><span class="domain-icon" aria-hidden="true">${icon(index)}</span><div><h3>${item.title}</h3><p>${item.body}</p></div></article>`)}
      </div>
    </section>
    <section class="section" id="features">
      <div class="section-inner">
        ${sectionHeading("features.title", "features.body")}
        ${cardGrid(features, "feature-grid", (item, index) => `<article class="card feature-card"><span class="feature-icon" aria-hidden="true">${icon(index + 6)}</span><h3>${item.title}</h3><p>${item.body}</p></article>`)}
      </div>
    </section>
    <section class="section" id="mentors">
      <div class="section-inner">
        ${sectionHeading("mentors.title", "mentors.body")}
        ${cardGrid(mentors, "mentor-grid", (item) => `<article class="card mentor-card"><h3>${item.title}</h3><p>${item.body}</p><div class="mentor-quote">${item.quote}</div></article>`)}
      </div>
    </section>
    <section class="section haiti-band" id="reality">
      <div class="section-inner">
        ${sectionHeading("reality.title", "reality.body")}
        <div class="reality-list">
          ${list("reality.items").map((item) => `<div class="reality-item">${item}</div>`).join("")}
        </div>
      </div>
    </section>
    <section class="section" id="privacy">
      <div class="section-inner">
        ${sectionHeading("privacy.title", "privacy.body")}
        <div class="privacy-grid">
          ${list("privacy.items").map((item) => `<article class="privacy-card card"><h3>${item.title}</h3><p>${item.body}</p></article>`).join("")}
        </div>
      </div>
    </section>
    <section class="section" id="soon">
      <div class="section-inner">
        ${sectionHeading("soon.title", "soon.body")}
        <article class="coming-card card"><p>${t("soon.note")}</p></article>
      </div>
    </section>
    <section class="cta-section" id="start">
      <div class="section-inner">
        <div class="cta-panel">
          <div>
            <h2>${t("cta.title")}</h2>
            <p>${t("cta.body")}</p>
          </div>
          <a class="button button-primary" href="#top">${t("cta.button")}</a>
        </div>
      </div>
    </section>
    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <strong>MENTOR AI</strong>
          <p>${t("footer.tagline")}</p>
        </div>
        <div class="footer-links">
          ${list("footer.links").map((link) => `<a href="${link.href}">${link.label}</a>`).join("")}
        </div>
      </div>
    </footer>
  `;

  bindDynamicControls();
}

function translateStatic() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  $("#languageSelect").innerHTML = `
    <option value="fr">${t("controls.fr")}</option>
    <option value="ht">${t("controls.ht")}</option>
  `;
  $("#languageSelect").value = state.lang;
  $("#themeToggle").setAttribute("aria-label", t("controls.theme"));
  $("#languageSelect").setAttribute("aria-label", t("controls.languageLabel"));
}

function bindDynamicControls() {
  const button = $("#missionDone");
  const toast = $("#pointsToast");
  button?.addEventListener("click", () => {
    state.completed = true;
    localStorage.setItem("mentor-ai-preview-completed", "true");
    button.textContent = t("missionPreview.done");
    toast.classList.remove("is-visible");
    requestAnimationFrame(() => toast.classList.add("is-visible"));
  });
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("mentor-ai-theme", theme);
  $("#themeToggle").setAttribute("aria-pressed", String(theme === "dark"));
}

async function setLanguage(lang) {
  state.lang = lang;
  localStorage.setItem("mentor-ai-lang", lang);
  $("#languageSelect").value = lang;
  await loadTranslations(lang);
  translateStatic();
  renderMain();
}

function handleConnectivity() {
  const note = $("#offlineNote");
  note?.classList.toggle("is-visible", !navigator.onLine);
}

async function init() {
  setTheme(state.theme);
  $("#languageSelect").value = state.lang;
  $("#languageSelect").addEventListener("change", (event) => setLanguage(event.target.value));
  $("#themeToggle").addEventListener("click", () => setTheme(state.theme === "dark" ? "light" : "dark"));

  await loadTranslations(state.lang);
  translateStatic();
  renderMain();
  handleConnectivity();
  window.addEventListener("online", handleConnectivity);
  window.addEventListener("offline", handleConnectivity);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  window.MentorAIModelSchema = MODEL_SCHEMA;
  window.MentorAIAppVersion = APP_VERSION;
}

init();
