const STORAGE_KEYS = {
  products: "woodoor_products",
  gallery: "woodoor_gallery",
  auth: "woodoor_admin_auth",
};

let loaderCounter = 0;

function createGlobalLoader() {
  if (document.querySelector("#global-loader")) return;
  const loader = document.createElement("div");
  loader.id = "global-loader";
  loader.innerHTML = `
    <div class="loader-wrap">
      <div class="door-loader">
        <div class="door-frame">
          <div class="door-left"></div>
          <div class="door-right"></div>
        </div>
      </div>
      <p class="loader-text">Loading showroom...</p>
    </div>
  `;
  document.body.appendChild(loader);
}

function showGlobalLoader() {
  createGlobalLoader();
  loaderCounter += 1;
  const loader = document.querySelector("#global-loader");
  if (loader) loader.classList.add("active");
}

function hideGlobalLoader(force = false) {
  if (force) {
    loaderCounter = 0;
  } else {
    loaderCounter = Math.max(0, loaderCounter - 1);
  }
  if (loaderCounter > 0) return;
  const loader = document.querySelector("#global-loader");
  if (loader) loader.classList.remove("active");
}

function setupLoaderLifecycle() {
  createGlobalLoader();
  if (document.readyState !== "complete") {
    showGlobalLoader();
    window.addEventListener("load", () => hideGlobalLoader(true), { once: true });
  }

  window.addEventListener("pageshow", () => hideGlobalLoader(true));
  window.addEventListener("beforeunload", () => showGlobalLoader());

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    if (link.target === "_blank") return;
    if (link.hasAttribute("download")) return;
    const nextUrl = new URL(href, window.location.href);
    if (nextUrl.origin !== window.location.origin) return;
    const isSameDocument =
      nextUrl.pathname === window.location.pathname &&
      nextUrl.search === window.location.search;
    if (isSameDocument && nextUrl.hash) return;
    showGlobalLoader();
    window.setTimeout(() => hideGlobalLoader(true), 5000);
  });
}

setupLoaderLifecycle();

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=900&q=80";

const DEFAULT_PRODUCTS = [
  {
    name: "Classic Sheesham Room Door",
    price: "PKR 42,000",
    category: "room",
    material: "sheesham",
    priceRange: "mid",
    color: "walnut",
    image:
      "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Royal Oak Main Door",
    price: "PKR 88,000",
    category: "main",
    material: "oak",
    priceRange: "high",
    color: "teak",
    image:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Heritage Double Main Door",
    price: "PKR 96,000",
    category: "main",
    material: "sheesham",
    priceRange: "high",
    color: "walnut",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Modern Panel Room Door",
    price: "PKR 46,500",
    category: "room",
    material: "deodar",
    priceRange: "mid",
    color: "teak",
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Premium Carved Oak Door",
    price: "PKR 84,500",
    category: "main",
    material: "oak",
    priceRange: "high",
    color: "teak",
    image:
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Minimal Flush Room Door",
    price: "PKR 38,500",
    category: "room",
    material: "deodar",
    priceRange: "mid",
    color: "matte",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Deodar Sliding Window",
    price: "PKR 39,500",
    category: "window",
    material: "deodar",
    priceRange: "mid",
    color: "matte",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "French Style Door Set",
    price: "PKR 79,000",
    category: "main",
    material: "oak",
    priceRange: "high",
    color: "walnut",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Classic Engraved Room Door",
    price: "PKR 44,000",
    category: "room",
    material: "sheesham",
    priceRange: "mid",
    color: "walnut",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
  },
];

const DEFAULT_GALLERY = [
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1600585154205-1f76b85bd5e1?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1617104551722-3b2d51366495?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=700&q=80",
];

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function bootstrapStorage() {
  const storedProducts = readJSON(STORAGE_KEYS.products, []);
  if (!Array.isArray(storedProducts) || storedProducts.length === 0) {
    writeJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
  } else {
    const existingNames = new Set(storedProducts.map((item) => item.name));
    const merged = [...storedProducts];
    DEFAULT_PRODUCTS.forEach((product) => {
      if (!existingNames.has(product.name)) merged.push(product);
    });
    writeJSON(STORAGE_KEYS.products, merged);
  }
  if (!localStorage.getItem(STORAGE_KEYS.gallery)) {
    writeJSON(STORAGE_KEYS.gallery, DEFAULT_GALLERY);
  }
}

