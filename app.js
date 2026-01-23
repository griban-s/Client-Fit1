const THEME_KEY = "gdemoi-theme";

const themeToggle = document.querySelector("[data-theme-toggle]");
const root = document.body;

const applyTheme = (theme) => {
  if (theme === "dark") {
    root.classList.add("theme-dark");
  } else {
    root.classList.remove("theme-dark");
  }
  root.dataset.theme = theme;
};

const storedTheme = localStorage.getItem(THEME_KEY);
applyTheme(storedTheme || "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = root.classList.contains("theme-dark") ? "light" : "dark";
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  });
}

const solutionsHome = document.querySelector("#solutions-home");
const solutionsCategory = document.querySelector("#solutions-category");
const solutionsProduct = document.querySelector("#solutions-product");

const showView = (view) => {
  [solutionsHome, solutionsCategory, solutionsProduct].forEach((section) => {
    if (section) {
      section.classList.toggle("is-active", section === view);
    }
  });
};

const transportCard = document.querySelector("[data-category='transport']");
if (transportCard) {
  transportCard.addEventListener("click", () => {
    showView(solutionsCategory);
  });
}

document.querySelectorAll("[data-back='home']").forEach((button) => {
  button.addEventListener("click", () => showView(solutionsHome));
});

document.querySelectorAll("[data-back='category']").forEach((button) => {
  button.addEventListener("click", () => showView(solutionsCategory));
});

document.querySelectorAll("[data-product='a6']").forEach((button) => {
  button.addEventListener("click", () => showView(solutionsProduct));
});
