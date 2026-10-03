/* Lógica partilhada por todas as páginas (usa CONFIG e PRODUCTS de data.js) */
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const PAGE = document.body.dataset.page;
const SHOE = '<svg class="ph" viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 30V20c6 1 11-1 14-6l4 3c3 2 6 3 9 4 6 1 12 3 15 7 .5 1 .5 2 0 2H4a1 1 0 0 1-1-1Z"/><path d="M3 34h58"/></svg>';

/* ---------- Helpers ---------- */
const byId = id => PRODUCTS.find(p => p.id === id);
const priceText = p => p.price == null ? "Preço sob consulta" : `${Number(p.price).toLocaleString("pt-PT")} ${CONFIG.currency}`;
const media = p => p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">` : SHOE;
const waLink = text => `https://wa.me/${CONFIG.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`; // sem número, o WhatsApp deixa escolher o contacto
const productUrl = p => `produto.html?id=${encodeURIComponent(p.id)}`;

/* ---------- Carrinho (guardado no navegador) ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("keepsteps_cart")) || []; } catch { cart = []; }
const saveCart = () => {
  try { localStorage.setItem("keepsteps_cart", JSON.stringify(cart)); } catch { /* sem armazenamento: carrinho só nesta página */ }
  updateBadge();
};
const cartCount = () => cart.reduce((n, i) => n + i.qty, 0);
function updateBadge() {
  const b = $("#cartCount");
  if (b) { b.textContent = cartCount(); b.dataset.n = cartCount(); }
}
function addToCart(id, size, color, qty) {
  const found = cart.find(i => i.id === id && i.size === size && i.color === color);
  found ? found.qty += qty : cart.push({ id, size, color, qty });
  saveCart();
}

/* ---------- Cabeçalho e rodapé ---------- */
function renderChrome() {
  const links = [["index.html", "Início", "home"], ["catalogo.html", "Catálogo", "catalogo"], ["sobre.html", "Sobre nós", "sobre"], ["contacto.html", "Contacto", "contacto"]];
  const active = PAGE === "produto" ? "catalogo" : PAGE;
  $("#site-header").innerHTML = `
  <header class="header${PAGE === "home" ? "" : " solid"}" id="header">
    <div class="container header__inner">
      <a href="index.html" class="brand" aria-label="${esc(CONFIG.storeName)}">
        <img src="assets/images/logo.png" alt="${esc(CONFIG.storeName)}" class="brand__logo" height="44">
      </a>
      <button class="menu-btn" id="menuBtn" aria-label="Abrir menu" aria-expanded="false" aria-controls="nav"><span></span><span></span></button>
      <nav class="nav" id="nav" aria-label="Principal">
        <form class="nav-search" id="navSearch" role="search">
          <input type="search" id="navSearchInput" placeholder="Pesquisar sapatos" aria-label="Pesquisar produtos">
        </form>
        ${links.map(([h, t, k]) => `<a href="${h}"${k === active ? ' class="active" aria-current="page"' : ""}>${t}</a>`).join("")}
         <a href="carrinho.html" class="cart-link${PAGE === "carrinho" ? " active" : ""}" aria-label="Carrinho">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h9.3a1 1 0 0 0 1-.8L21 7H6"/></svg>
          <span class="cart-count" id="cartCount" data-n="0">0</span>
        </a>
      </nav>
    </div>
  </header>`;
  $("#site-footer").innerHTML = `
  <footer class="footer"><div class="container">
    <span>© ${new Date().getFullYear()} ${esc(CONFIG.storeName)}</span>
    <a href="${esc(CONFIG.instagram)}" target="_blank" rel="noopener">Instagram</a>
  </div></footer>
  <a href="${waLink("Olá! Gostaria de saber mais sobre os sapatos da " + CONFIG.storeName + ".")}" class="wa-float" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.800-1.100-4.500-4-4.700-4.200-.1-.2-1.100-1.500-1.100-2.800s.7-2 1-2.300c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.900c.1.200.1.400 0 .5l-.4.600-.4.400c-.1.200-.3.300-.1.600.2.300.8 1.300 1.700 2.100 1.200 1 2.100 1.300 2.400 1.500.3.100.5.100.6-.1l.9-1.100c.2-.3.400-.2.700-.1l1.800.9c.3.100.5.200.5.300.1.200.1.700-.1 1.300Z"/></svg>
  </a>`;
  const btn = $("#menuBtn"), nav = $("#nav"), header = $("#header");

  $("#navSearch").addEventListener("submit", e => {
    e.preventDefault();
    const v = $("#navSearchInput").value.trim();
    location.href = v ? `catalogo.html?q=${encodeURIComponent(v)}` : "catalogo.html";
  });
  const set = open => {
    nav.classList.toggle("open", open); header.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open); btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  btn.addEventListener("click", () => set(!nav.classList.contains("open")));
  nav.addEventListener("click", e => { if (e.target.closest("a")) set(false); });
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 40);
  onScroll(); addEventListener("scroll", onScroll, { passive: true });
  updateBadge();
}