bootstrapStorage();

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
}

const slides = document.querySelectorAll(".slide");
if (slides.length > 0) {
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 4500);
}

function formatLabel(value) {
  if (!value) return "N/A";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function normalizeValue(value) {
  return (value || "").toString().trim().toLowerCase();
}

function normalizeCategory(value) {
  const raw = normalizeValue(value);
  if (raw.includes("main")) return "main";
  if (raw.includes("window") || raw.includes("sliding")) return "window";
  return "room";
}

function normalizeMaterial(value) {
  const raw = normalizeValue(value);
  if (raw.includes("oak")) return "oak";
  if (raw.includes("deodar")) return "deodar";
  return "sheesham";
}

function normalizePriceRange(value, priceText) {
  const raw = normalizeValue(value);
  if (raw.includes("high") || raw.includes("60")) return "high";
  if (raw.includes("mid") || raw.includes("30")) return "mid";
  const numeric = Number((priceText || "").replace(/[^\d]/g, ""));
  return numeric >= 60000 ? "high" : "mid";
}

function normalizeColor(value) {
  const raw = normalizeValue(value);
  return raw || "walnut";
}

function inferPriceRangeFromBand(priceAmount, fromAmount, toAmount) {
  if (Number.isNaN(priceAmount)) return "mid";
  const upper = Math.max(fromAmount || 0, toAmount || 0, 60000);
  return priceAmount >= upper ? "high" : "mid";
}

function normalizeProductPages(value) {
  const allowed = [
    "home",
    "shop",
    "product",
    "about",
    "services",
    "gallery",
    "contact",
    "admin",
  ];
  if (Array.isArray(value) && value.length > 0) {
    const cleaned = value.map((item) => normalizeValue(item)).filter((item) => allowed.includes(item));
    return cleaned.length > 0 ? Array.from(new Set(cleaned)) : ["home", "shop"];
  }
  const raw = normalizeValue(value);
  if (raw === "home") return ["home"];
  if (raw === "shop") return ["shop"];
  return ["home", "shop"];
}

function getProductPages(product) {
  if (product.pages) return normalizeProductPages(product.pages);
  return normalizeProductPages(product.displayOn);
}

function isProductVisibleOnPage(product, pageKey) {
  return getProductPages(product).includes(pageKey);
}

function normalizeGalleryDisplayOn(value) {
  const raw = normalizeValue(value);
  if (raw === "home") return "home";
  if (raw === "gallery") return "gallery";
  return "both";
}

function normalizeGalleryItem(item) {
  if (typeof item === "string") {
    return { src: item, displayOn: "both" };
  }
  return {
    src: item?.src || "",
    displayOn: normalizeGalleryDisplayOn(item?.displayOn),
  };
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    showGlobalLoader();
    const img = new Image();
    img.onload = () => {
      hideGlobalLoader();
      resolve(url);
    };
    img.onerror = () => {
      hideGlobalLoader();
      reject(new Error("Image load failed"));
    };
    img.src = url;
  });
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    showGlobalLoader();
    const reader = new FileReader();
    reader.onload = () => {
      hideGlobalLoader();
      resolve(reader.result);
    };
    reader.onerror = () => {
      hideGlobalLoader();
      reject(new Error("File read failed"));
    };
    reader.readAsDataURL(file);
  });
}

function productCardTemplate(product) {
  return `
    <article class="card animate" data-product data-category="${product.category}" data-material="${product.material}" data-price="${product.priceRange}" data-color="${product.color}">
      <img src="${product.image || FALLBACK_IMAGE}" alt="${product.name}" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'" />
      <div class="card-content">
        <h3>${product.name}</h3>
        <p class="price">${product.price}</p>
        <p class="product-meta">${formatLabel(product.material)} | ${formatLabel(product.color)}</p>
      </div>
    </article>`;
}

function updateVisibleCount() {
  const countEl = document.querySelector("#shop-count");
  if (!countEl) return;
  const visible = Array.from(document.querySelectorAll("[data-product]")).filter(
    (el) => el.style.display !== "none"
  ).length;
  countEl.textContent = `Showing ${visible} products`;
}

