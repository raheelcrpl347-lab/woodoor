const STORAGE_KEYS = {
  products: "woodoor_products",
  gallery: "woodoor_gallery",
  auth: "woodoor_admin_auth",
};

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
    name: "Deodar Sliding Window",
    price: "PKR 39,500",
    category: "window",
    material: "deodar",
    priceRange: "mid",
    color: "matte",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80",
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
  if (!localStorage.getItem(STORAGE_KEYS.products)) {
    writeJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
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

function renderShopProducts() {
  const wrap = document.querySelector("#shop-products");
  if (!wrap) return;
  const products = readJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
  wrap.innerHTML = products
    .map(
      (product) => `
      <article class="card animate" data-product data-category="${product.category}" data-material="${product.material}" data-price="${product.priceRange}" data-color="${product.color}">
        <img src="${product.image}" alt="${product.name}" />
        <div class="card-content">
          <h3>${product.name}</h3>
          <p class="price">${product.price}</p>
          <p class="product-meta">${product.material} | ${product.color}</p>
        </div>
      </article>`
    )
    .join("");
}

function renderGallery() {
  const gallery = readJSON(STORAGE_KEYS.gallery, DEFAULT_GALLERY);
  const galleryPage = document.querySelector("#gallery-grid");
  if (galleryPage) {
    galleryPage.innerHTML = gallery
      .map((src, idx) => `<img src="${src}" alt="Gallery image ${idx + 1}" />`)
      .join("");
  }
  const homeGallery = document.querySelector("#home-gallery-grid");
  if (homeGallery) {
    homeGallery.innerHTML = gallery
      .slice(0, 4)
      .map((src, idx) => `<img src="${src}" alt="Project ${idx + 1}" />`)
      .join("");
  }
}

function renderFeaturedProducts() {
  const wrap = document.querySelector("#featured-products");
  if (!wrap) return;
  const products = readJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS).slice(0, 4);
  wrap.innerHTML = products
    .map(
      (product) => `
      <article class="card animate">
        <img src="${product.image}" alt="${product.name}" />
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
    });
  });
}

wireFilters();

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
    addProductForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const product = {
        name: document.querySelector("#product-name").value.trim(),
        price: document.querySelector("#product-price").value.trim(),
        category: document.querySelector("#product-category").value,
        material: document.querySelector("#product-material").value,
        priceRange: document.querySelector("#product-price-range").value,
        color: document.querySelector("#product-color").value,
        image: document.querySelector("#product-image").value.trim(),
      };
      const products = readJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
      products.unshift(product);
      writeJSON(STORAGE_KEYS.products, products);
      addProductForm.reset();
      renderAdminLists();
      alert("Product added");
    });
  }

  const addGalleryForm = document.querySelector("#add-gallery-form");
  if (addGalleryForm) {
    addGalleryForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const image = document.querySelector("#gallery-image").value.trim();
      const gallery = readJSON(STORAGE_KEYS.gallery, DEFAULT_GALLERY);
      gallery.unshift(image);
      writeJSON(STORAGE_KEYS.gallery, gallery);
      addGalleryForm.reset();
      renderAdminLists();
      alert("Image added");
    });
  }

  renderAdminLists();
}

function renderAdminLists() {
  const productList = document.querySelector("#admin-product-list");
  const galleryList = document.querySelector("#admin-gallery-list");
  if (!productList || !galleryList) return;

  const products = readJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
  const gallery = readJSON(STORAGE_KEYS.gallery, DEFAULT_GALLERY);

  productList.innerHTML = products
    .map(
      (item, idx) => `
      <div class="why-card" style="margin-bottom:10px;">
        <strong>${item.name}</strong> - ${item.price}
        <div><small>${item.category} | ${item.material} | ${item.color}</small></div>
        <button class="btn btn-outline dark" data-delete-product="${idx}" style="margin-top:8px;">Delete</button>
      </div>`
    )
    .join("");

  galleryList.innerHTML = gallery
    .map(
      (item, idx) => `
      <div class="why-card" style="margin-bottom:10px;">
        <img src="${item}" alt="Gallery" style="height:80px;object-fit:cover;border-radius:8px;margin-bottom:8px;" />
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
