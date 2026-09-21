// SenangWebs Buy Library
//
// Icons below (shopping-cart, plus, minus, x-mark) are inlined from
// @bookklik/senangstart-icons (Heroicons-style, MIT) so the bundle only
// ships the four icons actually used instead of the full 90KB+ set.

require("../css/swb.css");

const ICONS = {
  "shopping-cart":
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/></svg>',
  plus:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>',
  minus:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14"/></svg>',
  "x-mark":
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>',
};

const CURRENCIES = {
  USD: { locale: "en-US", digits: 2 },
  EUR: { locale: "de-DE", digits: 2 },
  GBP: { locale: "en-GB", digits: 2 },
  JPY: { locale: "ja-JP", digits: 0 },
  CNY: { locale: "zh-CN", digits: 2 },
  MYR: { locale: "ms-MY", digits: 2 },
  SGD: { locale: "en-SG", digits: 2 },
  AUD: { locale: "en-AU", digits: 2 },
  CAD: { locale: "en-CA", digits: 2 },
  INR: { locale: "en-IN", digits: 2 },
  KRW: { locale: "ko-KR", digits: 0 },
  THB: { locale: "th-TH", digits: 2 },
  PHP: { locale: "en-PH", digits: 2 },
  IDR: { locale: "id-ID", digits: 2 },
  VND: { locale: "vi-VN", digits: 0 },
};

const SEARCH_DEBOUNCE_MS = 200;

function safeNumber(value, fallback) {
  if (fallback === undefined) fallback = 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function isValidHex(hex) {
  return typeof hex === "string" && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex.trim());
}

function expandHex(hex) {
  hex = hex.trim().slice(1);
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return hex;
}

function isSafeUrl(url) {
  if (typeof url !== "string" || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim(), window.location.href);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (e) {
    return false;
  }
}

function sanitizeWhatsapp(number) {
  return String(number || "").replace(/[^0-9]/g, "");
}