function renderShopProducts() {
  const wrap = document.querySelector("#shop-products");
  if (!wrap) return;
  const products = readJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS).filter((product) =>
    isProductVisibleOnPage(product, "shop")
  );
  if (!Array.isArray(products) || products.length === 0) {
    wrap.innerHTML = `<div class="empty-state"><h3>No products found</h3><p>Please add products from admin panel.</p></div>`;
    updateVisibleCount();
    return;
  }
  wrap.innerHTML = products.map((product) => productCardTemplate(product)).join("");
  updateVisibleCount();
}

function renderGallery() {
  const gallery = readJSON(STORAGE_KEYS.gallery, DEFAULT_GALLERY).map(
    normalizeGalleryItem
  );
  const galleryPage = document.querySelector("#gallery-grid");
  if (galleryPage) {
    galleryPage.innerHTML = gallery
      .filter((item) => item.displayOn !== "home")
      .map((item, idx) => `<img src="${item.src}" alt="Gallery image ${idx + 1}" />`)
      .join("");
  }
  const homeGallery = document.querySelector("#home-gallery-grid");
  if (homeGallery) {
    homeGallery.innerHTML = gallery
      .filter((item) => item.displayOn !== "gallery")
      .slice(0, 4)
      .map((item, idx) => `<img src="${item.src}" alt="Project ${idx + 1}" />`)
      .join("");
  }
}

function renderFeaturedProducts() {
  const wrap = document.querySelector("#featured-products");
  if (!wrap) return;
  const products = readJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS)
    .filter((product) => isProductVisibleOnPage(product, "home"))
    .slice(0, 4);
  wrap.innerHTML = products
    .map(
      (product) => `
      <article class="card animate">
        <img src="${product.image || FALLBACK_IMAGE}" alt="${product.name}" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'" />
        <div class="card-content">
          <h3>${product.name}</h3>
          <p class="price">${product.price}</p>
        </div>
      </article>`
    )
    .join("");
}

renderShopProducts();
renderGallery();
renderFeaturedProducts();

function renderPageProducts() {
  const grid = document.querySelector("#page-products-grid");
  if (!grid) return;
  const pageKey = document.body.dataset.page || "";
  const products = readJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS)
    .filter((product) => isProductVisibleOnPage(product, pageKey))
    .slice(0, 6);
  if (products.length === 0) {
    grid.innerHTML = "";
    return;
  }
  grid.innerHTML = products.map((product) => productCardTemplate(product)).join("");
}

renderPageProducts();

const animateElements = document.querySelectorAll(".animate");
if (animateElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.16 }
  );
  animateElements.forEach((el) => observer.observe(el));
}

function wireFilters() {
  const filters = document.querySelectorAll("[data-filter]");
  if (filters.length === 0) return;
  filters.forEach((filter) => {
    filter.addEventListener("change", () => {
      const selected = {};
      filters.forEach((input) => {
        if (input.checked) selected[input.name] = input.value;
      });
      const products = document.querySelectorAll("[data-product]");
      products.forEach((product) => {
        const match = Object.entries(selected).every(
          ([key, value]) => value === "all" || product.dataset[key] === value
        );
        product.style.display = match ? "block" : "none";
      });
      updateVisibleCount();
    });
  });
}

wireFilters();

const resetCatalogBtn = document.querySelector("#reset-catalog");
if (resetCatalogBtn) {
  resetCatalogBtn.addEventListener("click", () => {
    writeJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
    renderShopProducts();
    wireFilters();
  });
}

const mainImage = document.querySelector("#main-product-image");
const thumbs = document.querySelectorAll(".thumbs img");
if (mainImage && thumbs.length > 0) {
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      thumbs.forEach((item) => item.classList.remove("active"));
      thumb.classList.add("active");
      mainImage.src = thumb.src;
      mainImage.alt = thumb.alt;
    });
  });
}

