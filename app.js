const THEME_KEY = "gdemoi-theme";
const ADMIN_KEY = "gdemoi-admin-data";
const FAVORITES_KEY = "gdemoi-favorites";
const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

const DEFAULT_DATA = {
  categories: [
    {
      id: "transport",
      name: "Транспорт и техника",
      icon: "assets/icon-transport.svg",
      subcategories: [
        "Легковой",
        "Грузовой",
        "Водный",
        "ГСМ",
        "Спецтехника",
        "Погрузчики",
        "Рефрижераторы",
      ],
    },
    {
      id: "people",
      name: "Люди",
      icon: "assets/icon-people.svg",
      subcategories: ["Мобильное приложение", "Персональные трекеры"],
    },
    {
      id: "industry",
      name: "Отрасли",
      icon: "assets/icon-industry.svg",
      subcategories: [
        "Такси",
        "Лесная техника",
        "Сельское хозяйство",
        "ЖКХ",
        "Строительство",
        "Служба доставки",
      ],
    },
    {
      id: "cargo",
      name: "Грузы",
      icon: "assets/icon-cargo.svg",
      subcategories: ["Автономные маяки"],
    },
    {
      id: "animal",
      name: "Животные",
      icon: "assets/icon-animal.svg",
      subcategories: ["Домашние животные", "С/Х животные"],
    },
    {
      id: "stationary",
      name: "Стационарные объекты",
      icon: "assets/icon-stationary.svg",
      subcategories: ["Генераторы", "Парогенераторы"],
    },
  ],
  products: [
    {
      id: "compact-nsx",
      title: "ComPacT NSX, new generation",
      description: "Circuit-breakers, to protect lines carrying up to 630 amps",
      image: "assets/product-breaker.svg",
      categoryId: "transport",
      subcategory: "Легковой",
    },
    {
      id: "rnis",
      title: "РНИС",
      description:
        "Региональная навигационная информационная система (РНИС)",
      image: "assets/product-rnis.svg",
      categoryId: "transport",
      subcategory: "Грузовой",
    },
    {
      id: "tesys-deca-advanced",
      title: "TeSys Deca Advanced",
      description: "Contactors to control motors up to 150 A",
      image: "assets/product-contactor.svg",
      categoryId: "transport",
      subcategory: "Спецтехника",
    },
    {
      id: "harmony-xb4",
      title: "Harmony XB4",
      description: "Ø 22 mm modular metal pushbuttons",
      image: "assets/product-push.svg",
      categoryId: "industry",
      subcategory: "Строительство",
    },
    {
      id: "harmony-p6",
      title: "Harmony P6",
      description: "Drive efficiency and productivity at the Edge",
      image: "assets/product-display.svg",
      categoryId: "industry",
      subcategory: "Служба доставки",
    },
    {
      id: "harmony-xb5",
      title: "Harmony XB5",
      description: "Ø 22 mm modular plastic pushbuttons",
      image: "assets/product-push.svg",
      categoryId: "industry",
      subcategory: "Такси",
    },
    {
      id: "tesys-deca-frame-2",
      title: "TeSys Deca - frame 2",
      description: "Circuit-breakers, coordinated with contactors",
      image: "assets/product-breaker.svg",
      categoryId: "transport",
      subcategory: "Грузовой",
    },
    {
      id: "altivar-atv320",
      title: "Altivar Machine ATV320",
      description: "Smart variable speed drive from 0.18 to 22 kW",
      image: "assets/product-drive.svg",
      categoryId: "industry",
      subcategory: "ЖКХ",
    },
    {
      id: "easypact-cvs",
      title: "EasyPact CVS",
      description: "Molded-case circuit breakers from 16 to 630 A",
      image: "assets/product-breaker.svg",
      categoryId: "stationary",
      subcategory: "Генераторы",
    },
    {
      id: "acti9-iprd",
      title: "Acti9 iPRD-DC-PV",
      description: "Surge Protection Devices for photovoltaic",
      image: "assets/product-surge.svg",
      categoryId: "stationary",
      subcategory: "Парогенераторы",
    },
    {
      id: "acti9-idpn-vigi",
      title: "Acti9 iDPN Vigi",
      description: "Residual current circuit breakers with RCBO",
      image: "assets/product-switch.svg",
      categoryId: "stationary",
      subcategory: "Парогенераторы",
    },
    {
      id: "compact-nsxm",
      title: "ComPacT NSXm, new generation",
      description: "Circuit-breakers, to protect lines up to 160 amps",
      image: "assets/product-breaker.svg",
      categoryId: "transport",
      subcategory: "Легковой",
    },
  ],
  subsections: [],
  defaultFavorites: [
    "compact-nsx",
    "rnis",
    "tesys-deca-advanced",
    "harmony-xb4",
    "harmony-p6",
    "harmony-xb5",
    "tesys-deca-frame-2",
    "altivar-atv320",
    "easypact-cvs",
    "acti9-iprd",
    "acti9-idpn-vigi",
    "compact-nsxm",
  ],
};

const DEFAULT_FEATURES = [
  "Подключение к постоянному питанию",
  "Мгновенное отображение потребления энергии",
  "Простая инсталляция",
  "Компактный размер",
  "Простое обслуживание",
];

const themeToggle = document.querySelector("[data-theme-toggle]");
const root = document.body;

const THEMES = ["light", "dark", "midnight", "violet"];
const isFirebaseConfigured = () =>
  Object.values(FIREBASE_CONFIG).every((value) => String(value || "").trim());
let firestore = null;
let appDocRef = null;
let cloudReady = false;
let saveTimer = null;
let isApplyingCloud = false;

const scheduleCloudSave = () => {
  if (!cloudReady || !appDocRef || isApplyingCloud) {
    return;
  }
  if (saveTimer) {
    window.clearTimeout(saveTimer);
  }
  saveTimer = window.setTimeout(() => {
    const payload = {
      adminData: data,
      favorites,
      theme: localStorage.getItem(THEME_KEY) || "light",
      updatedAt: Date.now(),
    };
    appDocRef
      .set(payload, { merge: true })
      .catch(() => {});
  }, 300);
};

const applyTheme = (theme) => {
  const nextTheme = THEMES.includes(theme) ? theme : "light";
  root.classList.remove(
    "theme-light",
    "theme-dark",
    "theme-midnight",
    "theme-violet"
  );
  root.classList.add(`theme-${nextTheme}`);
  root.dataset.theme = nextTheme;
  const label = document.querySelector("[data-theme-label]");
  if (label) {
    const map = {
      light: "Светлая",
      dark: "Тёмная",
      midnight: "Ночная",
      violet: "Фиолетовая",
    };
    label.textContent = map[nextTheme] || "Тема";
  }
  localStorage.setItem(THEME_KEY, nextTheme);
  scheduleCloudSave();
};

const storedTheme = localStorage.getItem(THEME_KEY);
applyTheme(storedTheme || "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = root.dataset.theme || "light";
    const index = THEMES.indexOf(current);
    const nextTheme = THEMES[(index + 1) % THEMES.length];
    localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
  });
}

const solutionsHome = document.querySelector("#solutions-home");
const solutionsCategory = document.querySelector("#solutions-category");
const solutionsProduct = document.querySelector("#solutions-product");
const solutionsSearch = document.querySelector("#solutions-search");

const catalogGrid = document.querySelector("[data-catalog-grid]");
const popularGrid = document.querySelector("[data-popular-grid]");
const categoryProducts = document.querySelector("[data-category-products]");
const catalogSelect = document.querySelector("[data-catalog-select]");
const categoryTitle = document.querySelector("[data-category-title]");
const subcategoryList = document.querySelector("[data-subcategory-list]");
const searchResults = document.querySelector("[data-search-results]");
const searchTitle = document.querySelector("[data-search-title]");
const globalSearchInputs = document.querySelectorAll("[data-global-search]");

const productDetailImage = document.querySelector("[data-product-detail-image]");
const productDetailImage2 = document.querySelector(
  "[data-product-detail-image-2]"
);
const productDetailTitle = document.querySelector("[data-product-detail-title]");
const productDetailDescription = document.querySelector(
  "[data-product-detail-description]"
);
const productDetailFeatures = document.querySelector(
  "[data-product-detail-features]"
);
const productDetailTags = document.querySelector("[data-product-detail-tags]");

const adminCategories = document.querySelector("[data-admin-categories]");
const adminSubcategories = document.querySelector("[data-admin-subcategories]");
const adminSubsections = document.querySelector("[data-admin-subsections]");
const adminProducts = document.querySelector("[data-admin-products]");
const adminCategoryForm = document.querySelector("[data-admin-category-form]");
const adminSubcategoryForm = document.querySelector(
  "[data-admin-subcategory-form]"
);
const adminSubsectionForm = document.querySelector("[data-admin-subsection-form]");
const adminProductForm = document.querySelector("[data-admin-product-form]");
const adminCategorySearch = document.querySelector("[data-admin-category-search]");
const adminSubcategorySearch = document.querySelector(
  "[data-admin-subcategory-search]"
);
const adminSubsectionSearch = document.querySelector(
  "[data-admin-subsection-search]"
);
const adminProductSearch = document.querySelector("[data-admin-product-search]");
const adminProductModal = document.querySelector("[data-admin-product-modal]");
const adminProductCancel = document.querySelector(
  "[data-admin-product-cancel]"
);
const adminProductTitle = document.querySelector("[data-admin-product-title]");
const adminProductFeatureList = document.querySelector(
  "[data-admin-feature-list]"
);
const adminProductFeatureInput = document.querySelector(
  "input[name='featureInput']"
);
const adminProductFeatureAdd = document.querySelector(
  "[data-admin-feature-add]"
);
const adminProductCharacteristics = document.querySelector(
  "textarea[name='characteristics']"
);
const adminProductImageClear = document.querySelector(
  "[data-admin-image-clear]"
);
const adminProductImage2Clear = document.querySelector(
  "[data-admin-image2-clear]"
);
const adminExportButton = document.querySelector("[data-admin-export]");
const adminImportButton = document.querySelector("[data-admin-import]");
const adminImportInput = document.querySelector("[data-admin-import-file]");
const adminCategoryAdd = document.querySelector("[data-admin-category-add]");
const adminSubcategoryAdd = document.querySelector(
  "[data-admin-subcategory-add]"
);
const adminSubsectionAdd = document.querySelector("[data-admin-subsection-add]");
const adminProductAdd = document.querySelector("[data-admin-product-add]");
const adminProductGroup = document.querySelector("[data-admin-product-group]");
const adminSubcategoryCategory = document.querySelector(
  "[data-admin-subcategory-category]"
);
const adminSubsectionCategory = document.querySelector(
  "[data-admin-subsection-category]"
);
const adminSubsectionSubcategory = document.querySelector(
  "[data-admin-subsection-subcategory]"
);
const adminProductCategory = document.querySelector("[data-admin-product-category]");
const adminNavButtons = document.querySelectorAll("[data-admin-nav]");
const adminSections = document.querySelectorAll("[data-admin-section]");

