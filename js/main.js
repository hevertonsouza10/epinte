const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

fetch("assets/data/site-content.json")
  .then((response) => {
    if (!response.ok) throw new Error(`Não foi possível carregar os textos editáveis (${response.status}).`);
    return response.json();
  })
  .then((content) => {
    document.querySelectorAll("[data-content]").forEach((element) => {
      const value = content[element.dataset.content];
      if (typeof value === "string" && value.trim()) element.textContent = value;
    });
  })
  .catch((error) => console.warn(error));

const progressBar = document.querySelector(".scroll-progress span");
const updateScrollProgress = () => {
  if (!progressBar) return;
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${available > 0 ? window.scrollY / available : 0})`;
  document.body.classList.toggle("has-scrolled", window.scrollY > 180);
};
window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll("[data-reveal]").forEach((item) => revealObserver.observe(item));
document.querySelectorAll(".piece-grid, .portfolio__rail, .solution-grid, .steps__list, .promise__items").forEach((group) => {
  [...group.children].forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 90, 360)}ms`;
  });
});

const manifesto = document.querySelector("[data-split]");
if (manifesto) {
  manifesto.innerHTML = manifesto.textContent
    .trim()
    .split(/\s+/)
    .map((word) => `<span class="word">${word}</span>`)
    .join(" ");

  const words = [...manifesto.querySelectorAll(".word")];
  const lightWords = () => {
    const rect = manifesto.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.8 - rect.top) / (rect.height + window.innerHeight * 0.4)));
    words.forEach((word, index) => word.classList.toggle("is-lit", index / words.length < progress));
  };
  window.addEventListener("scroll", lightWords, { passive: true });
  lightWords();
}

const cursor = document.querySelector(".cursor");
if (cursor && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  });

  document.querySelectorAll("a, button, canvas").forEach((item) => {
    item.addEventListener("pointerenter", () => cursor.classList.add("is-active"));
    item.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
  });

  document.querySelectorAll("[data-product], .collection-trigger").forEach((item) => {
    item.addEventListener("pointerenter", () => {
      cursor.classList.add("is-label");
      cursor.querySelector("span").textContent = item.matches("[data-product]") ? "ver peça" : "abrir";
    });
    item.addEventListener("pointerleave", () => cursor.classList.remove("is-label"));
  });
}

if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
  document.querySelectorAll(".magnetic").forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
    });
    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    });
  });

  document.querySelectorAll(".piece-card, .solution-card, .product-card, .buy-step").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${y * -5}deg`);
      card.style.setProperty("--tilt-y", `${x * 5}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
  });
}