function setupAdmin() {
  const loginForm = document.querySelector("#admin-login-form");
  const panel = document.querySelector("#admin-panel");
  if (!loginForm || !panel) return;

  const auth = readJSON(STORAGE_KEYS.auth, false);
  if (auth) {
    loginForm.style.display = "none";
    panel.style.display = "block";
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = document.querySelector("#admin-username").value.trim();
    const password = document.querySelector("#admin-password").value.trim();
    if (username === "admin" && password === "admin123") {
      writeJSON(STORAGE_KEYS.auth, true);
      loginForm.style.display = "none";
      panel.style.display = "block";
      renderAdminLists();
      return;
    }
    alert("Invalid credentials");
  });

  const logoutBtn = document.querySelector("#admin-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      writeJSON(STORAGE_KEYS.auth, false);
      window.location.reload();
    });
  }

  const addProductForm = document.querySelector("#add-product-form");
  if (addProductForm) {
    const productStatus = document.querySelector("#product-status");

    function setProductStatus(message) {
      if (productStatus) productStatus.textContent = message;
    }

    addProductForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      setProductStatus("");
      const productMediaStatus = document.querySelector("#product-media-status");
      const name = document.querySelector("#product-name").value.trim();
      const priceRaw = document.querySelector("#product-price").value.trim();
      const productImageUrl = document.querySelector("#product-image-url").value.trim();
      const productImageFile = document.querySelector("#product-image-file").files[0];
      const productPagesSelect = document.querySelector("#product-visibility-pages");
      const categoryInput = document.querySelector("#product-category").value;
      const materialInput = document.querySelector("#product-material").value;
      const colorInput = document.querySelector("#product-color").value;
      const selectedPages = Array.from(productPagesSelect.selectedOptions).map(
        (option) => option.value
      );
      const priceAmount = Number(priceRaw);

      if (!name) {
        setProductStatus("Please enter product name.");
        return;
      }
      if (Number.isNaN(priceAmount) || priceAmount < 0) {
        setProductStatus("Please enter valid numeric price.");
        return;
      }
      if (!categoryInput.trim() || !materialInput.trim() || !colorInput.trim()) {
        setProductStatus("Category, material, and color are required.");
        return;
      }
      if (selectedPages.length === 0) {
        setProductStatus("Select at least one page for product visibility.");
        return;
      }
      let productImage = FALLBACK_IMAGE;
      try {
        if (productImageFile) {
          productImage = await fileToDataURL(productImageFile);
          if (productMediaStatus) productMediaStatus.textContent = "Using selected local product image.";
        } else if (productImageUrl) {
          await loadImage(productImageUrl);
          productImage = productImageUrl;
          if (productMediaStatus) productMediaStatus.textContent = "Using entered product image URL.";
        } else if (productMediaStatus) {
          productMediaStatus.textContent = "No product image selected. Using default image.";
        }
      } catch (error) {
        setProductStatus("Selected product image could not be loaded.");
        return;
      }
      const product = {
        name,
        price: `PKR ${priceAmount.toLocaleString("en-US")}`,
        category: normalizeCategory(categoryInput),
        material: normalizeMaterial(materialInput),
        priceRange: inferPriceRangeFromBand(priceAmount, 30000, 60000),
        color: normalizeColor(colorInput),
        pages: normalizeProductPages(selectedPages),
        image: productImage,
      };
      const products = readJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
      products.unshift(product);
      writeJSON(STORAGE_KEYS.products, products);
      addProductForm.reset();
      if (productPagesSelect) {
        Array.from(productPagesSelect.options).forEach((opt) => {
          opt.selected = opt.value === "home" || opt.value === "shop";
        });
      }
      renderAdminLists();
      setProductStatus("Product added successfully.");
    });
  }

  const addGalleryForm = document.querySelector("#add-gallery-form");
  if (addGalleryForm) {
    const galleryInput = document.querySelector("#gallery-image");
    const galleryFileInput = document.querySelector("#gallery-image-file");
    const previewImg = document.querySelector("#gallery-preview-image");
    const previewText = document.querySelector("#gallery-preview-text");
    const statusEl = document.querySelector("#gallery-status");

    async function updateGalleryPreview(selectedSource) {
      const selectedFile = galleryFileInput.files && galleryFileInput.files[0];
      const imageUrl = galleryInput.value.trim();
      if (!imageUrl && !selectedFile) {
        previewImg.style.display = "none";
        previewImg.src = "";
        previewText.textContent = "Preview will appear here";
        statusEl.textContent = "";
        return;
      }

      // If user is explicitly using URL, clear file. If user picks file, clear URL.
      if (selectedSource === "url" && selectedFile) {
        galleryFileInput.value = "";
      } else if (selectedSource === "file" && imageUrl) {
        galleryInput.value = "";
      }

      const currentFile = galleryFileInput.files && galleryFileInput.files[0];
      const currentUrl = galleryInput.value.trim();

      try {
        if (currentFile) {
          const localImage = await fileToDataURL(currentFile);
          previewImg.src = localImage;
          previewText.textContent = `Local file selected: ${currentFile.name}`;
          statusEl.textContent = "Local image loaded. You can add it now.";
        } else {
          await loadImage(currentUrl);
          previewImg.src = currentUrl;
          previewText.textContent = "Preview loaded";
          statusEl.textContent = "Image URL looks good. You can add it now.";
        }
        previewImg.style.display = "block";
      } catch (error) {
        previewImg.style.display = "none";
        previewImg.src = "";
        previewText.textContent = "Image not loading. Check URL.";
        statusEl.textContent = "Unable to load selected image.";
      }
    }

    galleryInput.addEventListener("input", () => {
      updateGalleryPreview("url");
    });

    galleryFileInput.addEventListener("change", () => {
      updateGalleryPreview("file");
    });

    addGalleryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const imageUrl = galleryInput.value.trim();
      const selectedFile = galleryFileInput.files && galleryFileInput.files[0];
      let image = "";
      try {
        if (selectedFile) {
          image = await fileToDataURL(selectedFile);
        } else if (imageUrl) {
          await loadImage(imageUrl);
          image = imageUrl;
        } else {
          statusEl.textContent = "Enter an image URL or choose a local file.";
          return;
        }
      } catch (error) {
        statusEl.textContent = "Image source invalid. Use another URL/file.";
        return;
      }
      const gallery = readJSON(STORAGE_KEYS.gallery, DEFAULT_GALLERY).map(
        normalizeGalleryItem
      );
      gallery.unshift({
        src: image,
        displayOn: "both",
      });
      writeJSON(STORAGE_KEYS.gallery, gallery);
      addGalleryForm.reset();
      previewImg.style.display = "none";
      previewImg.src = "";
      previewText.textContent = "Image added successfully.";
      statusEl.textContent = "Added. Thumbnail is now listed below.";
      renderAdminLists();
    });
  }

  renderAdminLists();
}