let productSort = { key: "title", dir: "asc" };
let categorySort = { key: "manual", dir: "asc" };
let subcategorySort = { key: "manual", dir: "asc" };
let subsectionSort = { key: "manual", dir: "asc" };

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const normalizeUrl = (value) => {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    return "";
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const markdownLinksToHtml = (value) => {
  const escaped = escapeHtml(value);
  return escaped.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, text, url) =>
      `<a href="${normalizeUrl(url)}" target="_blank" rel="noopener noreferrer">${text}</a>`
  );
};


const loadAdminData = () => {
  try {
    const stored = localStorage.getItem(ADMIN_KEY);
    if (!stored) {
      return { ...DEFAULT_DATA };
    }
    const parsed = JSON.parse(stored);
    return {
      categories: Array.isArray(parsed.categories)
        ? parsed.categories
        : DEFAULT_DATA.categories,
      subsections: Array.isArray(parsed.subsections) ? parsed.subsections : [],
      products: Array.isArray(parsed.products)
        ? parsed.products
        : DEFAULT_DATA.products,
      defaultFavorites: Array.isArray(parsed.defaultFavorites)
        ? parsed.defaultFavorites
        : DEFAULT_DATA.defaultFavorites,
    };
  } catch (error) {
    return { ...DEFAULT_DATA };
  }
};

const saveAdminData = () => {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(data));
  scheduleCloudSave();
};

const loadFavorites = () => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    return null;
  }
};

const saveFavorites = () => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  scheduleCloudSave();
};

let data = loadAdminData();
let favorites = loadFavorites();
let currentCategoryId = data.categories[0]?.id || "";
let currentSubcategory = "";
let currentSearchQuery = "";

const ensureFavoritesValid = () => {
  const available = new Set(data.products.map((product) => product.id));
  favorites = (favorites || []).filter((id) => available.has(id));
  if (!favorites.length) {
    favorites = data.defaultFavorites.filter((id) => available.has(id));
  }
  saveFavorites();
};

const removeInvalidProducts = () => {
  if (!Array.isArray(data.products)) {
    data.products = [];
    return;
  }
  const categoryIds = new Set(data.categories.map((category) => category.id));
  data.products = data.products.filter(
    (product) =>
      product &&
      product.categoryId &&
      categoryIds.has(product.categoryId) &&
      product.subcategory
  );
  saveAdminData();
};

const applyCloudState = (payload) => {
  if (!payload) {
    return;
  }
  isApplyingCloud = true;
  if (payload.adminData) {
    data = payload.adminData;
  }
  if (Array.isArray(payload.favorites)) {
    favorites = payload.favorites;
  }
  if (payload.theme) {
    applyTheme(payload.theme);
  }
  removeInvalidProducts();
  ensureFavoritesValid();
  currentCategoryId = data.categories[0]?.id || "";
  currentSubcategory = "";
  renderAll();
  isApplyingCloud = false;
};

const initCloudSync = () => {
  if (!isFirebaseConfigured() || !window.firebase) {
    return;
  }
  if (!window.firebase.apps?.length) {
    window.firebase.initializeApp(FIREBASE_CONFIG);
  }
  firestore = window.firebase.firestore();
  appDocRef = firestore.collection("gdemoi").doc("appState");
  cloudReady = true;
  appDocRef.onSnapshot((doc) => {
    if (!doc.exists) {
      scheduleCloudSave();
      return;
    }
    applyCloudState(doc.data());
  });
};

removeInvalidProducts();
initCloudSync();

const ensureSubcategoryInCategory = (categoryId, name) => {
  const trimmed = String(name || "").trim();
  if (!trimmed) {
    return;
  }
  const category = data.categories.find((item) => item.id === categoryId);
  if (!category) {
    return;
  }
  if (!category.subcategories.includes(trimmed)) {
    category.subcategories.push(trimmed);
    subcategorySort = { key: "manual", dir: "asc" };
  }
};

const ensureSubsection = (categoryId, subcategory, name) => {
  const trimmed = String(name || "").trim();
  if (!trimmed) {
    return;
  }
  if (!categoryId || !subcategory) {
    return;
  }
  const exists = data.subsections.some(
    (item) =>
      item.categoryId === categoryId &&
      item.subcategory === subcategory &&
      item.name === trimmed
  );
  if (!exists) {
    data.subsections.push({
      id: `subsection-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      categoryId,
      subcategory,
      name: trimmed,
      createdAt: Date.now(),
      order: Date.now(),
    });
  }
};

const getSubsections = (categoryId, subcategory) => {
  if (!categoryId || !subcategory) {
    return [];
  }
  return data.subsections
    .filter(
      (item) =>
        item.categoryId === categoryId && item.subcategory === subcategory
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((item) => item.name);
};

const syncProductSubcategoryOptions = (select, categoryId, value) => {
  if (!select) {
    return "";
  }
  const category = data.categories.find((item) => item.id === categoryId);
  const options = (category?.subcategories || [])
    .map((name) => `<option value="${name}">${name}</option>`)
    .join("");
  select.innerHTML = options;
  if (value && category?.subcategories?.includes(value)) {
    select.value = value;
    return value;
  }
  if (category?.subcategories?.length) {
    select.value = category.subcategories[0];
    return category.subcategories[0];
  }
  return "";
};

const showView = (view) => {
  [
    solutionsHome,
    solutionsCategory,
    solutionsProduct,
    solutionsSearch,
  ].forEach((section) => {
    if (section) {
      section.classList.toggle("is-active", section === view);
    }
  });
};

const renderSearchResults = (query) => {
  if (!searchResults || !solutionsSearch) {
    return;
  }
  const value = query.trim().toLowerCase();
  currentSearchQuery = value;
  if (!value) {
    showView(solutionsHome);
    searchResults.innerHTML = "";
    if (searchTitle) {
      searchTitle.textContent = "Результаты поиска";
    }
    return;
  }
  const results = data.products.filter((product) => {
    const tags = product.tags || product.features || [];
    const haystack = [
      product.title,
      product.subsection || "",
      Array.isArray(tags) ? tags.join(" ") : "",
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(value);
  });
  searchResults.innerHTML = "";
  results.forEach((product) => {
    searchResults.appendChild(buildProductCard(product, favorites.includes(product.id)));
  });
  if (searchTitle) {
    searchTitle.textContent = `Результаты поиска: "${query.trim()}"`;
  }
  showView(solutionsSearch);
};

const setCardFavoriteState = (card, isFavorite) => {
  card.classList.toggle("is-favorite", isFavorite);
  const toggle = card.querySelector(".favorite-toggle");
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(isFavorite));
    toggle.setAttribute(
      "aria-label",
      isFavorite ? "Убрать из популярных" : "Добавить в популярные"
    );
  }
};

const buildProductCard = (product, isFavorite) => {
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.productId = product.id;
  card.dataset.product = product.id;
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  if (isFavorite) {
    card.classList.add("is-favorite");
  }
  const tags = product.tags || product.features || [];
  const tagsMarkup = Array.isArray(tags) && tags.length
    ? `<div class="product-tags">${tags
        .map((tag) => `<span class="product-tag">#${tag}</span>`)
        .join("")}</div>`
    : "";
  card.innerHTML = `
    <button class="favorite-toggle" type="button" aria-label="${
      isFavorite ? "Убрать из популярных" : "Добавить в популярные"
    }" aria-pressed="${String(!!isFavorite)}">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 3.5l2.6 5.26 5.8.84-4.2 4.1.99 5.78L12 16.9l-5.19 2.58.99-5.78-4.2-4.1 5.8-.84L12 3.5Z"
        />
      </svg>
    </button>
    <img src="${product.image}" alt="${product.title}" />
    <h4>${product.title}</h4>
    ${tagsMarkup}
  `;
  return card;
};

const renderCatalogGrid = () => {
  if (!catalogGrid) {
    return;
  }
  catalogGrid.innerHTML = "";
  data.categories.forEach((category) => {
    const card = document.createElement("button");
    card.className = "catalog-card";
    card.type = "button";
    card.dataset.category = category.id;
    card.innerHTML = `
      <img src="${category.icon}" alt="" />
      <span>${category.name}</span>
    `;
    catalogGrid.appendChild(card);
  });
};

const renderCatalogSelects = () => {
  if (catalogSelect) {
    catalogSelect.innerHTML = data.categories
      .map(
        (category) =>
          `<option value="${category.id}">${category.name}</option>`
      )
      .join("");
    if (currentCategoryId) {
      catalogSelect.value = currentCategoryId;
    }
  }
  if (adminSubcategoryCategory) {
    const selected = adminSubcategoryCategory.value;
    adminSubcategoryCategory.innerHTML = data.categories
      .map(
        (category) =>
          `<option value="${category.id}">${category.name}</option>`
      )
      .join("");
    if (selected && data.categories.some((item) => item.id === selected)) {
      adminSubcategoryCategory.value = selected;
    } else if (data.categories[0]) {
      adminSubcategoryCategory.value = data.categories[0].id;
    }
  }
  if (adminSubsectionCategory) {
    const selected = adminSubsectionCategory.value;
    adminSubsectionCategory.innerHTML = data.categories
      .map(
        (category) =>
          `<option value="${category.id}">${category.name}</option>`
      )
      .join("");
    if (selected && data.categories.some((item) => item.id === selected)) {
      adminSubsectionCategory.value = selected;
    } else if (data.categories[0]) {
      adminSubsectionCategory.value = data.categories[0].id;
    }
  }
  if (adminProductCategory) {
    const selected = adminProductCategory.value;
    adminProductCategory.innerHTML = data.categories
      .map(
        (category) =>
          `<option value="${category.id}">${category.name}</option>`
      )
      .join("");
    if (selected && data.categories.some((item) => item.id === selected)) {
      adminProductCategory.value = selected;
    } else if (data.categories[0]) {
      adminProductCategory.value = data.categories[0].id;
    }
  }
};

const renderSubcategories = () => {
  if (!subcategoryList) {
    return;
  }
  const category = data.categories.find(
    (item) => item.id === currentCategoryId
  );
  const items = category?.subcategories || [];
  if (!items.length) {
    currentSubcategory = "";
    subcategoryList.innerHTML = "";
    return;
  }
  if (!currentSubcategory || !items.includes(currentSubcategory)) {
    currentSubcategory = items[0];
  }
  subcategoryList.innerHTML = items
    .map(
      (name) =>
        `<li><button class="menu-item${
          name === currentSubcategory ? " is-active" : ""
        }" type="button">${name}</button></li>`
    )
    .join("");
};