const canvas = document.querySelector("#paintCanvas");
if (canvas) {
  const context = canvas.getContext("2d");
  const paletteButtons = document.querySelectorAll(".color");
  let painting = false;
  let color = "#29a8e8";

  const setCanvasSize = () => {
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    canvas.width = width * ratio;
    canvas.height = width * 0.84 * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    drawPiece(width, width * 0.84);
  };

  const elephantShape = (width, height) => {
    const cx = width / 2;
    const cy = height / 2;
    context.beginPath();
    context.ellipse(cx - width * 0.035, cy, width * 0.275, height * 0.275, 0, 0, Math.PI * 2);
    context.moveTo(cx + width * 0.19, cy - height * 0.14);
    context.bezierCurveTo(cx + width * 0.38, cy - height * 0.17, cx + width * 0.38, cy + height * 0.02, cx + width * 0.32, cy + height * 0.24);
    context.bezierCurveTo(cx + width * 0.29, cy + height * 0.34, cx + width * 0.23, cy + height * 0.28, cx + width * 0.25, cy + height * 0.14);
    context.closePath();
    context.rect(cx - width * 0.24, cy + height * 0.12, width * 0.08, height * 0.22);
    context.rect(cx + width * 0.09, cy + height * 0.12, width * 0.08, height * 0.22);
  };

  const drawPieceDetails = (width, height) => {
    const cx = width / 2;
    const cy = height / 2;
    context.strokeStyle = "rgba(39,39,39,.24)";
    context.lineWidth = 2;
    context.beginPath();
    context.ellipse(cx + width * 0.1, cy - height * 0.07, width * 0.09, height * 0.12, -.2, 0, Math.PI * 2);
    context.stroke();
    context.fillStyle = "#272727";
    context.beginPath();
    context.arc(cx + width * 0.205, cy - height * 0.13, 3.5, 0, Math.PI * 2);
    context.fill();
  };

  const drawPiece = (width, height) => {
    context.fillStyle = "#fffdf8";
    context.fillRect(0, 0, width, height);
    context.save();
    context.shadowColor = "rgba(39,39,39,.2)";
    context.shadowBlur = 10;
    context.shadowOffsetX = 9;
    context.shadowOffsetY = 12;
    elephantShape(width, height);
    context.fillStyle = "#f8f7f1";
    context.fill();
    context.restore();

    context.save();
    elephantShape(width, height);
    context.clip();
    for (let index = 0; index < width * 0.75; index += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 1.5 + .4;
      context.fillStyle = `rgba(39,39,39,${Math.random() * .12})`;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
    context.save();
    context.strokeStyle = "#d5d1c7";
    context.lineWidth = 2;
    elephantShape(width, height);
    context.stroke();
    drawPieceDetails(width, height);
    context.restore();
  };

  const positionFromEvent = (event) => {
    const rect = canvas.getBoundingClientRect();
    const source = event.touches ? event.touches[0] : event;
    return { x: source.clientX - rect.left, y: source.clientY - rect.top };
  };

  const paint = (event) => {
    if (!painting) return;
    event.preventDefault();
    const position = positionFromEvent(event);
    context.save();
    elephantShape(canvas.clientWidth, canvas.clientWidth * 0.84);
    context.clip();
    context.fillStyle = color;
    context.globalAlpha = 0.72;
    context.beginPath();
    context.arc(position.x, position.y, Math.max(20, canvas.clientWidth * 0.052), 0, Math.PI * 2);
    context.fill();
    context.restore();
    drawPieceDetails(canvas.clientWidth, canvas.clientWidth * 0.84);
  };

  canvas.addEventListener("pointerdown", (event) => {
    painting = true;
    canvas.setPointerCapture(event.pointerId);
    paint(event);
  });
  canvas.addEventListener("pointermove", paint);
  canvas.addEventListener("pointerup", () => painting = false);
  canvas.addEventListener("pointercancel", () => painting = false);

  paletteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      paletteButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      color = button.dataset.color;
    });
  });

  document.querySelector(".reset-paint").addEventListener("click", setCanvasSize);
  window.addEventListener("resize", setCanvasSize);
  setCanvasSize();
}

const menuButton = document.querySelector(".menu-toggle");
if (menuButton) {
  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
  };

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.setAttribute("aria-label", open ? "Abrir menu" : "Fechar menu");
    document.body.classList.toggle("menu-open", !open);
  });

  document.querySelectorAll(".site-header nav a, .site-header > .button").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
      closeMenu();
      menuButton.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

const filmToggle = document.querySelector(".film-toggle");
const brandFilm = document.querySelector(".brand-film video");
if (filmToggle && brandFilm) {
  filmToggle.addEventListener("click", () => {
    if (brandFilm.paused) {
      brandFilm.play();
      filmToggle.querySelector("span").textContent = "pausar";
      filmToggle.querySelector("b").textContent = "Ⅱ";
      filmToggle.setAttribute("aria-label", "Pausar vídeo");
    } else {
      brandFilm.pause();
      filmToggle.querySelector("span").textContent = "reproduzir";
      filmToggle.querySelector("b").textContent = "▶";
      filmToggle.setAttribute("aria-label", "Reproduzir vídeo");
    }
  });
}

document.querySelectorAll(".faq details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq details[open]").forEach((openItem) => {
      if (openItem !== item) openItem.removeAttribute("open");
    });
  });
});