/* ---------- Cartão de produto ---------- */
const cardHTML = p => `
  <article class="card${p.available ? "" : " is-out"}">
    <a class="card__media" href="${productUrl(p)}" aria-label="Ver ${esc(p.name)}">
      ${media(p)}${p.available ? (p.featured ? '<span class="badge">Novo</span>' : "") : '<span class="badge badge--out">Esgotado</span>'}
    </a>
    <div class="card__body">
      <span class="card__cat">${esc(p.category)}</span>
      <h3 class="card__name">${esc(p.name)}</h3>
      <span class="card__price${p.price == null ? " consult" : ""}">${esc(priceText(p))}</span>
      <div class="card__actions"><a class="btn btn--dark" href="${productUrl(p)}">Ver produto</a></div>
    </div>
  </article>`;

/* ---------- Página inicial ---------- */
function initHome() {
  $("#heroName").textContent = CONFIG.storeName;
  $("#tagline").textContent = CONFIG.tagline;
  const feat = PRODUCTS.filter(p => p.featured);
  $("#featured").innerHTML = feat.length ? feat.map(cardHTML).join("") : '<p class="todo">Marque produtos com featured: true em data.js para aparecerem aqui.</p>';
  $("#cats").innerHTML = CONFIG.categories.map(c => `<a href="catalogo.html?cat=${encodeURIComponent(c)}">${esc(c)}</a>`).join("");
  $("#heroWa").href = waLink("Olá! Gostaria de saber mais sobre os sapatos da " + CONFIG.storeName + ".");
  $("#heroWa").target = "_blank"; $("#heroWa").rel = "noopener";
}

/* ---------- Catálogo ---------- */
function initCatalog() {
  const params = new URLSearchParams(location.search);
  let cat = CONFIG.categories.includes(params.get("cat")) ? params.get("cat") : "Todos", q = params.get("q") || "";
  const chips = () => {
    $("#filters").innerHTML = ["Todos", ...CONFIG.categories].map(c =>
      `<button class="chip${c === cat ? " active" : ""}" data-cat="${esc(c)}" aria-pressed="${c === cat}">${esc(c)}</button>`).join("");
  };
  const draw = () => {
    const s = q.trim().toLowerCase();
    const list = PRODUCTS.filter(p => (cat === "Todos" || p.category === cat) && (!s || `${p.name} ${p.category}`.toLowerCase().includes(s)));
    $("#grid").innerHTML = list.map(cardHTML).join("");
    $("#empty").hidden = list.length > 0;
  };
  $("#search").value = q;
  $("#navSearchInput").value = q;
  chips(); draw();
  $("#filters").addEventListener("click", e => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    cat = b.dataset.cat; chips(); draw();
    history.replaceState(null, "", cat === "Todos" ? "catalogo.html" : `catalogo.html?cat=${encodeURIComponent(cat)}`);
  });
  $("#search").addEventListener("input", e => { q = e.target.value; draw(); });
}