const renderCategoryProducts = () => {
  if (!categoryProducts) {
    return;
  }
  const categoryProductsList = data.products.filter(
    (product) => product.categoryId === currentCategoryId
  );
  const products = currentSubcategory
    ? categoryProductsList.filter(
        (product) => (product.subcategory || "") === currentSubcategory
      )
    : categoryProductsList;
  categoryProducts.innerHTML = "";
  const favoriteSet = new Set(favorites);
  const groups = new Map();
  const ungrouped = [];
  products.forEach((product) => {
    const key = String(product.subsection || "").trim();
    if (!key) {
      ungrouped.push(product);
      return;
    }
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(product);
  });
  const subsectionOrder = new Map(
    data.subsections
      .filter(
        (item) =>
          item.categoryId === currentCategoryId &&
          item.subcategory === currentSubcategory
      )
      .map((item) => [item.name, item.order || 0])
  );
  Array.from(groups.entries())
    .map(([name, items]) => ({
      name,
      items,
      order: subsectionOrder.get(name) ?? Number.MAX_SAFE_INTEGER,
      createdAt: Math.min(...items.map((item) => item.createdAt || 0)),
    }))
    .sort((a, b) =>
      a.order === b.order ? a.createdAt - b.createdAt : a.order - b.order
    )
    .forEach(({ items, name }) => {
    const group = document.createElement("div");
    group.className = "subsection-group";
    const title = document.createElement("h4");
    title.className = "subsection-title";
    title.textContent = name;
    group.appendChild(title);
    const grid = document.createElement("div");
    grid.className = "product-grid";
    items.forEach((product) => {
      grid.appendChild(buildProductCard(product, favoriteSet.has(product.id)));
    });
    group.appendChild(grid);
    categoryProducts.appendChild(group);
    });
  if (ungrouped.length) {
    const group = document.createElement("div");
    group.className = "subsection-group";
    const grid = document.createElement("div");
    grid.className = "product-grid";
    ungrouped.forEach((product) => {
      grid.appendChild(buildProductCard(product, favoriteSet.has(product.id)));
    });
    group.appendChild(grid);
    categoryProducts.appendChild(group);
  }
};

const renderPopularGrid = () => {
  if (!popularGrid) {
    return;
  }
  popularGrid.innerHTML = "";
  const favoriteSet = new Set(favorites);
  favorites.forEach((productId) => {
    const product = data.products.find((item) => item.id === productId);
    if (product) {
      popularGrid.appendChild(buildProductCard(product, true));
    }
  });
  popularGrid
    .querySelectorAll(".product-card")
    .forEach((card) => setCardFavoriteState(card, true));
  if (categoryProducts) {
    categoryProducts
      .querySelectorAll(".product-card")
      .forEach((card) =>
        setCardFavoriteState(card, favoriteSet.has(card.dataset.productId))
      );
  }
};

const renderProductDetail = (product) => {
  if (!product) {
    return;
  }
  if (productDetailImage) {
    productDetailImage.src = product.image;
    productDetailImage.alt = product.title;
  }
  if (productDetailImage2) {
    if (product.image2) {
      productDetailImage2.src = product.image2;
      productDetailImage2.alt = product.title;
      productDetailImage2.style.display = "block";
    } else {
      productDetailImage2.removeAttribute("src");
      productDetailImage2.style.display = "none";
    }
  }
  if (productDetailTitle) {
    productDetailTitle.textContent = product.title;
  }
  if (productDetailDescription) {
    productDetailDescription.innerHTML = markdownLinksToHtml(product.description);
  }
  if (productDetailTags) {
    const tags = product.tags || product.features || [];
    productDetailTags.innerHTML = Array.isArray(tags) && tags.length
      ? tags.map((tag) => `<span class="product-tag">#${tag}</span>`).join("")
      : "";
  }
  if (productDetailFeatures) {
    const items =
      product.characteristics && product.characteristics.length
        ? product.characteristics
        : DEFAULT_FEATURES;
    productDetailFeatures.innerHTML = items
      .map((item) => `<li>${markdownLinksToHtml(item)}</li>`)
      .join("");
  }
};

const setCurrentCategory = (categoryId) => {
  currentCategoryId =
    categoryId || data.categories[0]?.id || currentCategoryId;
  currentSubcategory = "";
  if (catalogSelect) {
    catalogSelect.value = currentCategoryId;
  }
  if (categoryTitle) {
    const current = data.categories.find(
      (category) => category.id === currentCategoryId
    );
    categoryTitle.textContent = current?.name || "";
  }
  renderSubcategories();
  renderCategoryProducts();
};