function escapeSelector(value) {
  if (typeof window !== "undefined" && window.CSS && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return String(value).replace(/["\\\]]/g, "\\$&");
}

function sanitizeIdPart(value) {
  return String(value).replace(/[^\w-]/g, "-");
}

function createIconElement(iconName) {
  const span = document.createElement("span");
  span.classList.add("swb-icon");
  span.innerHTML = ICONS[iconName];
  return span;
}

class SWB {
  constructor() {
    this.stores = new Map();
    this.defaultColors = {
      primary: "#007bff",
      secondary: "#dc3545",
    };
    this.defaultCurrency = "USD";
    this.activeModal = null;
    this.lastFocused = null;
    this._listenersBound = false;

    if (typeof window !== "undefined" && typeof document !== "undefined") {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => this.init());
      } else {
        this.init();
      }
    }
  }

  init() {
    this.setupEventListeners();
    this.initializeCatalogs();
    this.initializeIndependentButtons();
  }

  refresh() {
    this.initializeCatalogs();
    this.initializeIndependentButtons();
  }

  initializeStore(storeId, storeData = {}) {
    let store = this.stores.get(storeId);

    if (!store) {
      store = {
        cart: this.loadCartFromStorage(storeId),
        info: {},
        colors: { primary: this.defaultColors.primary, secondary: this.defaultColors.secondary },
        products: [],
        filteredProducts: [],
        sortState: { field: "name", direction: "asc" },
        searchQuery: "",
        _formatters: {},
      };
      this.stores.set(storeId, store);
    }

    const info = store.info;
    if (storeData.name) info.name = storeData.name;
    if (storeData.whatsapp !== undefined) info.whatsapp = sanitizeWhatsapp(storeData.whatsapp);
    if (storeData.cartEnabled !== undefined) info.cartEnabled = storeData.cartEnabled !== false;
    if (storeData.floatingCart !== undefined) info.floatingCart = storeData.floatingCart;
    if (storeData.checkoutTitle) info.checkoutTitle = storeData.checkoutTitle;
    if (storeData.billingTitle) info.billingTitle = storeData.billingTitle;
    if (storeData.submitButtonText) info.submitButtonText = storeData.submitButtonText;
    if (storeData.enableBilling !== undefined) info.enableBilling = storeData.enableBilling !== false;
    if (storeData.customFields !== undefined) info.customFields = storeData.customFields;
    if (storeData.currency && CURRENCIES[String(storeData.currency).toUpperCase()]) {
      info.currency = String(storeData.currency).toUpperCase();
    } else if (!info.currency) {
      info.currency = this.defaultCurrency;
    }
    if (storeData.colors) {
      if (storeData.colors.primary) info.primaryColor = storeData.colors.primary;
      if (storeData.colors.secondary) info.secondaryColor = storeData.colors.secondary;
    }
    if (info.primaryColor) store.colors.primary = info.primaryColor;
    if (info.secondaryColor) store.colors.secondary = info.secondaryColor;

    this.applyStoreTheme(storeId);
    return store;
  }

  applyStoreTheme(storeId) {
    const store = this.stores.get(storeId);
    if (!store || typeof document === "undefined") return;

    const selector = `[data-swb-store-id="${escapeSelector(storeId)}"]`;
    const elements = Array.from(document.querySelectorAll(selector));

    const modal = document.querySelector(`.swb-cart-modal[data-swb-store-id="${escapeSelector(storeId)}"]`);
    if (modal) elements.push(modal);

    const primaryRGB = this.hexToRGB(store.colors.primary);
    const secondaryRGB = this.hexToRGB(store.colors.secondary);

    elements.forEach((element) => {
      element.style.setProperty("--swb-color-primary", store.colors.primary);
      element.style.setProperty("--swb-color-secondary", store.colors.secondary);
      element.style.setProperty("--swb-color-primary-rgb", primaryRGB);
      element.style.setProperty("--swb-color-secondary-rgb", secondaryRGB);
    });
  }

  hexToRGB(hex) {
    if (!isValidHex(hex)) return "0, 123, 255";
    const full = expandHex(hex);
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }

  loadCartFromStorage(storeId) {
    const storageKey = `swb-cart-${storeId}`;
    let savedCart = null;
    try {
      savedCart = localStorage.getItem(storageKey);
    } catch (e) {
      return [];
    }
    if (!savedCart) return [];

    try {
      const parsed = JSON.parse(savedCart);
      if (!Array.isArray(parsed)) throw new Error("Cart is not an array");
      return parsed
        .filter((item) => item && typeof item === "object" && item.sku != null)
        .map((item) => ({
          sku: String(item.sku),
          name: String(item.name != null ? item.name : item.sku),
          price: safeNumber(item.price),
          quantity: Math.max(1, Math.round(safeNumber(item.quantity, 1))),
        }));
    } catch (e) {
      try {
        localStorage.removeItem(storageKey);
      } catch (ignored) {
        // storage unavailable
      }
      return [];
    }
  }

  saveCartToStorage(storeId, cart) {
    try {
      localStorage.setItem(`swb-cart-${storeId}`, JSON.stringify(cart));
    } catch (e) {
      // Storage may be unavailable (private mode / quota); cart still works in memory.
    }
  }

  clearCart(storeId) {
    const store = this.stores.get(storeId);
    if (!store) return;

    store.cart = [];
    this.saveCartToStorage(storeId, store.cart);
    this.updateCartCount(storeId);
    this.renderCart(storeId);
    this.closeCheckout(storeId);
  }

  // ---- Currency & pricing -------------------------------------------------

  setCurrency(code) {
    const normalized = typeof code === "string" ? code.toUpperCase() : "";
    if (!CURRENCIES[normalized]) return;
    this.defaultCurrency = normalized;
    this.stores.forEach((store) => {
      store.info.currency = normalized;
    });
  }

  getFormatter(store) {
    const code = (store && store.info.currency) || this.defaultCurrency;
    const config = CURRENCIES[code] || CURRENCIES.USD;
    if (!store._formatters[code]) {
      try {
        store._formatters[code] = new Intl.NumberFormat(config.locale, {
          style: "currency",
          currency: code,
          minimumFractionDigits: config.digits,
          maximumFractionDigits: config.digits,
        });
      } catch (e) {
        store._formatters[code] = null;
      }
    }
    return store._formatters[code];
  }

  formatPrice(amount, storeId) {
    const store = storeId != null ? this.stores.get(storeId) : null;
    const value = safeNumber(amount);
    const formatter = store ? this.getFormatter(store) : null;
    if (formatter) return formatter.format(value);

    const code = store && store.info.currency ? store.info.currency : this.defaultCurrency;
    const digits = (CURRENCIES[code] || CURRENCIES.USD).digits;
    return value.toFixed(digits);
  }

  calculateCartTotal(cart) {
    return (cart || []).reduce((sum, item) => {
      const price = safeNumber(item && item.price);
      const quantity = safeNumber(item && item.quantity, 1);
      return sum + price * quantity;
    }, 0);
  }

  // ---- Catalog initialization --------------------------------------------

  initializeCatalogs() {
    const catalogElements = document.querySelectorAll("[data-swb-catalog]");
    catalogElements.forEach((catalog) => {
      if (catalog.dataset.swbInitialized) return;
      const storeId = catalog.getAttribute("data-swb-store-id");
      if (!storeId) return;

      let customFields = [];
      const customFieldsAttr = catalog.getAttribute("data-swb-custom-fields");
      if (customFieldsAttr) {
        try {
          const parsed = JSON.parse(customFieldsAttr);
          if (Array.isArray(parsed)) customFields = parsed;
        } catch (e) {
          console.warn("SWB: invalid data-swb-custom-fields format", e);
        }
      }

      this.initializeStore(storeId, {
        name: catalog.getAttribute("data-swb-store"),
        whatsapp: catalog.getAttribute("data-swb-whatsapp"),
        floatingCart: catalog.hasAttribute("data-swb-cart-floating")
          ? catalog.getAttribute("data-swb-cart-floating")
          : false,
        cartEnabled: catalog.getAttribute("data-swb-cart") !== "false",
        checkoutTitle: catalog.getAttribute("data-swb-checkout-title"),
        billingTitle: catalog.getAttribute("data-swb-billing-title"),
        submitButtonText: catalog.getAttribute("data-swb-submit-text"),
        enableBilling: catalog.getAttribute("data-swb-enable-billing") !== "false",
        customFields: customFields,
        colors: {
          primary: catalog.getAttribute("data-swb-color-primary"),
          secondary: catalog.getAttribute("data-swb-color-secondary"),
        },
        currency: catalog.getAttribute("data-swb-currency"),
      });

      this.createCatalogHeader(catalog, storeId);
      this.initializeCatalogProducts(catalog, storeId);
      catalog.dataset.swbInitialized = "true";
    });
  }

  initializeIndependentButtons() {
    document.querySelectorAll("[data-swb-cart][data-swb-store-id]").forEach((button) => {
      if (button.hasAttribute("data-swb-catalog") || button.dataset.swbBound) return;
      button.dataset.swbBound = "true";
      const storeId = button.getAttribute("data-swb-store-id");

      this.initializeStore(storeId, {
        name: button.getAttribute("data-swb-store"),
        whatsapp: button.getAttribute("data-swb-whatsapp"),
        cartEnabled: true,
        floatingCart: false,
        colors: {
          primary: button.getAttribute("data-swb-color-primary"),
          secondary: button.getAttribute("data-swb-color-secondary"),
        },
        currency: button.getAttribute("data-swb-currency"),
      });

      button.addEventListener("click", () => {
        this.showCheckout(storeId);
      });

      if (button.querySelector("[data-swb-cart-count]")) {
        this.updateCartCount(storeId);
      }
    });

    document.querySelectorAll("[data-swb-product-sku][data-swb-store-id]").forEach((button) => {
      if (button.hasAttribute("data-swb-catalog") || button.dataset.swbBound) return;
      const storeId = button.getAttribute("data-swb-store-id");
      const sku = button.getAttribute("data-swb-product-sku");

      if (!this.stores.has(storeId)) {
        console.warn(
          `SWB: store "${storeId}" not initialized. Add a cart button with store information.`
        );
        return;
      }
      button.dataset.swbBound = "true";

      button.addEventListener("click", () => {
        const product = {
          sku: sku,
          name: button.getAttribute("data-swb-product-name") || sku,
          price: safeNumber(button.getAttribute("data-swb-product-price")),
          quantity: 1,
        };
        this.addToCart(storeId, product);
      });
    });
  }

  createCatalogHeader(catalog, storeId) {
    const store = this.stores.get(storeId);
    if (!store) return;

    const header = document.createElement("div");
    header.classList.add("swb-catalog-header");

    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.placeholder = "Search products...";
    searchBox.classList.add("swb-search-input");
    searchBox.setAttribute("aria-label", "Search products");
    let debounceTimer;
    searchBox.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      const value = e.target.value;
      debounceTimer = setTimeout(() => this.handleSearch(value, storeId), SEARCH_DEBOUNCE_MS);
    });

    const sortSelect = document.createElement("select");
    sortSelect.classList.add("swb-sort-select");
    sortSelect.setAttribute("aria-label", "Sort products");
    [
      ["name-asc", "Name (A to Z)"],
      ["name-desc", "Name (Z to A)"],
      ["price-asc", "Price (Low to High)"],
      ["price-desc", "Price (High to Low)"],
    ].forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      sortSelect.appendChild(option);
    });
    sortSelect.addEventListener("change", (e) => {
      const [field, direction] = e.target.value.split("-");
      this.handleSort(field, direction, storeId);
    });

    const headerControl = document.createElement("div");
    headerControl.classList.add("swb-catalog-header-control");
    headerControl.appendChild(sortSelect);

    if (store.info.cartEnabled) {
      const count = store.cart.reduce(
        (total, item) => total + safeNumber(item.quantity, 1),
        0
      );
      const cartBtn = document.createElement("button");
      cartBtn.type = "button";
      cartBtn.classList.add("swb-cart-button");
      if (store.info.floatingCart === "true") {
        cartBtn.classList.add("swb-cart-button-floating");
      }
      cartBtn.setAttribute("aria-label", "Open cart");
      cartBtn.appendChild(createIconElement("shopping-cart"));
      const countSpan = document.createElement("span");
      countSpan.classList.add("swb-cart-count");
      countSpan.setAttribute("data-swb-cart-count", "");
      countSpan.textContent = count;
      cartBtn.appendChild(countSpan);
      cartBtn.addEventListener("click", () => this.showCheckout(storeId));
      headerControl.appendChild(cartBtn);
    }

    header.appendChild(searchBox);
    header.appendChild(headerControl);
    catalog.insertBefore(header, catalog.firstChild);
  }

  initializeCatalogProducts(catalog, storeId) {
    const store = this.stores.get(storeId);
    if (!store) return;

    const productElements = catalog.querySelectorAll("[data-swb-product]");
    store.products = Array.from(productElements).map((elem) => ({
      element: elem,
      sku: elem.getAttribute("data-swb-product-sku") || "",
      name: elem.getAttribute("data-swb-product-name") || "",
      price: safeNumber(elem.getAttribute("data-swb-product-price")),
    }));
    store.filteredProducts = [...store.products];

    store.products.forEach((product) => {
      this.initializeProduct(product.element, storeId);
    });
  }

  initializeProduct(productElement, storeId) {
    const buttonsContainer = productElement.querySelector("[data-swb-product-buttons]");
    if (!buttonsContainer) return;

    const externalLink = productElement.getAttribute("data-swb-product-link");
    const externalLinkTitle = productElement.getAttribute("data-swb-product-link-title");
    if (isSafeUrl(externalLink) && externalLinkTitle) {
      const linkBtn = document.createElement("a");
      linkBtn.href = externalLink.trim();
      linkBtn.target = "_blank";
      linkBtn.rel = "noopener noreferrer";
      linkBtn.classList.add("swb-external-link");
      const span = document.createElement("span");
      span.textContent = externalLinkTitle;
      linkBtn.appendChild(span);
      buttonsContainer.appendChild(linkBtn);
    }

    const store = this.stores.get(storeId);
    if (store && store.info.cartEnabled) {
      const cartBtnTitle = productElement.getAttribute("data-swb-product-add-cart-title");
      const addToCartBtn = document.createElement("button");
      addToCartBtn.type = "button";
      addToCartBtn.textContent = cartBtnTitle || "Add to Cart";
      addToCartBtn.classList.add("swb-add-to-cart");
      addToCartBtn.onclick = () => {
        const product = {
          sku: productElement.getAttribute("data-swb-product-sku") || "",
          name: productElement.getAttribute("data-swb-product-name") || "",
          price: safeNumber(productElement.getAttribute("data-swb-product-price")),
          quantity: 1,
        };
        this.addToCart(storeId, product);
      };
      buttonsContainer.appendChild(addToCartBtn);
    }
  }

  // ---- Search & sort ------------------------------------------------------

  handleSearch(query, storeId) {
    const store = this.stores.get(storeId);
    if (!store) return;

    store.searchQuery = String(query || "").toLowerCase();
    this.applySearchAndSort(storeId);
  }

  handleSort(field, direction, storeId) {
    const store = this.stores.get(storeId);
    if (!store) return;

    store.sortState.field = field === "price" ? "price" : "name";
    store.sortState.direction = direction === "desc" ? "desc" : "asc";
    this.applySearchAndSort(storeId);
  }

  applySearchAndSort(storeId) {
    const store = this.stores.get(storeId);
    if (!store) return;

    const query = store.searchQuery;
    store.filteredProducts = store.products.filter(
      (product) =>
        (product.name || "").toLowerCase().includes(query) ||
        (product.sku || "").toLowerCase().includes(query)
    );

    const field = store.sortState.field;
    const direction = store.sortState.direction;
    store.filteredProducts.sort((a, b) => {
      let result;
      if (field === "price") {
        result = safeNumber(a.price) - safeNumber(b.price);
      } else {
        result = String(a.name || "").localeCompare(String(b.name || ""));
      }
      return direction === "asc" ? result : -result;
    });

    this.updateProductDisplay(storeId);
  }

  updateProductDisplay(storeId) {
    const store = this.stores.get(storeId);
    if (!store) return;

    const catalog = document.querySelector(
      `[data-swb-catalog][data-swb-store-id="${escapeSelector(storeId)}"]`
    );
    if (!catalog) return;

    const productGrid = catalog.querySelector(".swb-grid");
    if (!productGrid) return;

    const fragment = document.createDocumentFragment();
    store.filteredProducts.forEach((product) => {
      fragment.appendChild(product.element);
    });

    productGrid.innerHTML = "";
    productGrid.appendChild(fragment);
  }

  // ---- Event delegation ---------------------------------------------------

  setupEventListeners() {
    if (this._listenersBound) return;
    this._listenersBound = true;

    document.addEventListener("click", (e) => {
      const actionEl = e.target.closest("[data-swb-action]");
      if (actionEl) {
        const action = actionEl.getAttribute("data-swb-action");
        const storeId = actionEl.getAttribute("data-swb-store-id");
        const sku = actionEl.getAttribute("data-swb-sku");
        switch (action) {
          case "dec":
            this.updateQuantity(storeId, sku, -1);
            break;
          case "inc":
            this.updateQuantity(storeId, sku, 1);
            break;
          case "remove":
            this.removeFromCart(storeId, sku);
            break;
          case "close":
            this.closeCheckout(storeId);
            break;
          case "clear":
            if (confirm("Are you sure you want to clear your cart?")) {
              this.clearCart(storeId);
            }
            break;
        }
        return;
      }

      if (e.target.classList && e.target.classList.contains("swb-cart-modal")) {
        this.closeCheckout(e.target.getAttribute("data-swb-store-id"));
      }
    });

    document.addEventListener("keydown", (e) => {
      if (!this.activeModal) return;
      if (e.key === "Escape") {
        const storeId = this.activeModal.getAttribute("data-swb-store-id");
        this.closeCheckout(storeId);
      } else if (e.key === "Tab") {
        this.handleTabKey(e);
      }
    });
  }

  handleTabKey(e) {
    const modal = this.activeModal;
    const focusables = this.getFocusableElements(modal);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (e.shiftKey) {
      if (active === first || !modal.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last || !modal.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  }

  getFocusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.disabled && el.offsetParent !== null);
  }

  // ---- Cart ---------------------------------------------------------------

  updateCartCount(storeId) {
    const store = this.stores.get(storeId);
    if (!store) return;

    const count = store.cart.reduce(
      (total, item) => total + safeNumber(item && item.quantity, 1),
      0
    );

    document
      .querySelectorAll(`[data-swb-store-id="${escapeSelector(storeId)}"] [data-swb-cart-count]`)
      .forEach((counter) => {
        counter.textContent = count;
      });

    const modalCounters = document.querySelectorAll(
      `.swb-cart-modal[data-swb-store-id="${escapeSelector(storeId)}"] .swb-cart-count`
    );
    modalCounters.forEach((counter) => {
      if (counter.closest(".swb-cart-subheader")) {
        counter.textContent = store.cart.length;
      } else {
        counter.textContent = count;
      }
    });
  }

  addToCart(storeId, product) {
    const store = this.stores.get(storeId);
    if (!store || !product) return;

    const item = {
      sku: String(product.sku != null ? product.sku : ""),
      name: String(product.name != null ? product.name : product.sku),
      price: safeNumber(product.price),
      quantity: Math.max(1, Math.round(safeNumber(product.quantity, 1))),
    };

    const existingProduct = store.cart.find((cartItem) => cartItem.sku === item.sku);
    if (existingProduct) {
      existingProduct.quantity += item.quantity;
    } else {
      store.cart.push(item);
    }

    this.saveCartToStorage(storeId, store.cart);
    this.updateCartCount(storeId);
    this.renderCart(storeId);
  }

  createCartItem(storeId, item) {
    const itemElement = document.createElement("div");
    itemElement.classList.add("swb-cart-item");

    const nameElement = document.createElement("div");
    nameElement.classList.add("swb-item-name");
    nameElement.textContent = item.name;
    itemElement.appendChild(nameElement);

    const quantityElement = document.createElement("div");
    quantityElement.classList.add("swb-item-quantity");

    const decButton = document.createElement("button");
    decButton.type = "button";
    decButton.setAttribute("data-swb-action", "dec");
    decButton.setAttribute("data-swb-store-id", storeId);
    decButton.setAttribute("data-swb-sku", item.sku);
    decButton.setAttribute("aria-label", `Decrease quantity of ${item.name}`);
    decButton.appendChild(createIconElement("minus"));
    quantityElement.appendChild(decButton);

    const quantitySpan = document.createElement("span");
    quantitySpan.classList.add("swb-item-qty-value");
    quantitySpan.textContent = item.quantity;
    quantityElement.appendChild(quantitySpan);

    const incButton = document.createElement("button");
    incButton.type = "button";
    incButton.setAttribute("data-swb-action", "inc");
    incButton.setAttribute("data-swb-store-id", storeId);
    incButton.setAttribute("data-swb-sku", item.sku);
    incButton.setAttribute("aria-label", `Increase quantity of ${item.name}`);
    incButton.appendChild(createIconElement("plus"));
    quantityElement.appendChild(incButton);

    itemElement.appendChild(quantityElement);

    const priceElement = document.createElement("div");
    priceElement.classList.add("swb-item-price");
    priceElement.textContent = item.price ? this.formatPrice(item.price * item.quantity, storeId) : "";
    itemElement.appendChild(priceElement);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.classList.add("swb-remove-item");
    removeButton.setAttribute("data-swb-action", "remove");
    removeButton.setAttribute("data-swb-store-id", storeId);
    removeButton.setAttribute("data-swb-sku", item.sku);
    removeButton.setAttribute("aria-label", `Remove ${item.name} from cart`);
    removeButton.appendChild(createIconElement("x-mark"));
    itemElement.appendChild(removeButton);

    return itemElement;
  }

  renderCart(storeId) {
    const cartModal = document.querySelector(
      `.swb-cart-modal[data-swb-store-id="${escapeSelector(storeId)}"]`
    );
    if (!cartModal) return;

    const store = this.stores.get(storeId);
    if (!store) return;

    const cartItems = cartModal.querySelector(".swb-cart-items");
    cartItems.innerHTML = "";

    if (store.cart.length === 0) {
      const emptyElement = document.createElement("div");
      emptyElement.classList.add("swb-cart-empty");
      emptyElement.textContent = "Your cart is empty.";
      cartItems.appendChild(emptyElement);
    } else {
      const fragment = document.createDocumentFragment();
      store.cart.forEach((item) => {
        fragment.appendChild(this.createCartItem(storeId, item));
      });
      cartItems.appendChild(fragment);
    }

    const submitButton = cartModal.querySelector('.swb-checkout-form button[type="submit"]');
    if (submitButton) submitButton.disabled = store.cart.length === 0;

    this.updateTotal(storeId);
  }

  updateQuantity(storeId, sku, change) {
    const store = this.stores.get(storeId);
    if (!store) return;

    const product = store.cart.find((item) => item.sku === sku);
    if (!product) return;

    product.quantity += Number(change) || 0;
    if (product.quantity <= 0) {
      this.removeFromCart(storeId, sku);
    } else {
      this.saveCartToStorage(storeId, store.cart);
      this.renderCart(storeId);
      this.updateCartCount(storeId);
    }
  }

  removeFromCart(storeId, sku) {
    const store = this.stores.get(storeId);
    if (!store) return;

    store.cart = store.cart.filter((item) => item.sku !== sku);
    this.saveCartToStorage(storeId, store.cart);
    this.renderCart(storeId);
    this.updateCartCount(storeId);
  }

  updateTotal(storeId) {
    const store = this.stores.get(storeId);
    if (!store) return;

    const total = this.calculateCartTotal(store.cart);
    const totalElement = document.querySelector(
      `.swb-cart-modal[data-swb-store-id="${escapeSelector(storeId)}"] .swb-cart-total`
    );
    if (totalElement) {
      totalElement.textContent = `Total: ${this.formatPrice(total, storeId)}`;
    }
  }

  // ---- Checkout modal -----------------------------------------------------

  createCustomFieldElement(field, storeId, index) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("swb-custom-field");

    if (!field || typeof field.name !== "string" || !field.name.trim()) return wrapper;

    const fieldName = field.name;
    const type = typeof field.type === "string" ? field.type.toLowerCase() : "text";
    const inputId = `swb-field-${sanitizeIdPart(storeId)}-${sanitizeIdPart(fieldName)}-${index}`;

    const label = document.createElement("label");
    label.setAttribute("for", inputId);
    label.classList.add("swb-field-label");
    label.textContent = field.label || fieldName;
    wrapper.appendChild(label);

    let input;
    if (type === "textarea") {
      input = document.createElement("textarea");
      if (field.placeholder) input.placeholder = String(field.placeholder);
    } else if (type === "select") {
      input = document.createElement("select");
      const options = Array.isArray(field.options) ? field.options : [];
      if (field.placeholder) {
        const placeholderOption = document.createElement("option");
        placeholderOption.value = "";
        placeholderOption.textContent = String(field.placeholder);
        placeholderOption.disabled = true;
        if (field.required) placeholderOption.selected = true;
        input.appendChild(placeholderOption);
      }
      options.forEach((optionValue) => {
        const option = document.createElement("option");
        option.value = String(optionValue);
        option.textContent = String(optionValue);
        input.appendChild(option);
      });
    } else {
      input = document.createElement("input");
      const allowedTypes = ["text", "email", "tel", "number", "date", "time", "url"];
      input.type = allowedTypes.indexOf(type) !== -1 ? type : "text";
      if (field.placeholder) input.placeholder = String(field.placeholder);
      if (field.pattern) input.setAttribute("pattern", String(field.pattern));
      if (field.min != null && field.min !== "") input.setAttribute("min", String(field.min));
      if (field.max != null && field.max !== "") input.setAttribute("max", String(field.max));
    }

    if (field.required) input.required = true;
    input.id = inputId;
    input.setAttribute("name", fieldName);
    wrapper.appendChild(input);

    return wrapper;
  }

  createCartModal(storeId) {
    const store = this.stores.get(storeId);
    if (!store) return null;

    const modal = document.createElement("div");
    modal.classList.add("swb-cart-modal");
    modal.setAttribute("data-swb-store-id", storeId);
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", `swb-cart-title-${sanitizeIdPart(storeId)}`);

    const content = document.createElement("div");
    content.classList.add("swb-modal-content");

    const header = document.createElement("div");
    header.classList.add("swb-cart-header");
    const title = document.createElement("h2");
    title.id = `swb-cart-title-${sanitizeIdPart(storeId)}`;
    title.textContent = store.info.checkoutTitle || "Your Cart";
    header.appendChild(title);
    content.appendChild(header);

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.classList.add("swb-modal-close");
    closeButton.setAttribute("data-swb-action", "close");
    closeButton.setAttribute("data-swb-store-id", storeId);
    closeButton.setAttribute("aria-label", "Close cart");
    closeButton.appendChild(createIconElement("x-mark"));
    content.appendChild(closeButton);

    const subheader = document.createElement("div");
    subheader.classList.add("swb-cart-subheader");
    const itemsLabel = document.createElement("p");
    itemsLabel.textContent = "Items";
    subheader.appendChild(itemsLabel);
    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.classList.add("swb-clear-cart");
    clearButton.setAttribute("data-swb-action", "clear");
    clearButton.setAttribute("data-swb-store-id", storeId);
    clearButton.textContent = "Clear All";
    subheader.appendChild(clearButton);
    content.appendChild(subheader);

    const cartItems = document.createElement("div");
    cartItems.classList.add("swb-cart-items");
    content.appendChild(cartItems);

    const totalElement = document.createElement("div");
    totalElement.classList.add("swb-cart-total");
    totalElement.textContent = `Total: ${this.formatPrice(0, storeId)}`;
    content.appendChild(totalElement);

    const form = document.createElement("form");
    form.classList.add("swb-checkout-form");
    form.setAttribute("novalidate", "");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      this.processCheckout(storeId, new FormData(form));
    });

    if (store.info.enableBilling) {
      const billingTitle = document.createElement("h2");
      billingTitle.textContent = store.info.billingTitle || "Billing Details";
      form.appendChild(billingTitle);
      [
        ["name", "Full Name", "text"],
        ["email", "Email", "email"],
        ["phone", "Phone Number", "tel"],
      ].forEach(([name, placeholder, type]) => {
        const input = document.createElement("input");
        input.type = type;
        input.name = name;
        input.placeholder = placeholder;
        input.required = true;
        input.setAttribute("aria-label", placeholder);
        form.appendChild(input);
      });
      const address = document.createElement("textarea");
      address.name = "address";
      address.placeholder = "Delivery Address";
      address.required = true;
      address.setAttribute("aria-label", "Delivery Address");
      form.appendChild(address);
    }

    (store.info.customFields || []).forEach((field, index) => {
      form.appendChild(this.createCustomFieldElement(field, storeId, index));
    });

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = store.info.submitButtonText || "Proceed to WhatsApp";
    form.appendChild(submitButton);
    content.appendChild(form);

    modal.appendChild(content);
    document.body.appendChild(modal);
    this.applyStoreTheme(storeId);
    return modal;
  }

  showCheckout(storeId) {
    const store = this.stores.get(storeId);
    if (!store) {
      console.warn(`SWB: store "${storeId}" not initialized.`);
      return;
    }

    let modal = document.querySelector(
      `.swb-cart-modal[data-swb-store-id="${escapeSelector(storeId)}"]`
    );
    if (!modal) {
      modal = this.createCartModal(storeId);
    }
    if (!modal) return;

    this.renderCart(storeId);
    this.updateCartCount(storeId);
    this.openModal(modal);
  }

  openModal(modal) {
    this.lastFocused = document.activeElement;
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    this.activeModal = modal;

    const focusables = this.getFocusableElements(modal);
    const input = focusables.find((el) => el.matches("input, select, textarea"));
    (input || focusables[0] || modal).focus();
  }

  closeModal(modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
    this.activeModal = null;
    if (this.lastFocused && typeof this.lastFocused.focus === "function") {
      this.lastFocused.focus();
    }
    this.lastFocused = null;
  }

  closeCheckout(storeId) {
    const modal = document.querySelector(
      `.swb-cart-modal[data-swb-store-id="${escapeSelector(storeId)}"]`
    );
    if (modal && modal.style.display !== "none") {
      this.closeModal(modal);
    }
  }

  // ---- WhatsApp checkout --------------------------------------------------

  processCheckout(storeId, formData) {
    const store = this.stores.get(storeId);
    if (!store) return;

    const customerInfo = {};
    formData.forEach((value, key) => {
      customerInfo[key] = value;
    });

    const message = this.formatWhatsAppMessage(storeId, customerInfo);
    const whatsappUrl = `https://wa.me/${
      store.info.whatsapp
    }?text=${encodeURIComponent(message)}`;

    const opened = window.open(whatsappUrl, "_blank");
    if (opened) {
      this.clearCart(storeId);
    } else {
      // Popup blocked: fall back to navigating the current tab. The cart is
      // cleared first so returning to the page doesn't duplicate the order.
      this.clearCart(storeId);
      window.location.href = whatsappUrl;
    }
  }

  formatWhatsAppMessage(storeId, customerInfo) {
    const store = this.stores.get(storeId);
    if (!store) return "";

    const orderDate = new Date().toLocaleString();
    let message = `New Order from ${store.info.name || storeId}\n`;
    message += `Date: ${orderDate}\n\n`;

    if (store.info.enableBilling) {
      message += `Customer Information:\n`;
      message += `Name: ${customerInfo.name || "-"}\n`;
      message += `Email: ${customerInfo.email || "-"}\n`;
      message += `Phone: ${customerInfo.phone || "-"}\n`;
      message += `Address: ${customerInfo.address || "-"}\n\n`;
    }

    (store.info.customFields || []).forEach((field) => {
      if (field && field.name && customerInfo[field.name]) {
        message += `${field.label || field.name}: ${customerInfo[field.name]}\n`;
      }
    });

    message += `Order Details:\n`;

    store.cart.forEach((item) => {
      message += `- ${item.name} (SKU: ${item.sku})\n`;
      message += `  Quantity: ${item.quantity}\n`;
      if (item.price) {
        message += `  Price: ${this.formatPrice(item.price * item.quantity, storeId)}\n\n`;
      }
    });

    const total = this.calculateCartTotal(store.cart);
    if (total > 0) {
      message += `Total Amount: ${this.formatPrice(total, storeId)}`;
    }

    return message;
  }
}

if (typeof window !== "undefined") {
  window.swb = new SWB();
}

module.exports = SWB;