/* ---------- Página do produto ---------- */
function initProduct() {
  const p = byId(new URLSearchParams(location.search).get("id")), root = $("#product");
  if (!p) {
    root.innerHTML = '<div><h1 class="section__title">Produto não encontrado</h1><a class="btn btn--dark" href="catalogo.html">Ver catálogo</a></div>';
    return;
  }
  document.title = `${p.name} | ${CONFIG.storeName}`;
  let size = null, color = null, qty = 1;
  const optBlock = (label, key, items) => items.length ? `
    <div class="opt"><span class="opt__label">${label}: <small id="sel-${key}">escolha uma opção</small></span>
    <div class="opts" id="opts-${key}">${items.join("")}</div></div>` : "";
  const sizeBtns = p.sizes.map(s => { const off = p.unavailableSizes.includes(s);
    return `<button class="opt-btn" data-size="${esc(s)}"${off ? " disabled title=Esgotado" : ""}>${esc(s)}</button>`; });
  const colorBtns = p.colors.map(c => { const off = p.unavailableColors.includes(c.name);
    return `<button class="opt-btn" data-color="${esc(c.name)}"${off ? " disabled title=Esgotado" : ""}><span class="swatch" style="background:${esc(c.hex)}"></span>${esc(c.name)}</button>`; });

  root.innerHTML = `
    <div class="product__media">${media(p)}</div>
    <div class="product__info">
      <span class="card__cat">${esc(p.category)}</span>
      <h1>${esc(p.name)}</h1>
      <span class="product__price">${esc(priceText(p))}</span>
      <span class="stock ${p.available ? "ok" : "out"}">${p.available ? "Disponível" : "Esgotado"}</span>
      <p>${p.description ? esc(p.description) : '<span class="todo">Descrição por adicionar.</span>'}</p>
      ${p.available ? optBlock("Tamanho", "size", sizeBtns) + optBlock("Cor", "color", colorBtns) : ""}
      ${p.available ? `<div class="opt"><span class="opt__label">Quantidade</span>
        <div class="qty"><button id="qMinus" aria-label="Menos">−</button><span id="qVal">1</span><button id="qPlus" aria-label="Mais">+</button></div></div>` : ""}
      <p class="msg" id="msg" role="status"></p>
      <div class="product__actions">
        <button class="btn btn--dark" id="addBtn"${p.available ? "" : " disabled"}>${p.available ? "Adicionar ao carrinho" : "Esgotado"}</button>
        <a class="btn btn--wa" id="waBtn" target="_blank" rel="noopener"${p.available ? "" : ' hidden'}>Pedir já pelo WhatsApp</a>
      </div>
    </div>`;

  const msg = (t, ok) => { $("#msg").textContent = t; $("#msg").className = "msg" + (ok ? " ok" : ""); };
  const missing = () => (p.sizes.length && !size ? "o tamanho" : p.colors.length && !color ? "a cor" : null);
  const line = () => `${p.name}${size ? `, tamanho ${size}` : ""}${color ? `, cor ${color}` : ""}, ${qty}x`;
  const refreshWa = () => { $("#waBtn").href = waLink(`Olá! Tenho interesse no produto: ${line()}. Gostaria de saber mais informações.`); };
  refreshWa();

  root.addEventListener("click", e => {
    const b = e.target.closest("button, a"); if (!b) return;
    if (b.dataset.size) { size = b.dataset.size; $("#sel-size").textContent = size; }
    if (b.dataset.color) { color = b.dataset.color; $("#sel-color").textContent = color; }
    if (b.dataset.size || b.dataset.color) {
      b.parentElement.querySelectorAll(".opt-btn").forEach(x => x.classList.toggle("active", x === b)); msg("");
    }
    if (b.id === "qMinus") qty = Math.max(1, qty - 1);
    if (b.id === "qPlus") qty = Math.min(20, qty + 1);
    if (b.id === "qMinus" || b.id === "qPlus") $("#qVal").textContent = qty;
    if (b.id === "waBtn" && missing()) { e.preventDefault(); msg(`Escolha ${missing()} antes de continuar.`); return; }
    if (b.id === "addBtn") {
      if (missing()) return msg(`Escolha ${missing()} antes de adicionar.`);
      addToCart(p.id, size, color, qty); msg("Adicionado ao carrinho.", true);
    }
    refreshWa();
  });
}