const catalogModal = document.querySelector("#catalogModal");
if (catalogModal) {
  const catalogRepository = {
    async getCatalog() {
      const response = await fetch("assets/data/catalog.json");
      if (!response.ok) throw new Error(`Não foi possível carregar o catálogo (${response.status}).`);
      return response.json();
    }
  };

  const catalogTitle = document.querySelector("#catalogTitle");
  const catalogCount = document.querySelector("#catalogCount");
  const catalogDescription = document.querySelector("#catalogDescription");
  const catalogGrid = document.querySelector("#catalogGrid");
  const productDetail = document.querySelector("#productDetail");
  const detailContent = productDetail.querySelector(".product-detail__content");
  const detailEmpty = productDetail.querySelector(".product-detail__empty");
  const detailImage = document.querySelector("#detailImage");
  const detailCollection = document.querySelector("#detailCollection");
  const detailName = document.querySelector("#detailName");
  const detailDescription = document.querySelector("#detailDescription");
  const detailMaterial = document.querySelector("#detailMaterial");
  const detailSizes = document.querySelector("#detailSizes");
  const detailFinish = document.querySelector("#detailFinish");
  let activeCollection = null;
  let catalogData = null;
  let allProducts = [];

  const getProductImage = (product) =>
    product.imageUrl?.trim() || product.image?.trim() || "assets/mascote.png";

  const setCatalogUrl = (hash) => {
    history.replaceState(null, "", hash);
  };

  const resetProductDetail = ({ updateUrl = true } = {}) => {
    catalogModal.classList.remove("show-detail");
    catalogModal.dataset.step = "collection";
    catalogGrid.querySelectorAll(".catalog-product").forEach((button) => button.classList.remove("is-selected"));
    detailContent.hidden = true;
    detailEmpty.hidden = false;
    detailImage.removeAttribute("src");
    detailImage.alt = "";
    detailCollection.textContent = "";
    detailName.textContent = "";
    detailDescription.textContent = "";
    detailMaterial.textContent = "";
    detailSizes.textContent = "";
    detailFinish.textContent = "";
    productDetail.scrollTop = 0;
    if (updateUrl && activeCollection) setCatalogUrl(`#catalogo-${activeCollection}`);
  };

  const openCollection = (collectionId, { updateUrl = true } = {}) => {
    const collection = catalogData.collections[collectionId];
    if (!collection) return;
    activeCollection = collectionId;
    catalogModal.dataset.collection = collectionId;
    catalogModal.dataset.step = "collection";
    catalogTitle.textContent = collection.name;
    catalogCount.textContent = `${String(collection.products.length).padStart(2, "0")} peças`;
    catalogDescription.textContent = collection.description;
    catalogGrid.innerHTML = collection.products.map((product) => `
      <button class="catalog-product" type="button" data-catalog-product="${product.id}">
        <img src="${getProductImage(product)}" alt="${product.name} em EPS">
        <div><b>${product.name}</b><span>${product.tag}</span></div>
      </button>
    `).join("");

    resetProductDetail({ updateUrl: false });
    if (!catalogModal.open) catalogModal.showModal();
    document.body.classList.add("catalog-open");
    catalogGrid.scrollTop = 0;
    if (updateUrl) setCatalogUrl(`#catalogo-${collectionId}`);

    catalogGrid.querySelectorAll(".catalog-product").forEach((button) => {
      button.addEventListener("click", () => selectProduct(button.dataset.catalogProduct));
    });
  };

  const selectProduct = (productId, { updateUrl = true } = {}) => {
    const collection = catalogData.collections[activeCollection];
    const product = collection?.products.find((item) => item.id === productId);
    if (!product) return;
    const specs = { ...catalogData.defaults.specs, ...product.specs };
    const purchase = { ...catalogData.defaults.purchase, ...product.purchase };
    catalogGrid.querySelectorAll(".catalog-product").forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.catalogProduct === productId);
    });
    detailImage.src = getProductImage(product);
    detailImage.alt = `${product.name} em EPS`;
    detailCollection.textContent = `${collection.name} / ${product.tag}`;
    detailName.textContent = product.name;
    detailDescription.textContent = product.description;
    detailMaterial.textContent = specs.material;
    detailSizes.textContent = specs.sizes;
    detailFinish.textContent = specs.finish;
    const query = encodeURIComponent(`Epinte ${product.name} EPS`);
    productDetail.querySelector('[data-channel="mercado-livre"]').href = purchase.mercadoLivre || `https://lista.mercadolivre.com.br/${query}`;
    productDetail.querySelector('[data-channel="amazon"]').href = purchase.amazon || `https://www.amazon.com.br/s?k=${query}`;
    productDetail.querySelector('[data-channel="direto"]').href = purchase.direct;
    productDetail.querySelector('[data-channel="atacado"]').href = purchase.wholesale;
    detailEmpty.hidden = true;
    detailContent.hidden = false;
    catalogModal.classList.add("show-detail");
    catalogModal.dataset.step = "product";
    productDetail.scrollTop = 0;
    if (updateUrl) setCatalogUrl(`#produto-${productId}`);
  };

  const closeCatalog = ({ updateUrl = true } = {}) => {
    catalogModal.close();
    document.body.classList.remove("catalog-open");
    resetProductDetail({ updateUrl: false });
    activeCollection = null;
    if (updateUrl) setCatalogUrl("#pecas");
  };

  document.querySelector(".catalog-close").addEventListener("click", closeCatalog);
  document.querySelector(".product-detail__back").addEventListener("click", resetProductDetail);
  catalogModal.addEventListener("cancel", () => {
    document.body.classList.remove("catalog-open");
    resetProductDetail({ updateUrl: false });
    activeCollection = null;
    setCatalogUrl("#pecas");
  });
  catalogModal.addEventListener("click", (event) => {
    if (event.target === catalogModal) closeCatalog();
  });
  productDetail.querySelectorAll('a[href="#contato"]').forEach((link) => {
    link.addEventListener("click", closeCatalog);
  });
  productDetail.addEventListener("pointermove", (event) => {
    productDetail.style.setProperty("--spot-x", `${event.clientX}px`);
    productDetail.style.setProperty("--spot-y", `${event.clientY}px`);
  });

  const initCatalog = async () => {
    try {
      catalogData = await catalogRepository.getCatalog();
      allProducts = Object.entries(catalogData.collections).flatMap(([collectionId, collection]) =>
        collection.products.map((product) => ({ ...product, collectionId }))
      );

      document.querySelectorAll("[data-collection-card]").forEach((card) => {
        const collection = catalogData.collections[card.dataset.collectionCard];
        if (!collection) return;
        const count = collection.products.length;
        card.querySelector("[data-collection-name]").textContent = collection.name;
        card.querySelector("[data-collection-count]").textContent = `${String(count).padStart(2, "0")} ${count === 1 ? "produto" : "produtos"}`;
        card.querySelector("[data-collection-description]").textContent = collection.description;
        card.querySelector("[data-collection-preview]").innerHTML = collection.products.slice(0, 3).map((product, index) => `
          <span class="collection-preview__item collection-preview__item--${index + 1}">
            <img src="${getProductImage(product)}" alt="">
          </span>
        `).join("");

        const openCardCollection = () => openCollection(card.dataset.collectionCard);
        card.addEventListener("click", openCardCollection);
        card.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openCardCollection();
          }
        });
      });

      const applyCatalogRoute = () => {
        const catalogHash = window.location.hash.match(/^#catalogo-(.+)$/);
        const productHash = window.location.hash.match(/^#produto-(.+)$/);
        if (catalogHash && catalogData.collections[catalogHash[1]]) {
          openCollection(catalogHash[1], { updateUrl: false });
        } else if (productHash) {
          const product = allProducts.find((item) => item.id === productHash[1]);
          if (product) {
            openCollection(product.collectionId, { updateUrl: false });
            selectProduct(product.id, { updateUrl: false });
          }
        } else if (catalogModal.open) {
          closeCatalog({ updateUrl: false });
        }
      };

      window.addEventListener("hashchange", applyCatalogRoute);
      applyCatalogRoute();
    } catch (error) {
      console.error(error);
      document.querySelectorAll("[data-collection-card]").forEach((card) => {
        card.setAttribute("aria-disabled", "true");
      });
    }
  };

  initCatalog();
}