const renderAdmin = () => {
  if (adminCategories) {
    const searchValue = adminCategorySearch?.value.trim().toLowerCase() || "";
    const filtered = data.categories.filter((category) => {
      if (!searchValue) {
        return true;
      }
      return (
        category.name.toLowerCase().includes(searchValue) ||
        (category.icon || "").toLowerCase().includes(searchValue)
      );
    });
    const sortDir = categorySort.dir === "desc" ? -1 : 1;
    const sorted =
      categorySort.key === "manual"
        ? filtered
        : filtered.slice().sort((a, b) => {
            const left =
              categorySort.key === "icon"
                ? (a.icon || "").toLowerCase()
                : a.name.toLowerCase();
            const right =
              categorySort.key === "icon"
                ? (b.icon || "").toLowerCase()
                : b.name.toLowerCase();
            return left.localeCompare(right, "ru") * sortDir;
          });
    const sortIcon = (key) => {
      if (categorySort.key !== key) {
        return "";
      }
      return categorySort.dir === "asc" ? "▲" : "▼";
    };
    adminCategories.innerHTML = `
      <div class="admin-table-row admin-table-head">
        <div class="admin-drag-head" aria-hidden="true"></div>
        <button type="button" class="admin-sort" data-admin-category-sort="name">
          Название ${sortIcon("name")}
        </button>
        <button type="button" class="admin-sort" data-admin-category-sort="icon">
          Иконка ${sortIcon("icon")}
        </button>
        <div>Действия</div>
      </div>
      ${sorted
        .map(
          (category, index) => `
          <div class="admin-table-row admin-table-body${
            index % 2 === 1 ? " is-alt" : ""
          }" data-category-id="${category.id}">
            <div class="admin-drag-cell">
              <span class="admin-drag-handle" draggable="true" title="Перетащить"></span>
            </div>
            <input type="text" data-category-name value="${category.name}" readonly />
            <input type="text" data-category-icon value="${category.icon || ""}" readonly />
            <div class="admin-table-actions">
              <button type="button" class="admin-action admin-edit" data-category-edit aria-label="Редактировать">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25Zm17.71-10.04a1 1 0 0 0 0-1.41l-2.5-2.5a1 1 0 0 0-1.41 0l-1.92 1.92 3.75 3.75 2.08-1.76Z"
                  />
                </svg>
              </button>
              <button type="button" class="admin-action admin-delete" data-category-delete aria-label="Удалить">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 7h2v8h-2v-8Zm4 0h2v8h-2v-8ZM6 10h2v8H6v-8Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        `
        )
        .join("")}
    `;
  }

  if (adminSubcategories && adminSubcategoryCategory) {
    const selected = adminSubcategoryCategory.value || data.categories[0]?.id;
    const category = data.categories.find((item) => item.id === selected);
    const list = category?.subcategories || [];
    const searchValue = adminSubcategorySearch?.value.trim().toLowerCase() || "";
    const filtered = list
      .map((name, index) => ({ name, index }))
      .filter((item) =>
        searchValue ? item.name.toLowerCase().includes(searchValue) : true
      );
    const sortDir = subcategorySort.dir === "desc" ? -1 : 1;
    const sorted =
      subcategorySort.key === "name"
        ? filtered.slice().sort((a, b) => {
            return (
              a.name.toLowerCase().localeCompare(b.name.toLowerCase(), "ru") *
              sortDir
            );
          })
        : filtered;
    const sortIcon = () => {
      if (subcategorySort.key !== "name") {
        return "";
      }
      return subcategorySort.dir === "asc" ? "▲" : "▼";
    };
    adminSubcategories.innerHTML = `
      <div class="admin-table-row admin-table-head">
        <div class="admin-drag-head" aria-hidden="true"></div>
        <button type="button" class="admin-sort" data-admin-subcategory-sort="name">
          Название ${sortIcon()}
        </button>
        <div>Действия</div>
      </div>
      ${sorted
        .map(
          (item, index) => `
          <div class="admin-table-row admin-table-body${
            index % 2 === 1 ? " is-alt" : ""
          }" data-subcategory-index="${item.index}">
            <div class="admin-drag-cell">
              <span class="admin-drag-handle" draggable="true" title="Перетащить"></span>
            </div>
            <input type="text" data-subcategory-name value="${item.name}" readonly />
            <div class="admin-table-actions">
              <button type="button" class="admin-action admin-edit" data-subcategory-edit aria-label="Редактировать">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25Zm17.71-10.04a1 1 0 0 0 0-1.41l-2.5-2.5a1 1 0 0 0-1.41 0l-1.92 1.92 3.75 3.75 2.08-1.76Z"
                  />
                </svg>
              </button>
              <button type="button" class="admin-action admin-delete" data-subcategory-delete aria-label="Удалить">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 7h2v8h-2v-8Zm4 0h2v8h-2v-8ZM6 10h2v8H6v-8Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        `
        )
        .join("")}
    `;
  }

  if (adminSubsections && adminSubsectionCategory && adminSubsectionSubcategory) {
    const categoryId =
      adminSubsectionCategory.value || data.categories[0]?.id || "";
    const category = data.categories.find((item) => item.id === categoryId);
    const subcategoryOptions = category?.subcategories || [];
    if (adminSubsectionSubcategory) {
      const selected = adminSubsectionSubcategory.value;
      adminSubsectionSubcategory.innerHTML = subcategoryOptions
        .map((name) => `<option value="${name}">${name}</option>`)
        .join("");
      if (selected && subcategoryOptions.includes(selected)) {
        adminSubsectionSubcategory.value = selected;
      } else if (subcategoryOptions[0]) {
        adminSubsectionSubcategory.value = subcategoryOptions[0];
      }
    }
    const searchValue =
      adminSubsectionSearch?.value.trim().toLowerCase() || "";
    const selectedSubcategory = adminSubsectionSubcategory.value || "";
    const filtered = data.subsections
      .filter(
        (item) =>
          item.categoryId === categoryId &&
          item.subcategory === selectedSubcategory
      )
      .filter((item) =>
        searchValue ? item.name.toLowerCase().includes(searchValue) : true
      );
    adminSubsections.innerHTML = `
      <div class="admin-table-row admin-table-head">
        <div class="admin-drag-head" aria-hidden="true"></div>
        <button type="button" class="admin-sort" data-admin-subsection-sort="name">
          Название ${subsectionSort.dir === "asc" ? "▲" : "▼"}
        </button>
        <div>Действия</div>
      </div>
      ${filtered
        .slice()
        .sort((a, b) =>
          subsectionSort.key === "manual"
            ? (a.order || 0) - (b.order || 0)
            : subsectionSort.dir === "asc"
              ? a.name.localeCompare(b.name, "ru")
              : b.name.localeCompare(a.name, "ru")
        )
        .map(
          (item, index) => `
          <div class="admin-table-row admin-table-body${
            index % 2 === 1 ? " is-alt" : ""
          }" data-subsection-id="${item.id}">
            <div class="admin-drag-cell">
              <span class="admin-drag-handle" draggable="true" title="Перетащить"></span>
            </div>
            <input type="text" data-subsection-name value="${item.name}" readonly />
            <div class="admin-table-actions">
              <button type="button" class="admin-action admin-edit" data-subsection-edit aria-label="Редактировать">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25Zm17.71-10.04a1 1 0 0 0 0-1.41l-2.5-2.5a1 1 0 0 0-1.41 0l-1.92 1.92 3.75 3.75 2.08-1.76Z"
                  />
                </svg>
              </button>
              <button type="button" class="admin-action admin-delete" data-subsection-delete aria-label="Удалить">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 7h2v8h-2v-8Zm4 0h2v8h-2v-8ZM6 10h2v8H6v-8Z"
                  />
                </svg>
              </button>
            </div>
          </div>
        `
        )
        .join("")}
    `;
  }

  if (adminProducts) {
    const searchValue = adminProductSearch?.value.trim().toLowerCase() || "";
    const groupBy = adminProductGroup?.value || "none";
    const categoryMap = new Map(
      data.categories.map((category) => [category.id, category.name])
    );

    const filteredProducts = data.products.filter((product) => {
      if (!searchValue) {
        return true;
      }
      const categoryName = categoryMap.get(product.categoryId) || "";
      const haystack = [
        product.title,
        product.description,
        categoryName,
        product.subcategory || "",
        product.subsection || "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(searchValue);
    });

    const groupKey = (product) => {
      if (groupBy === "category") {
        return categoryMap.get(product.categoryId) || "Без каталога";
      }
      if (groupBy === "subcategory") {
        return product.subcategory || "Без раздела";
      }
      return "Все товары";
    };

    const groups = new Map();
    filteredProducts.forEach((product) => {
      const key = groupKey(product);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push(product);
    });

    const groupEntries = Array.from(groups.entries());
    if (groupBy !== "none") {
      groupEntries.sort((a, b) => a[0].localeCompare(b[0], "ru"));
    }

    const sortValue = (product) => {
      if (productSort.key === "title") return product.title || "";
      if (productSort.key === "category") {
        return categoryMap.get(product.categoryId) || "";
      }
      if (productSort.key === "subcategory") return product.subcategory || "";
      if (productSort.key === "subsection") return product.subsection || "";
      return "";
    };

    const sortDir = productSort.dir === "desc" ? -1 : 1;
    const sortItems = (items) =>
      groupBy === "subcategory"
        ? items
            .slice()
            .sort((a, b) => (a.order || 0) - (b.order || 0))
        : items.slice().sort((a, b) => {
            const left = sortValue(a).toLowerCase();
            const right = sortValue(b).toLowerCase();
            return left.localeCompare(right, "ru") * sortDir;
          });

    const renderRow = (product, index) => {
      const handle =
        groupBy === "subcategory"
          ? `<div class="admin-drag-cell">
              <span class="admin-drag-handle" draggable="true" title="Перетащить"></span>
            </div>`
          : "";
      return `
          <div class="admin-table-row admin-table-body${
            index % 2 === 1 ? " is-alt" : ""
          }" data-product-id="${product.id}">
            ${handle}
            <input type="text" data-product-title value="${product.title}" readonly />
            <select data-product-category disabled>
              ${data.categories
                .map(
                  (category) =>
                    `<option value="${category.id}" ${
                      category.id === product.categoryId ? "selected" : ""
                    }>${category.name}</option>`
                )
                .join("")}
            </select>
            <select data-product-subcategory disabled>
              ${(data.categories.find(
                (category) => category.id === product.categoryId
              )?.subcategories || [])
                .map(
                  (name) =>
                    `<option value="${name}" ${
                      name === (product.subcategory || "") ? "selected" : ""
                    }>${name}</option>`
                )
                .join("")}
            </select>
            <input type="text" data-product-subsection value="${
              product.subsection || ""
            }" placeholder="Подраздел" readonly />
            <div class="admin-table-actions">
              <button type="button" class="admin-action admin-edit" data-product-edit aria-label="Редактировать">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M3 17.25V21h3.75L19.81 7.94l-3.75-3.75L3 17.25Zm17.71-10.04a1 1 0 0 0 0-1.41l-2.5-2.5a1 1 0 0 0-1.41 0l-1.92 1.92 3.75 3.75 2.08-1.76Z"
                  />
                </svg>
              </button>
              <button type="button" class="admin-action admin-copy" data-product-copy aria-label="Копировать">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M8 7a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V7Zm-3 3a2 2 0 0 1 2-2h1v8a3 3 0 0 0 3 3h6v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-10Z"
                  />
                </svg>
              </button>
              <button type="button" class="admin-action admin-delete" data-product-delete aria-label="Удалить">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 7h2v8h-2v-8Zm4 0h2v8h-2v-8ZM6 10h2v8H6v-8Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          `;
    };

    const sortIcon = (key) => {
      if (productSort.key !== key) {
        return "";
      }
      return productSort.dir === "asc" ? "▲" : "▼";
    };

    adminProducts.classList.toggle("is-reorder", groupBy === "subcategory");
    adminProducts.innerHTML = `
      <div class="admin-table-row admin-table-head">
        ${groupBy === "subcategory" ? "<div></div>" : ""}
        <button type="button" class="admin-sort" data-admin-sort="title">
          Название ${sortIcon("title")}
        </button>
        <button type="button" class="admin-sort" data-admin-sort="category">
          Каталог ${sortIcon("category")}
        </button>
        <button type="button" class="admin-sort" data-admin-sort="subcategory">
          Раздел ${sortIcon("subcategory")}
        </button>
        <button type="button" class="admin-sort" data-admin-sort="subsection">
          Подраздел ${sortIcon("subsection")}
        </button>
        <div>Действия</div>
      </div>
      ${groupEntries
        .map(([group, items]) => {
          const rows = sortItems(items)
            .map((product, index) => renderRow(product, index))
            .join("");
          if (groupBy === "none") {
            return rows;
          }
          return `
            <div class="admin-table-group">${group}</div>
            ${rows}
          `;
        })
        .join("")}
    `;
  }
};

const renderAll = () => {
  renderCatalogGrid();
  renderCatalogSelects();
  ensureFavoritesValid();
  setCurrentCategory(currentCategoryId);
  renderPopularGrid();
  renderAdmin();
  if (adminNavButtons.length && adminSections.length) {
    const activeButton =
      Array.from(adminNavButtons).find((button) =>
        button.classList.contains("is-active")
      ) || adminNavButtons[0];
    const sectionName = activeButton?.dataset.adminNav;
    adminSections.forEach((section) => {
      section.classList.toggle(
        "is-active",
        section.dataset.adminSection === sectionName
      );
    });
  }
  if (currentSearchQuery) {
    renderSearchResults(currentSearchQuery);
  }
};

document.addEventListener("click", (event) => {
  const catalogCard = event.target.closest(".catalog-card");
  if (catalogCard?.dataset.category) {
    setCurrentCategory(catalogCard.dataset.category);
    showView(solutionsCategory);
    return;
  }

  const favoriteToggle = event.target.closest(".favorite-toggle");
  if (favoriteToggle) {
    event.stopPropagation();
    const card = favoriteToggle.closest(".product-card");
    const productId = card?.dataset.productId;
    if (!productId) {
      return;
    }
    const isFavorite = favorites.includes(productId);
    favorites = isFavorite
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];
    saveFavorites();
    renderPopularGrid();
    return;
  }

  const card = event.target.closest(".product-card");
  if (card?.dataset.productId) {
    const product = data.products.find(
      (item) => item.id === card.dataset.productId
    );
    renderProductDetail(product);
    showView(solutionsProduct);
  }
});

document.addEventListener("keydown", (event) => {
  if (!["Enter", " "].includes(event.key)) {
    return;
  }
  const card = event.target.closest(".product-card");
  if (!card?.dataset.productId) {
    return;
  }
  event.preventDefault();
  const product = data.products.find((item) => item.id === card.dataset.productId);
  renderProductDetail(product);
  showView(solutionsProduct);
});

document.querySelectorAll("[data-back='home']").forEach((button) => {
  button.addEventListener("click", () => showView(solutionsHome));
});

document.querySelectorAll("[data-back='category']").forEach((button) => {
  button.addEventListener("click", () => showView(solutionsCategory));
});

const syncGlobalSearchInputs = (value) => {
  globalSearchInputs.forEach((input) => {
    if (input.value !== value) {
      input.value = value;
    }
  });
};