/* ---------- Carrinho ---------- */
function initCart() {
  const root = $("#cart");
  const draw = () => {
    cart = cart.filter(i => byId(i.id));
    if (!cart.length) {
      root.innerHTML = '<div><p>O seu carrinho está vazio.</p><br><a class="btn btn--dark" href="catalogo.html">Ver catálogo</a></div>'; return;
    }
    const allPriced = cart.every(i => byId(i.id).price != null);
    const total = cart.reduce((n, i) => n + (byId(i.id).price || 0) * i.qty, 0);
    root.innerHTML = `
      <div class="cart__items">${cart.map((i, k) => { const p = byId(i.id); return `
        <div class="line">
          <div class="line__img">${media(p)}</div>
          <div><a class="line__name" href="${productUrl(p)}">${esc(p.name)}</a>
            <div class="line__meta">${[i.size && "Tam. " + esc(i.size), i.color && esc(i.color)].filter(Boolean).join(" · ") || "&nbsp;"}</div>
            <div class="line__meta">${esc(priceText(p))}</div></div>
          <div class="line__side">
            <div class="qty"><button data-dec="${k}" aria-label="Menos">−</button><span>${i.qty}</span><button data-inc="${k}" aria-label="Mais">+</button></div>
            <button class="link-btn" data-del="${k}">Remover</button>
          </div>
        </div>`; }).join("")}</div>
      <aside class="summary">
        <div class="summary__total"><span>Total</span><span>${allPriced ? Number(total).toLocaleString("pt-PT") + " " + CONFIG.currency : "A confirmar"}</span></div>
        <small>O pedido é finalizado no WhatsApp, onde combinamos pagamento e entrega.</small>
        <a class="btn btn--wa btn--big" id="checkout" target="_blank" rel="noopener">Finalizar no WhatsApp</a>
        <button class="link-btn" id="clear">Esvaziar carrinho</button>
      </aside>`;
    const lines = cart.map((i, k) => { const p = byId(i.id);
      return `${k + 1}. ${p.name}${i.size ? ` | Tam. ${i.size}` : ""}${i.color ? ` | Cor ${i.color}` : ""} | ${i.qty}x${p.price != null ? ` | ${priceText(p)}` : ""}`; });
    $("#checkout").href = waLink(`Olá! Gostaria de fazer o seguinte pedido:\n\n${lines.join("\n")}${allPriced ? `\n\nTotal: ${Number(total).toLocaleString("pt-PT")} ${CONFIG.currency}` : ""}\n\nPode confirmar a disponibilidade, por favor?`);
  };
  draw();
  root.addEventListener("click", e => {
    const d = e.target.dataset; if (!d) return;
    if (d.inc != null) cart[d.inc].qty = Math.min(20, cart[d.inc].qty + 1);
    else if (d.dec != null) cart[d.dec].qty = Math.max(1, cart[d.dec].qty - 1);
    else if (d.del != null) cart.splice(d.del, 1);
    else if (e.target.id === "clear") cart = [];
    else return;
    saveCart(); draw();
  });
}

/* ---------- Sobre nós e Contacto ---------- */
function initAbout() {
  $("#aboutText").innerHTML = CONFIG.about.length ? CONFIG.about.map(t => `<p>${esc(t)}</p>`).join("")
    : '<p class="todo">Texto "Sobre nós" por adicionar (campo about em data.js).</p>';
}
function initContact() {
  const rows = [
    ["WhatsApp", CONFIG.whatsapp && `<a href="${waLink("Olá!")}" target="_blank" rel="noopener">+${esc(CONFIG.whatsapp.replace(/\D/g, ""))}</a>`],
    ["Instagram", `<a href="${esc(CONFIG.instagram)}" target="_blank" rel="noopener">@keep_steps</a>`],
    ["Telefone", CONFIG.phone && `<a href="tel:${esc(CONFIG.phone.replace(/[^\d+]/g, ""))}">${esc(CONFIG.phone)}</a>`],
    ["Localização", CONFIG.location && esc(CONFIG.location)],
    ["Horário", CONFIG.hours && esc(CONFIG.hours)]
  ];
  $("#contactList").innerHTML = rows.map(([l, v]) => `<li><b>${l}</b>${v ? `<span>${v}</span>` : '<span class="todo">Por adicionar</span>'}</li>`).join("");
  $("#contactWa").href = waLink("Olá! Gostaria de saber mais sobre os sapatos da " + CONFIG.storeName + ".");
}

renderChrome();
({ home: initHome, catalogo: initCatalog, produto: initProduct, carrinho: initCart, sobre: initAbout, contacto: initContact })[PAGE]?.();
