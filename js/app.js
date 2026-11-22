/* à la PAGE storefront logic: filters, product dialog, bag, WhatsApp checkout. */
(() => {
  "use strict";

  const { STORE, PRODUCTS, CATEGORIES } = window.ALA;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const money = (n) => `${STORE.currency}${n}`;
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Storage (safe if blocked) ---------- */
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem("ala:" + key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem("ala:" + key, JSON.stringify(value));
      } catch (e) {
        /* storage unavailable: the bag still works for this visit */
      }
    }
  };

  /* ---------- State ---------- */
  const validCart = (store.get("cart", []) || []).filter(
    (l) => l && byId(l.id) && byId(l.id).sizes.includes(l.size) && l.qty > 0
  );
  const state = {
    filter: "All",
    sort: "featured",
    query: "",
    savedOnly: false,
    cart: validCart,
    saved: (store.get("saved", []) || []).filter((id) => byId(id)),
    customer: store.get("customer", { name: "", area: "" }),
    current: null,
    size: null,
    imageIndex: 0,
    lastFocus: null
  };

  /* ---------- Media helpers ---------- */
  function placeholder(p) {
    return `<div class="ph" style="--tone:${esc(p.tone)}" role="img" aria-label="${esc(p.name)}, photo coming soon">
      <span class="mark"><b>à la</b></span><small>Photo coming soon</small></div>`;
  }
  function media(p, index = 0, alt) {
    const src = p.images[index];
    if (!src) return placeholder(p);
    return `<img src="${esc(src)}" alt="${esc(alt || p.name)}" loading="lazy" decoding="async">`;
  }

  /* ---------- Shop grid ---------- */
  function visibleProducts() {
    const q = state.query.trim().toLowerCase();
    let list = PRODUCTS.filter((p) => {
      if (state.filter !== "All" && p.category !== state.filter) return false;
      if (state.savedOnly && !state.saved.includes(p.id)) return false;
      if (q && !`${p.name} ${p.category} ${p.color}`.toLowerCase().includes(q)) return false;
      return true;
    });
    if (state.sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (state.sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (state.sort === "new")
      list = [...list].sort((a, b) => (b.badge === "New") - (a.badge === "New"));
    return list;
  }

  function renderChips() {
    const labels = ["All", ...CATEGORIES];
    $("#chips").innerHTML = labels
      .map(
        (c) =>
          `<button class="chip" data-filter="${esc(c)}" aria-pressed="${state.filter === c}">${esc(c)}</button>`
      )
      .join("");
  }

  function cardHTML(p) {
    const saved = state.saved.includes(p.id);
    const price = p.oldPrice
      ? `${money(p.price)}<s>${money(p.oldPrice)}</s>`
      : money(p.price);
    return `<article class="card">
      <button class="card__open" data-open="${esc(p.id)}" aria-label="View ${esc(p.name)}, ${money(p.price)}">
        <span class="card__media">
          ${media(p, 0)}
          ${p.images[1] ? `<span class="card__alt">${media(p, 1)}</span>` : ""}
          ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ""}
        </span>
        <span class="card__info">
          <span class="card__name">${esc(p.name)}</span>
          <span class="price">${price}</span>
        </span>
      </button>
      <button class="heart" data-save="${esc(p.id)}" aria-pressed="${saved}" aria-label="${saved ? "Remove from" : "Save to"} saved pieces: ${esc(p.name)}">
        <svg viewBox="0 0 24 24" width="22" height="22" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5c0 6.1-8 11-8 11Z"/></svg>
      </button>
    </article>`;
  }

  function renderGrid() {
    const list = visibleProducts();
    $("#grid").innerHTML = list.map(cardHTML).join("");
    $("#empty").hidden = list.length > 0;
    $("#grid").hidden = list.length === 0;
    const scope = state.savedOnly ? "saved " : "";
    $("#resultCount").textContent = `${list.length} ${scope}${list.length === 1 ? "piece" : "pieces"}`;
  }

  function renderSavedBadge() {
    const badge = $("#savedCount");
    badge.hidden = state.saved.length === 0;
    badge.textContent = state.saved.length;
    const btn = $("#savedBtn");
    btn.setAttribute("aria-pressed", String(state.savedOnly));
    btn.setAttribute("aria-label", state.savedOnly ? "Show all pieces" : "Show saved pieces");
  }

  function toggleSaved(id) {
    const i = state.saved.indexOf(id);
    if (i === -1) {
      state.saved.push(id);
      toast("Saved");
    } else {
      state.saved.splice(i, 1);
      toast("Removed from saved");
    }
    store.set("saved", state.saved);
    renderSavedBadge();
    renderGrid();
    if (state.current === id) renderProduct(id);
  }

  /* ---------- Product dialog ---------- */
  const productDialog = $("#productDialog");

  function renderProduct(id) {
    const p = byId(id);
    if (!p) return;
    const price = p.oldPrice ? `${money(p.price)}<s>${money(p.oldPrice)}</s>` : money(p.price);
    const saved = state.saved.includes(p.id);
    const imgs = p.images.length ? p.images : [null];
    const main = p.images.length
      ? `<img src="${esc(p.images[state.imageIndex])}" alt="${esc(p.name)}, view ${state.imageIndex + 1} of ${p.images.length}">`
      : placeholder(p);
    const thumbs =
      p.images.length > 1
        ? `<div class="gallery__thumbs">${imgs
            .map(
              (src, i) =>
                `<button class="thumb" data-thumb="${i}" aria-label="Show photo ${i + 1}" aria-current="${i === state.imageIndex}"><img src="${esc(src)}" alt=""></button>`
            )
            .join("")}</div>`
        : "";
    const sizes = p.sizes
      .map(
        (s) =>
          `<button class="size" data-size="${esc(s)}" aria-pressed="${state.size === s}">${esc(s)}</button>`
      )
      .join("");
    const waAsk = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(
      `Hello à la PAGE, is the ${p.name} (${p.color}) available?`
    )}`;

    $("#productBody").innerHTML = `
      <div class="gallery">
        <div class="gallery__main">${main}</div>
        ${thumbs}
      </div>
      <div class="pinfo">
        <h2 id="pdName">${esc(p.name)}</h2>
        <p class="price">${price}</p>
        <p class="pinfo__color">Colour: ${esc(p.color)}</p>
        <p class="pinfo__label" id="sizeLabel">Size</p>
        <div class="sizes" role="group" aria-labelledby="sizeLabel">${sizes}</div>
        <p class="size-msg" id="sizeMsg" role="alert"></p>
        <button class="btn btn--pink" id="addBtn">Add to bag</button>
        <button class="btn btn--outline" data-save="${esc(p.id)}" aria-pressed="${saved}">${saved ? "Saved" : "Save for later"}</button>
        <p class="pinfo__desc">${esc(p.desc)}</p>
        <ul>${p.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>
        <p class="pinfo__ask"><a class="link-btn" href="${waAsk}" target="_blank" rel="noopener">Ask about this piece on WhatsApp</a></p>
      </div>`;
  }

  function openProduct(id, trigger) {
    const p = byId(id);
    if (!p) return;
    state.current = id;
    state.imageIndex = 0;
    state.size = p.sizes.length === 1 ? p.sizes[0] : null;
    state.lastFocus = trigger || document.activeElement;
    renderProduct(id);
    if (!productDialog.open) productDialog.showModal();
    productDialog.scrollTop = 0;
  }

  productDialog.addEventListener("click", (e) => {
    if (e.target === productDialog) return productDialog.close();
    const t = e.target.closest("button");
    if (!t) return;
    if (t.matches("[data-close]")) return productDialog.close();
    if (t.dataset.thumb !== undefined) {
      state.imageIndex = Number(t.dataset.thumb);
      return renderProduct(state.current);
    }
    if (t.dataset.size) {
      state.size = t.dataset.size;
      renderProduct(state.current);
      return;
    }
    if (t.dataset.save) return toggleSaved(t.dataset.save);
    if (t.id === "addBtn") {
      if (!state.size) {
        $("#sizeMsg").textContent = "Choose a size to add this piece to your bag.";
        return $(".size", productDialog).focus();
      }
      addToCart(state.current, state.size);
      productDialog.close();
      openDrawer();
    }
  });
  productDialog.addEventListener("close", () => {
    state.current = null;
    if (state.lastFocus && document.contains(state.lastFocus)) state.lastFocus.focus();
  });

  /* ---------- Bag ---------- */
  const drawer = $("#drawer");

  const cartCount = () => state.cart.reduce((n, l) => n + l.qty, 0);
  const cartTotal = () => state.cart.reduce((n, l) => n + byId(l.id).price * l.qty, 0);
  const saveCart = () => store.set("cart", state.cart);

  function addToCart(id, size) {
    const line = state.cart.find((l) => l.id === id && l.size === size);
    if (line) line.qty = Math.min(line.qty + 1, 9);
    else state.cart.push({ id, size, qty: 1 });
    saveCart();
    renderBag();
  }
  function setQty(id, size, qty) {
    const line = state.cart.find((l) => l.id === id && l.size === size);
    if (!line) return;
    line.qty = qty;
    if (line.qty <= 0) state.cart = state.cart.filter((l) => l !== line);
    line.qty = Math.min(line.qty, 9);
    saveCart();
    renderBag();
  }
  function removeLine(id, size) {
    state.cart = state.cart.filter((l) => !(l.id === id && l.size === size));
    saveCart();
    renderBag();
  }

  function orderMessage() {
    const lines = state.cart.map((l, i) => {
      const p = byId(l.id);
      return `${i + 1}. ${p.name} (${p.color}), size ${l.size}, qty ${l.qty}, ${money(p.price * l.qty)}`;
    });
    const parts = [
      "Hello à la PAGE, I would like to order:",
      "",
      ...lines,
      "",
      `Total: ${money(cartTotal())}`
    ];
    if (state.customer.name.trim()) parts.push(`Name: ${state.customer.name.trim()}`);
    if (state.customer.area.trim()) parts.push(`Delivery area: ${state.customer.area.trim()}`);
    return parts.join("\n");
  }

  function renderBag() {
    const count = cartCount();
    const badge = $("#bagCount");
    badge.hidden = count === 0;
    badge.textContent = count;

    const body = $("#drawerBody");
    const foot = $("#drawerFoot");

    if (!state.cart.length) {
      body.innerHTML = `<div class="drawer__empty"><p>Your bag is empty. Add a piece to get started.</p><button class="btn btn--dark" data-close>Keep shopping</button></div>`;
      foot.innerHTML = "";
      return;
    }

    body.innerHTML = state.cart
      .map((l) => {
        const p = byId(l.id);
        return `<div class="line">
          <div class="line__img">${media(p, 0, "")}</div>
          <div>
            <p class="line__name">${esc(p.name)}</p>
            <p class="line__meta">${esc(p.color)}, size ${esc(l.size)}</p>
            <div class="line__row">
              <div class="qty" role="group" aria-label="Quantity for ${esc(p.name)}">
                <button data-dec="${esc(l.id)}|${esc(l.size)}" aria-label="One fewer">−</button>
                <output>${l.qty}</output>
                <button data-inc="${esc(l.id)}|${esc(l.size)}" aria-label="One more">+</button>
              </div>
              <strong>${money(p.price * l.qty)}</strong>
            </div>
            <button class="link-btn line__remove" data-remove="${esc(l.id)}|${esc(l.size)}">Remove</button>
          </div>
        </div>`;
      })
      .join("");

    foot.innerHTML = `
      <p class="total"><span>Total</span><span>${money(cartTotal())}</span></p>
      <div class="order-fields">
        <div><label for="custName">Your name</label><input id="custName" autocomplete="name" value="${esc(state.customer.name)}"></div>
        <div><label for="custArea">Delivery area</label><input id="custArea" autocomplete="address-level2" value="${esc(state.customer.area)}"></div>
      </div>
      <button class="btn btn--pink" id="checkoutBtn" style="width:100%">Send order on WhatsApp</button>
      <p class="order-note">This opens WhatsApp with your order ready to send. You pay the shop directly.</p>
      <button class="link-btn clear-bag" id="clearBag">Empty the bag</button>`;
  }

  function openDrawer() {
    state.lastFocus = document.activeElement;
    renderBag();
    if (!drawer.open) drawer.showModal();
  }

  drawer.addEventListener("click", (e) => {
    if (e.target === drawer) return drawer.close();
    const t = e.target.closest("button");
    if (!t) return;
    if (t.matches("[data-close]")) return drawer.close();
    const split = (v) => v.split("|");
    if (t.dataset.inc) {
      const [id, size] = split(t.dataset.inc);
      const line = state.cart.find((l) => l.id === id && l.size === size);
      return setQty(id, size, (line ? line.qty : 0) + 1);
    }
    if (t.dataset.dec) {
      const [id, size] = split(t.dataset.dec);
      const line = state.cart.find((l) => l.id === id && l.size === size);
      return setQty(id, size, (line ? line.qty : 1) - 1);
    }
    if (t.dataset.remove) {
      const [id, size] = split(t.dataset.remove);
      return removeLine(id, size);
    }
    if (t.id === "clearBag") {
      state.cart = [];
      saveCart();
      return renderBag();
    }
    if (t.id === "checkoutBtn") {
      const url = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(orderMessage())}`;
      window.open(url, "_blank", "noopener");
    }
  });
  drawer.addEventListener("input", (e) => {
    if (e.target.id === "custName") state.customer.name = e.target.value;
    if (e.target.id === "custArea") state.customer.area = e.target.value;
    store.set("customer", state.customer);
  });
  drawer.addEventListener("close", () => {
    if (state.lastFocus && document.contains(state.lastFocus)) state.lastFocus.focus();
  });

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
  }

  /* ---------- Page-level events ---------- */
  document.addEventListener("click", (e) => {
    const open = e.target.closest("[data-open]");
    if (open && !productDialog.contains(open)) return openProduct(open.dataset.open, open);

    const save = e.target.closest(".heart[data-save]");
    if (save) return toggleSaved(save.dataset.save);

    const chip = e.target.closest("[data-filter]");
    if (chip) {
      state.filter = chip.dataset.filter;
      renderChips();
      renderGrid();
    }
  });

  $("#bagBtn").addEventListener("click", openDrawer);
  $("#searchBtn").addEventListener("click", () => {
    $("#shop").scrollIntoView();
    setTimeout(() => $("#searchInput").focus({ preventScroll: true }), 250);
  });
  $("#savedBtn").addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    renderSavedBadge();
    renderGrid();
    $("#shop").scrollIntoView();
    if (state.savedOnly && !state.saved.length) toast("Tap the heart on a piece to save it");
  });
  $("#searchInput").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderGrid();
  });
  $("#sortSelect").addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderGrid();
  });
  $("#clearFilters").addEventListener("click", () => {
    state.filter = "All";
    state.query = "";
    state.savedOnly = false;
    $("#searchInput").value = "";
    renderChips();
    renderSavedBadge();
    renderGrid();
  });

  /* ---------- Visit section ---------- */
  function renderVisit() {
    $("#visitAddress").textContent = STORE.address;
    $("#visitHours").innerHTML = STORE.hours
      .map(([d, h]) => `<div><dt>${esc(d)}</dt><dd>${esc(h)}</dd></div>`)
      .join("");
    $("#callLink").href = `tel:+${STORE.whatsapp}`;
    $("#waLink").href = `https://wa.me/${STORE.whatsapp}`;
    $("#dirLink").href = `https://www.google.com/maps/dir/?api=1&destination=${STORE.lat},${STORE.lng}`;
    $("#mapFrame").src = `https://maps.google.com/maps?q=${STORE.lat},${STORE.lng}&z=16&output=embed`;
  }

  /* ---------- Init ---------- */
  $("#year").textContent = new Date().getFullYear();
  renderChips();
  renderSavedBadge();
  renderGrid();
  renderBag();
  renderVisit();
})();