const handleGlobalSearch = (value) => {
  const trimmed = value.trim();
  if (!solutionsSearch || !searchResults) {
    if (trimmed) {
      window.location.href = `index.html?search=${encodeURIComponent(trimmed)}`;
    }
    return;
  }
  renderSearchResults(trimmed);
};

if (globalSearchInputs.length) {
  globalSearchInputs.forEach((input) => {
    input.addEventListener("input", (event) => {
      const value = event.target.value;
      syncGlobalSearchInputs(value);
      handleGlobalSearch(value);
    });
  });
  const params = new URLSearchParams(window.location.search);
  const queryParam = params.get("search") || "";
  if (queryParam) {
    syncGlobalSearchInputs(queryParam);
    handleGlobalSearch(queryParam);
  }
}

if (catalogSelect) {
  catalogSelect.addEventListener("change", () => {
    setCurrentCategory(catalogSelect.value);
  });
}

if (subcategoryList) {
  subcategoryList.addEventListener("click", (event) => {
    const button = event.target.closest(".menu-item");
    if (!button) {
      return;
    }
    subcategoryList.querySelectorAll(".menu-item").forEach((item) => {
      item.classList.remove("is-active");
    });
    button.classList.add("is-active");
    currentSubcategory = button.textContent?.trim() || "";
    renderCategoryProducts();
  });
}

document.addEventListener("click", (event) => {
  const link = event.target.closest(".product-card a");
  if (link) {
    event.stopPropagation();
  }
});

if (adminNavButtons.length && adminSections.length) {
  adminNavButtons.forEach((button) => {
    button.addEventListener("click", () => {
      adminNavButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      adminSections.forEach((section) => {
        section.classList.toggle(
          "is-active",
          section.dataset.adminSection === button.dataset.adminNav
        );
      });
    });
  });
}

if (adminCategoryForm) {
  adminCategoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(adminCategoryForm);
    const name = String(formData.get("name") || "").trim();
    const icon = String(formData.get("icon") || "").trim();
    if (!name) {
      return;
    }
    let id = slugify(name);
    if (!id) {
      id = `category-${Date.now()}`;
    }
    if (data.categories.some((item) => item.id === id)) {
      id = `${id}-${Date.now()}`;
    }
    data.categories.push({
      id,
      name,
      icon: icon || "assets/icon-stationary.svg",
      subcategories: [],
    });
    adminCategoryForm.reset();
    adminCategoryForm.classList.remove("is-open");
    saveAdminData();
    renderAll();
  });
}

if (adminCategories) {
  let dragCategoryId = null;
  let dragCategoryTarget = null;
  let dragCategoryPosition = "after";
  adminCategories.addEventListener("input", (event) => {
    const row = event.target.closest("[data-category-id]");
    if (!row) {
      return;
    }
    const category = data.categories.find(
      (item) => item.id === row.dataset.categoryId
    );
    if (!category) {
      return;
    }
    if (event.target.matches("[data-category-name]")) {
      category.name = event.target.value;
    }
    if (event.target.matches("[data-category-icon]")) {
      category.icon = event.target.value;
    }
  });

  adminCategories.addEventListener("change", (event) => {
    if (!event.target.matches("[data-category-name], [data-category-icon]")) {
      return;
    }
    saveAdminData();
    renderAll();
  });

  adminCategories.addEventListener("click", (event) => {
    const sortButton = event.target.closest("[data-admin-category-sort]");
    if (sortButton) {
      const key = sortButton.dataset.adminCategorySort || "name";
      if (categorySort.key === key) {
        categorySort.dir = categorySort.dir === "asc" ? "desc" : "asc";
      } else {
        categorySort = { key, dir: "asc" };
      }
      renderAdmin();
      return;
    }
    const editButton = event.target.closest("[data-category-edit]");
    const deleteButton = event.target.closest("[data-category-delete]");
    const row = event.target.closest("[data-category-id]");
    if (!row) {
      return;
    }
    if (editButton) {
      const inputs = row.querySelectorAll("input");
      const isEditing = row.classList.toggle("is-editing");
      inputs.forEach((input) => {
        input.readOnly = !isEditing;
      });
      return;
    }
    if (deleteButton) {
      if (!window.confirm("Удалить раздел каталога?")) {
        return;
      }
      data.categories = data.categories.filter(
        (item) => item.id !== row.dataset.categoryId
      );
      const fallback = data.categories[0]?.id || "";
      data.products.forEach((product) => {
        if (product.categoryId === row.dataset.categoryId) {
          product.categoryId = fallback;
        }
      });
      if (currentCategoryId === row.dataset.categoryId) {
        currentCategoryId = fallback;
      }
      saveAdminData();
      renderAll();
    }
  });

  adminCategories.addEventListener("dragstart", (event) => {
    const handle = event.target.closest(".admin-drag-handle");
    if (!handle) {
      return;
    }
    const row = handle.closest("[data-category-id]");
    if (!row) {
      return;
    }
    dragCategoryId = row.dataset.categoryId || null;
    if (!dragCategoryId) {
      return;
    }
    row.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", dragCategoryId);
  });

  adminCategories.addEventListener("dragend", () => {
    adminCategories
      .querySelectorAll(".is-dragging, .is-drop-before, .is-drop-after")
      .forEach((row) =>
        row.classList.remove("is-dragging", "is-drop-before", "is-drop-after")
      );
    dragCategoryId = null;
    dragCategoryTarget = null;
    dragCategoryPosition = "after";
  });

  adminCategories.addEventListener("dragover", (event) => {
    if (!dragCategoryId) {
      return;
    }
    event.preventDefault();
    let row = event.target.closest("[data-category-id]");
    if (!row) {
      const rows = adminCategories.querySelectorAll("[data-category-id]");
      if (!rows.length) {
        return;
      }
      const containerRect = adminCategories.getBoundingClientRect();
      const mouseY = event.clientY;
      if (mouseY < containerRect.top + 24) {
        row = rows[0];
        dragCategoryPosition = "before";
      } else if (mouseY > containerRect.bottom - 24) {
        row = rows[rows.length - 1];
        dragCategoryPosition = "after";
      } else {
        return;
      }
    } else {
      const rect = row.getBoundingClientRect();
      dragCategoryPosition =
        event.clientY < rect.top + rect.height / 2 ? "before" : "after";
    }
    if (dragCategoryTarget && dragCategoryTarget !== row) {
      dragCategoryTarget.classList.remove("is-drop-before", "is-drop-after");
    }
    dragCategoryTarget = row;
    row.classList.toggle("is-drop-before", dragCategoryPosition === "before");
    row.classList.toggle("is-drop-after", dragCategoryPosition === "after");
  });

  adminCategories.addEventListener("drop", (event) => {
    if (!dragCategoryId) {
      return;
    }
    event.preventDefault();
    const row = dragCategoryTarget;
    if (!row) {
      return;
    }
    const targetId = row.dataset.categoryId;
    if (!targetId || targetId === dragCategoryId) {
      return;
    }
    const fromIndex = data.categories.findIndex(
      (item) => item.id === dragCategoryId
    );
    const targetIndex = data.categories.findIndex(
      (item) => item.id === targetId
    );
    if (fromIndex === -1 || targetIndex === -1) {
      return;
    }
    let insertIndex =
      dragCategoryPosition === "after" ? targetIndex + 1 : targetIndex;
    if (fromIndex < insertIndex) {
      insertIndex -= 1;
    }
    const [moved] = data.categories.splice(fromIndex, 1);
    data.categories.splice(insertIndex, 0, moved);
    categorySort = { key: "manual", dir: "asc" };
    saveAdminData();
    renderAll();
  });
}

if (adminSubcategoryCategory) {
  adminSubcategoryCategory.addEventListener("change", renderAdmin);
}

if (adminSubsectionCategory) {
  adminSubsectionCategory.addEventListener("change", renderAdmin);
}

if (adminSubsectionSubcategory) {
  adminSubsectionSubcategory.addEventListener("change", renderAdmin);
}

if (adminSubcategoryForm && adminSubcategoryCategory) {
  adminSubcategoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(adminSubcategoryForm);
    const name = String(formData.get("name") || "").trim();
    if (!name) {
      return;
    }
    const category = data.categories.find(
      (item) => item.id === adminSubcategoryCategory.value
    );
    if (category) {
      category.subcategories.push(name);
      subcategorySort = { key: "manual", dir: "asc" };
      adminSubcategoryForm.reset();
      adminSubcategoryForm.classList.remove("is-open");
      saveAdminData();
      renderAll();
    }
  });
}

if (adminSubsectionForm && adminSubsectionCategory && adminSubsectionSubcategory) {
  adminSubsectionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(adminSubsectionForm);
    const name = String(formData.get("name") || "").trim();
    if (!name) {
      return;
    }
    const categoryId = adminSubsectionCategory.value;
    const subcategory = adminSubsectionSubcategory.value;
    ensureSubsection(categoryId, subcategory, name);
    subsectionSort = { key: "manual", dir: "asc" };
    adminSubsectionForm.reset();
    adminSubsectionForm.classList.remove("is-open");
    saveAdminData();
    renderAll();
  });
}