function renderAdminLists() {
  const productList = document.querySelector("#admin-product-list");
  const galleryList = document.querySelector("#admin-gallery-list");
  if (!productList || !galleryList) return;

  const products = readJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
  const gallery = readJSON(STORAGE_KEYS.gallery, DEFAULT_GALLERY).map(
    normalizeGalleryItem
  );

  productList.innerHTML = products
    .map(
      (item, idx) => `
      <div class="why-card" style="margin-bottom:10px;">
        <strong>${item.name}</strong> - ${item.price}
        <div><small>${item.category} | ${item.material} | ${item.color}</small></div>
        <div><small>${getProductPages(item).join(", ")}</small></div>
        <button class="btn btn-outline dark" data-delete-product="${idx}" style="margin-top:8px;">Delete</button>
      </div>`
    )
    .join("");

  galleryList.innerHTML = gallery
    .map(
      (item, idx) => `
      <div class="why-card" style="margin-bottom:10px;">
        <img src="${item.src}" alt="Gallery" style="height:80px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />
        <div><small>Display: ${normalizeGalleryDisplayOn(item.displayOn)}</small></div>
        <button class="btn btn-outline dark" data-delete-gallery="${idx}">Delete</button>
      </div>`
    )
    .join("");

  document.querySelectorAll("[data-delete-product]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.deleteProduct);
      const updated = readJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS).filter(
        (_, idx) => idx !== index
      );
      writeJSON(STORAGE_KEYS.products, updated);
      renderAdminLists();
    });
  });

  document.querySelectorAll("[data-delete-gallery]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.deleteGallery);
      const updated = readJSON(STORAGE_KEYS.gallery, DEFAULT_GALLERY).filter(
        (_, idx) => idx !== index
      );
      writeJSON(STORAGE_KEYS.gallery, updated);
      renderAdminLists();
    });
  });
}

setupAdmin();
