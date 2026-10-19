const products = [
  { id: 1, name: "Portátil Nova 14", category: "Computadores", price: 2499000, icon: "💻", description: "Equipo portátil para estudio, trabajo y tareas cotidianas." },
  { id: 2, name: "Celular Horizonte", category: "Celulares", price: 1299000, icon: "📱", description: "Teléfono inteligente con pantalla amplia y cámara integrada." },
  { id: 3, name: "Audífonos Sonora", category: "Accesorios", price: 189000, icon: "🎧", description: "Audífonos para escuchar contenido y atender llamadas." },
  { id: 4, name: "Tableta Prisma", category: "Tabletas", price: 899000, icon: "▭", description: "Tableta ligera para leer, estudiar y consultar documentos." },
  { id: 5, name: "Teclado Compacto", category: "Accesorios", price: 145000, icon: "⌨️", description: "Teclado compacto para complementar tu espacio de trabajo." },
  { id: 6, name: "Monitor Visión 24", category: "Computadores", price: 679000, icon: "🖥️", description: "Monitor para ampliar el área de trabajo y visualización." }
];

const productGrid = document.querySelector("#product-grid");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const resultsSummary = document.querySelector("#results-summary");
const noResults = document.querySelector("#no-results");
const statusMessage = document.querySelector("#status-message");
const cartPanel = document.querySelector("#cart-panel");
const cartToggle = document.querySelector("#cart-toggle");
const cartClose = document.querySelector("#cart-close");
const cartCount = document.querySelector("#cart-count");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartTotal = document.querySelector("#cart-total");
const clearCartButton = document.querySelector("#clear-cart");

let visibleProducts = [...products];
let cart = [];

function formatMoney(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", maximumFractionDigits: 0
  }).format(value);
}

function renderProducts(items) {
  productGrid.replaceChildren();
  noResults.hidden = items.length > 0;
  resultsSummary.textContent = items.length === products.length
    ? `Mostrando los ${items.length} productos disponibles.`
    : `Se encontraron ${items.length} ${items.length === 1 ? "producto" : "productos"}.`;

  items.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    const visual = document.createElement("div");
    visual.className = "product-visual";
    visual.setAttribute("aria-hidden", "true");
    visual.textContent = product.icon;

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";
    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatMoney(product.price);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "primary-button";
    button.textContent = "Agregar al carrito";
    button.setAttribute("aria-label", `Agregar ${product.name} al carrito`);
    button.addEventListener("click", () => addToCart(product.id));

    bottom.append(price, button);
    card.append(visual, category, title, description, bottom);
    productGrid.append(card);
  });
}

function applyFilters() {
  const query = searchInput.value.trim().toLocaleLowerCase("es");
  visibleProducts = products.filter((product) =>
    `${product.name} ${product.category} ${product.description}`.toLocaleLowerCase("es").includes(query)
  );

  switch (sortSelect.value) {
    case "price-asc": visibleProducts.sort((a, b) => a.price - b.price); break;
    case "price-desc": visibleProducts.sort((a, b) => b.price - a.price); break;
    case "name": visibleProducts.sort((a, b) => a.name.localeCompare(b.name, "es")); break;
    default: break;
  }
  renderProducts(visibleProducts);
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) {
    showStatus("No fue posible agregar el producto. Intenta nuevamente.");
    return;
  }
  cart.push(product);
  renderCart();
  showStatus(`${product.name} se agregó al carrito.`);
}

function renderCart() {
  cartCount.textContent = String(cart.length);
  cartCount.setAttribute("aria-label", `${cart.length} ${cart.length === 1 ? "producto" : "productos"}`);
  cartItems.replaceChildren();
  cartEmpty.hidden = cart.length > 0;
  cart.forEach((product, index) => {
    const item = document.createElement("li");
    item.textContent = `${product.name} — ${formatMoney(product.price)} `;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "secondary-button";
    remove.textContent = "Quitar";
    remove.setAttribute("aria-label", `Quitar ${product.name} del carrito`);
    remove.addEventListener("click", () => {
      cart.splice(index, 1);
      renderCart();
      showStatus(`${product.name} se quitó del carrito.`);
    });
    item.append(remove);
    cartItems.append(item);
  });
  cartTotal.textContent = formatMoney(cart.reduce((sum, product) => sum + product.price, 0));
}

function showStatus(message) {
  statusMessage.textContent = message;
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applyFilters();
  if (visibleProducts.length === 0) showStatus("No se encontraron productos. Prueba otro término de búsqueda.");
  else showStatus(`Búsqueda completada. ${visibleProducts.length} productos disponibles.`);
});

searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);

cartToggle.addEventListener("click", () => {
  const opening = cartPanel.hidden;
  cartPanel.hidden = !opening;
  cartToggle.setAttribute("aria-expanded", String(opening));
  if (opening) cartPanel.querySelector("h2").focus?.();
});
cartClose.addEventListener("click", () => {
  cartPanel.hidden = true;
  cartToggle.setAttribute("aria-expanded", "false");
  cartToggle.focus();
});
clearCartButton.addEventListener("click", () => {
  if (cart.length === 0) {
    showStatus("El carrito ya está vacío.");
    return;
  }
  cart = [];
  renderCart();
  showStatus("Se vació el carrito.");
});

renderProducts(products);
renderCart();