if (adminSubcategories && adminSubcategoryCategory) {
  let dragSubcategoryIndex = null;
  let dragTargetRow = null;
  let dragSubcategoryPosition = "after";
  adminSubcategories.addEventListener("input", (event) => {
    const row = event.target.closest("[data-subcategory-index]");
    if (!row) {
      return;
    }
    const category = data.categories.find(
      (item) => item.id === adminSubcategoryCategory.value
    );
    if (!category) {
      return;
    }
    const index = Number(row.dataset.subcategoryIndex);
    if (Number.isNaN(index)) {
      return;
    }
    if (event.target.matches("[data-subcategory-name]")) {
      category.subcategories[index] = event.target.value;
    }
  });

  adminSubcategories.addEventListener("change", (event) => {
    if (!event.target.matches("[data-subcategory-name]")) {
      return;
    }
    saveAdminData();
    renderAll();
  });

  adminSubcategories.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
      return;
    }
    if (!event.target.matches("[data-subcategory-name]")) {
      return;
    }
    event.preventDefault();
    event.target.blur();
  });

  adminSubcategories.addEventListener("click", (event) => {
    const sortButton = event.target.closest("[data-admin-subcategory-sort]");
    if (sortButton) {
      if (subcategorySort.key === "name") {
        subcategorySort.dir = subcategorySort.dir === "asc" ? "desc" : "asc";
      } else {
        subcategorySort = { key: "name", dir: "asc" };
      }
      renderAdmin();
      return;
    }
    const editButton = event.target.closest("[data-subcategory-edit]");
    const deleteButton = event.target.closest("[data-subcategory-delete]");
    const row = event.target.closest("[data-subcategory-index]");
    if (!row) {
      return;
    }
    const category = data.categories.find(
      (item) => item.id === adminSubcategoryCategory.value
    );
    if (!category) {
      return;
    }
    const index = Number(row.dataset.subcategoryIndex);
    if (editButton) {
      const input = row.querySelector("[data-subcategory-name]");
      const isEditing = row.classList.toggle("is-editing");
      if (input) {
        input.readOnly = !isEditing;
      }
      return;
    }
    if (deleteButton) {
      if (!window.confirm("Удалить категорию?")) {
        return;
      }
      category.subcategories.splice(index, 1);
      saveAdminData();
      renderAll();
    }
  });

  adminSubcategories.addEventListener("dragstart", (event) => {
    const handle = event.target.closest(".admin-drag-handle");
    if (!handle) {
      return;
    }
    const row = handle.closest("[data-subcategory-index]");
    if (!row) {
      return;
    }
    dragSubcategoryIndex = Number(row.dataset.subcategoryIndex);
    if (Number.isNaN(dragSubcategoryIndex)) {
      dragSubcategoryIndex = null;
      return;
    }
    row.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(dragSubcategoryIndex));
  });

  adminSubcategories.addEventListener("dragend", () => {
    adminSubcategories
      .querySelectorAll(".is-dragging, .is-drop-before, .is-drop-after")
      .forEach((row) =>
        row.classList.remove("is-dragging", "is-drop-before", "is-drop-after")
      );
    dragSubcategoryIndex = null;
    dragTargetRow = null;
    dragSubcategoryPosition = "after";
  });

  adminSubcategories.addEventListener("dragover", (event) => {
    if (dragSubcategoryIndex === null) {
      return;
    }
    event.preventDefault();
    let row = event.target.closest("[data-subcategory-index]");
    if (!row) {
      const rows = adminSubcategories.querySelectorAll(
        "[data-subcategory-index]"
      );
      if (!rows.length) {
        return;
      }
      const containerRect = adminSubcategories.getBoundingClientRect();
      const mouseY = event.clientY;
      if (mouseY < containerRect.top + 24) {
        row = rows[0];
        dragSubcategoryPosition = "before";
      } else if (mouseY > containerRect.bottom - 24) {
        row = rows[rows.length - 1];
        dragSubcategoryPosition = "after";
      } else {
        return;
      }
    } else {
      const rect = row.getBoundingClientRect();
      dragSubcategoryPosition =
        event.clientY < rect.top + rect.height / 2 ? "before" : "after";
    }
    if (dragTargetRow && dragTargetRow !== row) {
      dragTargetRow.classList.remove("is-drop-before", "is-drop-after");
    }
    dragTargetRow = row;
    row.classList.toggle("is-drop-before", dragSubcategoryPosition === "before");
    row.classList.toggle("is-drop-after", dragSubcategoryPosition === "after");
  });

  adminSubcategories.addEventListener("drop", (event) => {
    if (dragSubcategoryIndex === null) {
      return;
    }
    event.preventDefault();
    const row = dragTargetRow;
    if (!row) {
      return;
    }
    const targetIndex = Number(row.dataset.subcategoryIndex);
    if (Number.isNaN(targetIndex) || targetIndex === dragSubcategoryIndex) {
      return;
    }
    const category = data.categories.find(
      (item) => item.id === adminSubcategoryCategory.value
    );
    if (!category) {
      return;
    }
    const list = category.subcategories;
    if (
      dragSubcategoryIndex < 0 ||
      dragSubcategoryIndex >= list.length ||
      targetIndex < 0 ||
      targetIndex >= list.length
    ) {
      return;
    }
    let insertIndex =
      dragSubcategoryPosition === "after" ? targetIndex + 1 : targetIndex;
    if (dragSubcategoryIndex < insertIndex) {
      insertIndex -= 1;
    }
    const [moved] = list.splice(dragSubcategoryIndex, 1);
    list.splice(insertIndex, 0, moved);
    subcategorySort = { key: "manual", dir: "asc" };
    saveAdminData();
    renderAll();
  });
}

if (adminProductForm) {
  const adminProductSubcategory = adminProductForm.querySelector(
    "[data-admin-product-subcategory]"
  );
  const adminProductCategorySelect = adminProductForm.querySelector(
    "[data-admin-product-category]"
  );
  const adminProductSubsectionSelect = adminProductForm.querySelector(
    "[data-admin-product-subsection]"
  );
  const adminProductIdInput = adminProductForm.querySelector(
    "input[name='productId']"
  );
  const adminTitleInput = adminProductForm.querySelector("input[name='title']");
  const adminDescriptionInput = adminProductForm.querySelector(
    "textarea[name='description']"
  );
  const adminImageInput = adminProductForm.querySelector(
    "input[name='image']"
  );

  const addFeatureItem = (value) => {
    if (!adminProductFeatureList) {
      return;
    }
    const text = String(value || "").trim();
    if (!text) {
      return;
    }
    const item = document.createElement("div");
    item.className = "admin-checklist-item";
    item.dataset.featureItem = text;
    item.innerHTML = `
      <input type="checkbox" checked />
      <span>${text}</span>
      <button type="button" class="admin-tag-remove" aria-label="Удалить">×</button>
    `;
    item.querySelector("button")?.addEventListener("click", () => {
      item.remove();
    });
    adminProductFeatureList.appendChild(item);
  };

  if (adminProductFeatureAdd && adminProductFeatureInput) {
    adminProductFeatureAdd.addEventListener("click", () => {
      addFeatureItem(adminProductFeatureInput.value);
      adminProductFeatureInput.value = "";
      adminProductFeatureInput.focus();
    });
    adminProductFeatureInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addFeatureItem(adminProductFeatureInput.value);
        adminProductFeatureInput.value = "";
      }
    });
  }
  adminProductForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(adminProductForm);
    const productId = String(formData.get("productId") || "").trim();
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const image = String(formData.get("image") || "").trim();
    const image2 = String(formData.get("image2") || "").trim();
    const categoryId = String(formData.get("category") || "").trim();
    const subcategory = String(formData.get("subcategory") || "").trim();
    const subsection = String(formData.get("subsection") || "").trim();
    const characteristicsRaw = String(formData.get("characteristics") || "");
    const characteristics = characteristicsRaw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const tags = adminProductFeatureList
      ? Array.from(
          adminProductFeatureList.querySelectorAll("[data-feature-item]")
        ).map(
          (item) => item.dataset.featureItem || ""
        )
      : [];
    if (!title || !description || !categoryId || !subcategory) {
      return;
    }
    let id = productId;
    const existingIndex = productId
      ? data.products.findIndex((item) => item.id === productId)
      : -1;
    if (!id) {
      id = slugify(title);
      if (!id) {
        id = `product-${Date.now()}`;
      }
      if (data.products.some((item) => item.id === id)) {
        id = `${id}-${Date.now()}`;
      }
    }
    const existing = existingIndex >= 0 ? data.products[existingIndex] : null;
    const payload = {
      id,
      title,
      description,
      image: image || "assets/product-tracker.svg",
      image2: image2 || "",
      categoryId: categoryId || data.categories[0]?.id || "",
      subcategory,
      subsection,
      characteristics,
      tags,
      createdAt: existing?.createdAt ?? Date.now(),
      order: existing?.order ?? Date.now(),
    };
    if (existingIndex >= 0) {
      data.products[existingIndex] = payload;
    } else {
      data.products.push(payload);
    }
    ensureSubcategoryInCategory(categoryId, subcategory);
    ensureSubsection(categoryId, subcategory, subsection);
    currentSubcategory = subcategory;
    adminProductForm.reset();
    if (adminProductModal) {
      adminProductModal.classList.remove("is-open");
    }
    if (adminProductIdInput) {
      adminProductIdInput.value = "";
    }
    if (adminProductTitle) {
      adminProductTitle.textContent = "Новое решение";
    }
    if (adminProductFeatureList) {
      adminProductFeatureList.innerHTML = "";
    }
    saveAdminData();
    renderAll();
  });

  const imageFileInput = adminProductForm.querySelector(
    "input[name='imageFile']"
  );
  const imageInput = adminProductForm.querySelector("input[name='image']");
  const imageFileInput2 = adminProductForm.querySelector(
    "input[name='imageFile2']"
  );
  const imageInput2 = adminProductForm.querySelector("input[name='image2']");
  if (imageFileInput && imageInput) {
    imageFileInput.addEventListener("change", () => {
      const file = imageFileInput.files?.[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        imageInput.value = String(reader.result || "");
      };
      reader.readAsDataURL(file);
    });
  }
  if (imageFileInput2 && imageInput2) {
    imageFileInput2.addEventListener("change", () => {
      const file = imageFileInput2.files?.[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        imageInput2.value = String(reader.result || "");
      };
      reader.readAsDataURL(file);
    });
  }

  if (adminProductImageClear && imageInput) {
    adminProductImageClear.addEventListener("click", () => {
      imageInput.value = "";
      if (imageFileInput) {
        imageFileInput.value = "";
      }
    });
  }

  if (adminProductImage2Clear && imageInput2) {
    adminProductImage2Clear.addEventListener("click", () => {
      imageInput2.value = "";
      if (imageFileInput2) {
        imageFileInput2.value = "";
      }
    });
  }

  if (adminProductCategorySelect) {
    adminProductCategorySelect.addEventListener("change", () => {
      const nextValue = syncProductSubcategoryOptions(
        adminProductSubcategory,
        adminProductCategorySelect.value,
        ""
      );
      if (adminProductSubcategory) {
        adminProductSubcategory.value = nextValue;
      }
      if (adminProductSubsectionSelect) {
        const options = getSubsections(
          adminProductCategorySelect.value,
          adminProductSubcategory?.value
        );
        adminProductSubsectionSelect.innerHTML = `
          <option value="">Без подраздела</option>
          ${options.map((name) => `<option value="${name}">${name}</option>`).join("")}
        `;
      }
    });
  }
  if (adminProductSubcategory) {
    adminProductSubcategory.addEventListener("change", () => {
      if (adminProductSubsectionSelect && adminProductCategorySelect) {
        const options = getSubsections(
          adminProductCategorySelect.value,
          adminProductSubcategory.value
        );
        adminProductSubsectionSelect.innerHTML = `
          <option value="">Без подраздела</option>
          ${options.map((name) => `<option value="${name}">${name}</option>`).join("")}
        `;
      }
    });
  }
}

if (adminExportButton) {
  adminExportButton.addEventListener("click", () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      adminData: data,
      favorites,
      theme: localStorage.getItem(THEME_KEY) || "light",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "gdemoi-data.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  });
}

if (adminImportButton && adminImportInput) {
  adminImportButton.addEventListener("click", () => {
    adminImportInput.value = "";
    adminImportInput.click();
  });
}

if (adminImportInput) {
  adminImportInput.addEventListener("change", () => {
    const file = adminImportInput.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        if (!parsed || !parsed.adminData) {
          window.alert("Файл импорта не содержит данных.");
          return;
        }
        data = parsed.adminData;
        saveAdminData();
        favorites = Array.isArray(parsed.favorites) ? parsed.favorites : [];
        saveFavorites();
        const theme = parsed.theme || "light";
        localStorage.setItem(THEME_KEY, theme);
        applyTheme(theme);
        removeInvalidProducts();
        ensureFavoritesValid();
        currentCategoryId = data.categories[0]?.id || "";
        currentSubcategory = "";
        renderAll();
        window.alert("Данные успешно импортированы.");
      } catch (error) {
        window.alert("Не удалось импортировать файл.");
      }
    };
    reader.readAsText(file);
  });
}

if (adminProducts) {
  let dragProductId = null;
  let dragProductTarget = null;
  let dragProductPosition = "after";
  adminProducts.addEventListener("click", (event) => {
    const sortButton = event.target.closest("[data-admin-sort]");
    if (!sortButton) {
      return;
    }
    const nextKey = sortButton.dataset.adminSort;
    if (!nextKey) {
      return;
    }
    if (productSort.key === nextKey) {
      productSort.dir = productSort.dir === "asc" ? "desc" : "asc";
    } else {
      productSort = { key: nextKey, dir: "asc" };
    }
    renderAdmin();
  });

  adminProducts.addEventListener("dragstart", (event) => {
    const handle = event.target.closest(".admin-drag-handle");
    if (!handle) {
      return;
    }
    const row = handle.closest("[data-product-id]");
    if (!row) {
      return;
    }
    dragProductId = row.dataset.productId || null;
    if (!dragProductId) {
      return;
    }
    row.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", dragProductId);
  });

  adminProducts.addEventListener("dragend", () => {
    adminProducts
      .querySelectorAll(".is-dragging, .is-drop-before, .is-drop-after")
      .forEach((row) =>
        row.classList.remove("is-dragging", "is-drop-before", "is-drop-after")
      );
    dragProductId = null;
    dragProductTarget = null;
    dragProductPosition = "after";
  });

  adminProducts.addEventListener("dragover", (event) => {
    if (!dragProductId) {
      return;
    }
    event.preventDefault();
    const row = event.target.closest("[data-product-id]");
    if (!row) {
      return;
    }
    const rect = row.getBoundingClientRect();
    dragProductPosition =
      event.clientY < rect.top + rect.height / 2 ? "before" : "after";
    if (dragProductTarget && dragProductTarget !== row) {
      dragProductTarget.classList.remove("is-drop-before", "is-drop-after");
    }
    dragProductTarget = row;
    row.classList.toggle("is-drop-before", dragProductPosition === "before");
    row.classList.toggle("is-drop-after", dragProductPosition === "after");
  });

  adminProducts.addEventListener("drop", (event) => {
    if (!dragProductId || !dragProductTarget) {
      return;
    }
    event.preventDefault();
    const source = data.products.find((item) => item.id === dragProductId);
    const target = data.products.find(
      (item) => item.id === dragProductTarget.dataset.productId
    );
    if (!source || !target) {
      return;
    }
    if (
      source.categoryId !== target.categoryId ||
      source.subcategory !== target.subcategory
    ) {
      return;
    }
    const group = data.products.filter(
      (item) =>
        item.categoryId === source.categoryId &&
        item.subcategory === source.subcategory
    );
    group.sort((a, b) => (a.order || 0) - (b.order || 0));
    const fromIndex = group.findIndex((item) => item.id === source.id);
    const targetIndex = group.findIndex((item) => item.id === target.id);
    if (fromIndex === -1 || targetIndex === -1) {
      return;
    }
    const [moved] = group.splice(fromIndex, 1);
    const insertIndex =
      dragProductPosition === "after" ? targetIndex + 1 : targetIndex;
    group.splice(insertIndex > fromIndex ? insertIndex - 1 : insertIndex, 0, moved);
    group.forEach((item, index) => {
      item.order = index + 1;
    });
    saveAdminData();
    renderAll();
  });

  adminProducts.addEventListener("input", (event) => {
    const row = event.target.closest("[data-product-id]");
    if (!row) {
      return;
    }
    const product = data.products.find((item) => item.id === row.dataset.productId);
    if (!product) {
      return;
    }
    const subcategorySelect = row.querySelector("[data-product-subcategory]");
    if (event.target.matches("[data-product-title]")) {
      product.title = event.target.value;
    }
    if (event.target.matches("[data-product-description]")) {
      product.description = event.target.value;
    }
    if (event.target.matches("[data-product-image]")) {
      product.image = event.target.value;
    }
    if (event.target.matches("[data-product-category]")) {
      product.categoryId = event.target.value;
      if (product.subcategory) {
        ensureSubcategoryInCategory(product.categoryId, product.subcategory);
      }
      if (subcategorySelect) {
        const category = data.categories.find(
          (item) => item.id === product.categoryId
        );
        const options = (category?.subcategories || [])
          .map((name) => `<option value="${name}">${name}</option>`)
          .join("");
        subcategorySelect.innerHTML = options;
        if (category?.subcategories?.length) {
          product.subcategory = category.subcategories[0];
          subcategorySelect.value = product.subcategory;
        } else {
          product.subcategory = "";
        }
      }
    }
    if (event.target.matches("[data-product-subcategory]")) {
      product.subcategory = event.target.value;
      ensureSubcategoryInCategory(product.categoryId, product.subcategory);
    }
    if (event.target.matches("[data-product-subsection]")) {
      product.subsection = event.target.value;
    }
    saveAdminData();
  });

  adminProducts.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-product-edit]");
    const copyButton = event.target.closest("[data-product-copy]");
    const deleteButton = event.target.closest("[data-product-delete]");
    const row = event.target.closest("[data-product-id]");
    if (!row) {
      return;
    }
    const index = data.products.findIndex(
      (item) => item.id === row.dataset.productId
    );
    const product = data.products[index];
    if (!product) {
      return;
    }
    if (editButton && adminProductModal && adminProductForm) {
      adminProductModal.classList.add("is-open");
      const form = adminProductForm;
      const idInput = form.querySelector("input[name='productId']");
      const titleInput = form.querySelector("input[name='title']");
      const descriptionInput = form.querySelector("textarea[name='description']");
      const categorySelect = form.querySelector("[data-admin-product-category]");
      const subcategorySelect = form.querySelector(
        "[data-admin-product-subcategory]"
      );
      const imageInput = form.querySelector("input[name='image']");
      const imageInput2 = form.querySelector("input[name='image2']");
      const characteristicsInput = form.querySelector(
        "textarea[name='characteristics']"
      );
      if (idInput) idInput.value = product.id;
      if (titleInput) titleInput.value = product.title;
      if (descriptionInput) descriptionInput.value = product.description;
      if (imageInput) imageInput.value = product.image || "";
      if (imageInput2) imageInput2.value = product.image2 || "";
      if (characteristicsInput) {
        characteristicsInput.value = (product.characteristics || []).join("\n");
      }
      if (adminProductTitle) {
        adminProductTitle.textContent = product.title;
      }
      if (categorySelect) {
        categorySelect.value = product.categoryId;
        const nextSub = syncProductSubcategoryOptions(
          subcategorySelect,
          product.categoryId,
          product.subcategory || ""
        );
        if (subcategorySelect) {
          subcategorySelect.value = nextSub;
        }
      }
      const subsectionSelect = form.querySelector(
        "[data-admin-product-subsection]"
      );
      if (subsectionSelect && categorySelect && subcategorySelect) {
        const options = getSubsections(
          categorySelect.value,
          subcategorySelect.value
        );
        subsectionSelect.innerHTML = `
          <option value="">Без подраздела</option>
          ${options.map((name) => `<option value="${name}">${name}</option>`).join("")}
        `;
        subsectionSelect.value = product.subsection || "";
      }
      if (adminProductFeatureList) {
        adminProductFeatureList.innerHTML = "";
        const tags = product.tags || product.features || [];
        tags.forEach((tag) => {
          const text = String(tag || "").trim();
          if (!text) {
            return;
          }
          const item = document.createElement("div");
          item.className = "admin-checklist-item";
          item.dataset.featureItem = text;
          item.innerHTML = `
            <input type="checkbox" checked />
            <span>${text}</span>
            <button type="button" class="admin-tag-remove" aria-label="Удалить">×</button>
          `;
          item.querySelector("button")?.addEventListener("click", () => {
            item.remove();
          });
          adminProductFeatureList.appendChild(item);
        });
      }
      return;
    }
    if (copyButton) {
      if (!window.confirm("Скопировать товар?")) {
        return;
      }
      const copyTitle = `${product.title} (копия)`;
      let id = slugify(copyTitle);
      if (!id) {
        id = `product-${Date.now()}`;
      }
      if (data.products.some((item) => item.id === id)) {
        id = `${id}-${Date.now()}`;
      }
      const copy = {
        ...product,
        id,
        title: copyTitle,
        createdAt: Date.now(),
      };
      data.products.splice(index + 1, 0, copy);
      saveAdminData();
      renderAll();
      return;
    }
    if (deleteButton) {
      if (!window.confirm("Удалить товар?")) {
        return;
      }
      data.products = data.products.filter(
        (item) => item.id !== row.dataset.productId
      );
      favorites = favorites.filter((id) => id !== row.dataset.productId);
      saveAdminData();
      renderAll();
    }
  });

  adminProductForm.addEventListener("click", (event) => {
    const linkButton = event.target.closest("[data-text-link]");
    if (!linkButton) {
      return;
    }
    const field = linkButton.dataset.textLink;
    const textarea = adminProductForm.querySelector(
      `textarea[name='${field}']`
    );
    if (!textarea) {
      return;
    }
    const value = textarea.value;
    const selectionStart = textarea.selectionStart ?? 0;
    const selectionEnd = textarea.selectionEnd ?? 0;
    if (selectionStart === selectionEnd) {
      return;
    }
    const selectedText = value.slice(selectionStart, selectionEnd);
    const before = value.lastIndexOf("[", selectionStart);
    const middle = value.indexOf("](", selectionStart);
    const after = value.indexOf(")", selectionStart);
    const hasLink =
      before !== -1 &&
      middle !== -1 &&
      after !== -1 &&
      before < selectionStart &&
      middle < after;
    let currentUrl = "";
    let linkText = selectedText;
    let linkStart = selectionStart;
    let linkEnd = selectionEnd;
    if (hasLink && selectionEnd <= middle) {
      linkText = value.slice(before + 1, middle);
      currentUrl = value.slice(middle + 2, after);
      linkStart = before;
      linkEnd = after + 1;
    }
    const nextUrl = window.prompt("Введите ссылку", currentUrl);
    if (nextUrl === null) {
      return;
    }
    let nextValue = value;
    const normalizedUrl = normalizeUrl(nextUrl);
    if (!nextUrl) {
      if (hasLink && selectionEnd <= middle) {
        nextValue =
          value.slice(0, linkStart) + linkText + value.slice(linkEnd);
        textarea.value = nextValue;
      }
      return;
    }
    if (hasLink && selectionEnd <= middle) {
      nextValue =
        value.slice(0, linkStart) +
        `[${linkText}](${normalizedUrl})` +
        value.slice(linkEnd);
    } else {
      nextValue =
        value.slice(0, selectionStart) +
        `[${linkText}](${normalizedUrl})` +
        value.slice(selectionEnd);
    }
    textarea.value = nextValue;
  });
}

if (adminSubsections) {
  let dragSubsectionId = null;
  let dragSubsectionTarget = null;
  let dragSubsectionPosition = "after";
  adminSubsections.addEventListener("click", (event) => {
    const sortButton = event.target.closest("[data-admin-subsection-sort]");
    if (sortButton) {
      subsectionSort =
        subsectionSort.key === "name"
          ? { key: "name", dir: subsectionSort.dir === "asc" ? "desc" : "asc" }
          : { key: "name", dir: "asc" };
      renderAdmin();
      return;
    }
    const editButton = event.target.closest("[data-subsection-edit]");
    const deleteButton = event.target.closest("[data-subsection-delete]");
    const row = event.target.closest("[data-subsection-id]");
    if (!row) {
      return;
    }
    const subsection = data.subsections.find(
      (item) => item.id === row.dataset.subsectionId
    );
    if (!subsection) {
      return;
    }
    if (editButton) {
      const input = row.querySelector("[data-subsection-name]");
      const isEditing = row.classList.toggle("is-editing");
      if (input) {
        input.readOnly = !isEditing;
      }
      return;
    }
    if (deleteButton) {
      if (!window.confirm("Удалить подраздел?")) {
        return;
      }
      data.subsections = data.subsections.filter(
        (item) => item.id !== subsection.id
      );
      data.products.forEach((product) => {
        if (
          product.categoryId === subsection.categoryId &&
          product.subcategory === subsection.subcategory &&
          product.subsection === subsection.name
        ) {
          product.subsection = "";
        }
      });
      saveAdminData();
      renderAll();
    }
  });

  adminSubsections.addEventListener("input", (event) => {
    const row = event.target.closest("[data-subsection-id]");
    if (!row) {
      return;
    }
    const subsection = data.subsections.find(
      (item) => item.id === row.dataset.subsectionId
    );
    if (!subsection) {
      return;
    }
    if (event.target.matches("[data-subsection-name]")) {
      const nextName = event.target.value;
      data.products.forEach((product) => {
        if (
          product.categoryId === subsection.categoryId &&
          product.subcategory === subsection.subcategory &&
          product.subsection === subsection.name
        ) {
          product.subsection = nextName;
        }
      });
      subsection.name = nextName;
      saveAdminData();
    }
  });

  adminSubsections.addEventListener("dragstart", (event) => {
    const handle = event.target.closest(".admin-drag-handle");
    if (!handle) {
      return;
    }
    const row = handle.closest("[data-subsection-id]");
    if (!row) {
      return;
    }
    dragSubsectionId = row.dataset.subsectionId || null;
    if (!dragSubsectionId) {
      return;
    }
    row.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", dragSubsectionId);
  });

  adminSubsections.addEventListener("dragend", () => {
    adminSubsections
      .querySelectorAll(".is-dragging, .is-drop-before, .is-drop-after")
      .forEach((row) =>
        row.classList.remove("is-dragging", "is-drop-before", "is-drop-after")
      );
    dragSubsectionId = null;
    dragSubsectionTarget = null;
    dragSubsectionPosition = "after";
  });

  adminSubsections.addEventListener("dragover", (event) => {
    if (!dragSubsectionId) {
      return;
    }
    event.preventDefault();
    const row = event.target.closest("[data-subsection-id]");
    if (!row) {
      return;
    }
    const rect = row.getBoundingClientRect();
    dragSubsectionPosition =
      event.clientY < rect.top + rect.height / 2 ? "before" : "after";
    if (dragSubsectionTarget && dragSubsectionTarget !== row) {
      dragSubsectionTarget.classList.remove("is-drop-before", "is-drop-after");
    }
    dragSubsectionTarget = row;
    row.classList.toggle("is-drop-before", dragSubsectionPosition === "before");
    row.classList.toggle("is-drop-after", dragSubsectionPosition === "after");
  });

  adminSubsections.addEventListener("drop", (event) => {
    if (!dragSubsectionId || !dragSubsectionTarget) {
      return;
    }
    event.preventDefault();
    const source = data.subsections.find(
      (item) => item.id === dragSubsectionId
    );
    const target = data.subsections.find(
      (item) => item.id === dragSubsectionTarget.dataset.subsectionId
    );
    if (!source || !target) {
      return;
    }
    if (
      source.categoryId !== target.categoryId ||
      source.subcategory !== target.subcategory
    ) {
      return;
    }
    const group = data.subsections
      .filter(
        (item) =>
          item.categoryId === source.categoryId &&
          item.subcategory === source.subcategory
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    const fromIndex = group.findIndex((item) => item.id === source.id);
    const targetIndex = group.findIndex((item) => item.id === target.id);
    if (fromIndex === -1 || targetIndex === -1) {
      return;
    }
    const [moved] = group.splice(fromIndex, 1);
    const insertIndex =
      dragSubsectionPosition === "after" ? targetIndex + 1 : targetIndex;
    group.splice(insertIndex > fromIndex ? insertIndex - 1 : insertIndex, 0, moved);
    group.forEach((item, index) => {
      item.order = index + 1;
    });
    subsectionSort = { key: "manual", dir: "asc" };
    saveAdminData();
    renderAll();
  });
}

if (adminCategorySearch) {
  adminCategorySearch.addEventListener("input", () => {
    renderAdmin();
  });
}

if (adminCategoryAdd && adminCategoryForm) {
  adminCategoryAdd.addEventListener("click", () => {
    adminCategoryForm.classList.toggle("is-open");
  });
}

if (adminSubcategorySearch) {
  adminSubcategorySearch.addEventListener("input", () => {
    renderAdmin();
  });
}

if (adminSubcategoryAdd && adminSubcategoryForm) {
  adminSubcategoryAdd.addEventListener("click", () => {
    adminSubcategoryForm.classList.toggle("is-open");
  });
}

if (adminSubsectionSearch) {
  adminSubsectionSearch.addEventListener("input", () => {
    renderAdmin();
  });
}

if (adminSubsectionAdd && adminSubsectionForm) {
  adminSubsectionAdd.addEventListener("click", () => {
    adminSubsectionForm.classList.toggle("is-open");
  });
}

if (adminProductSearch) {
  adminProductSearch.addEventListener("input", () => {
    renderAdmin();
  });
}

if (adminProductGroup) {
  adminProductGroup.addEventListener("change", () => {
    renderAdmin();
  });
}

if (adminProductAdd && adminProductForm && adminProductModal) {
  adminProductAdd.addEventListener("click", () => {
    adminProductModal.classList.add("is-open");
    if (adminProductFeatureList) {
      adminProductFeatureList.innerHTML = "";
    }
    if (adminProductTitle) {
      adminProductTitle.textContent = "Новое решение";
    }
    const idInput = adminProductForm.querySelector("input[name='productId']");
    if (idInput) {
      idInput.value = "";
    }
    const categorySelect = adminProductForm.querySelector(
      "[data-admin-product-category]"
    );
    const subcategorySelect = adminProductForm.querySelector(
      "[data-admin-product-subcategory]"
    );
    if (categorySelect) {
      if (!categorySelect.value && data.categories[0]) {
        categorySelect.value = data.categories[0].id;
      }
      syncProductSubcategoryOptions(
        subcategorySelect,
        categorySelect.value,
        ""
      );
    }
  });
}

if (adminProductCancel && adminProductModal && adminProductForm) {
  adminProductCancel.addEventListener("click", () => {
    adminProductModal.classList.remove("is-open");
    adminProductForm.reset();
    adminProductFeatureList?.replaceChildren();
    adminProductCharacteristics && (adminProductCharacteristics.value = "");
    const idInput = adminProductForm.querySelector("input[name='productId']");
    if (idInput) {
      idInput.value = "";
    }
    if (adminProductTitle) {
      adminProductTitle.textContent = "Новое решение";
    }
  });
}

if (adminProductModal) {
  adminProductModal.addEventListener("click", (event) => {
    if (event.target === adminProductModal) {
      adminProductModal.classList.remove("is-open");
      adminProductForm?.reset();
      adminProductFeatureList?.replaceChildren();
      const idInput = adminProductForm?.querySelector("input[name='productId']");
      if (idInput) {
        idInput.value = "";
      }
      if (adminProductTitle) {
        adminProductTitle.textContent = "Новое решение";
      }
    }
  });
}

renderAll();
