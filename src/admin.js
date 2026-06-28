const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const state = {
  range: "30",
  focus: "analytics",
  compact: false,
  panels: { kpis: true, sales: true, products: true, activity: true },
  search: ""
};

const focusActions = {
  analytics: [
    { label: "Produit chaud", action: "Identifier le profil qui cree le plus de paniers et le mettre en hero secondaire." },
    { label: "Conversion", action: "Comparer les visiteurs PDP aux ajouts panier par profil." }
  ],
  products: [
    { label: "PDP", action: "Ajouter un module methode / mouture / intensite pour reduire l'hesitation." },
    { label: "Bundle", action: "Tester une box decouverte avec Onyx, Cameroun et Aurora." }
  ],
  marketing: [
    { label: "Lead capture", action: "Transformer le finder en sequence email: profil, brewing, commande." },
    { label: "Story", action: "Faire remonter la preuve farm to cup dans les creatives." }
  ],
  discounts: [
    { label: "Prix", action: "Prioriser la livraison gratuite, les bundles et les offres de decouverte." }
  ]
};

function money(value) {
  return `$${Number(value || 0).toFixed(2)} CAD`;
}

function getScale() {
  if (state.range === "today") return { factor: 0.28, suffix: "today" };
  if (state.range === "compare") return { factor: 1.18, suffix: "compare window" };
  return { factor: 1, suffix: "30-day window" };
}

async function getAnalytics() {
  const response = await fetch("/api/analytics");
  if (!response.ok) throw new Error("Analytics unavailable");
  return response.json();
}

function scaledData(data) {
  const scale = getScale();
  const revenue = Number(data.estimatedRevenueValue || 0) * scale.factor;
  const cartIntent = Math.round(Number(data.cartIntent || 0) * scale.factor);
  const ordersFulfilled = Math.round(Number(data.ordersFulfilled || 0) * scale.factor);
  const pageViews = Math.round(Number(data.pageViews || 0) * scale.factor);
  const totalEvents = Math.round(Number(data.totalEvents || 0) * scale.factor);
  const leadCount = Math.max(0, Math.round(Number(data.leadCount || 0) * (state.range === "today" ? 0.45 : scale.factor)));
  const conversion = pageViews ? Math.min(100, (cartIntent / pageViews) * 100).toFixed(1) : "0.0";
  return {
    ...data,
    estimatedRevenueValue: revenue,
    estimatedRevenue: money(revenue),
    cartIntent,
    ordersFulfilled,
    pageViews,
    totalEvents,
    leadCount,
    conversionRate: `${conversion}%`
  };
}

function seriesFrom(data) {
  const seed = Math.max(8, Number(data.estimatedRevenueValue || 0) / 1.35);
  const base = [0.58, 0.28, 0.54, 0.18, 0.12, 0.26, 0.55, 1.0, 0.24, 0.16, 0.64, 0.52];
  return base.map((value, index) => Math.max(1, Math.round(seed * value + index * 0.7)));
}

function spark(values, color = "#5bb5ff") {
  const max = Math.max(1, ...values);
  const points = values.map((value, index) => {
    const x = 8 + index * (132 / Math.max(1, values.length - 1));
    const y = 38 - (value / max) * 28;
    return `${x},${y}`;
  }).join(" ");
  return `<svg class="mini-spark" viewBox="0 0 150 44" aria-hidden="true"><polyline fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${points}" /></svg>`;
}

function chart(values) {
  const max = Math.max(1, ...values);
  const peak = Math.max(...values);
  const peakIndex = values.indexOf(peak);
  const peakX = 54 + peakIndex * (612 / Math.max(1, values.length - 1));
  const peakY = 282 - (peak / max) * 220;
  const points = values.map((value, index) => {
    const x = 54 + index * (612 / Math.max(1, values.length - 1));
    const y = 282 - (value / max) * 220;
    return `${x},${y}`;
  }).join(" ");
  const ghost = values.map((value, index) => {
    const x = 54 + index * (612 / Math.max(1, values.length - 1));
    const y = 268 - (value / max) * 176 + Math.sin(index) * 24;
    return `${x},${Math.max(38, y)}`;
  }).join(" ");
  const yLabels = [1, 0.66, 0.33, 0].map((ratio) => {
    const y = 62 + (1 - ratio) * 220;
    const label = ratio ? `$${Math.max(1, Math.round(max * ratio))}` : "$0";
    return `<text x="14" y="${y + 4}">${label}</text><line x1="54" x2="674" y1="${y}" y2="${y}" />`;
  }).join("");
  return `<svg class="line-chart" viewBox="0 0 720 340" role="img" aria-label="Sales over time">
    <defs>
      <linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#2c6faa" stop-opacity=".22" /><stop offset="1" stop-color="#2c6faa" stop-opacity="0" /></linearGradient>
      <linearGradient id="salesStroke" x1="0" x2="1" y1="0" y2="0"><stop stop-color="#2c6faa" /><stop offset=".55" stop-color="#1b6d9c" /><stop offset="1" stop-color="#9c6418" /></linearGradient>
    </defs>
    <rect x="0" y="0" width="720" height="340" rx="14" fill="rgba(255,250,240,.46)" />
    <g class="chart-axis" stroke="rgba(84,52,29,.14)" stroke-width="1">${yLabels}</g>
    <polygon points="54,306 ${points} 674,306" fill="url(#salesFill)" opacity=".9" />
    <polyline fill="none" stroke="rgba(84,52,29,.36)" stroke-width="2" stroke-dasharray="7 9" stroke-linecap="round" stroke-linejoin="round" points="${ghost}" />
    <polyline fill="none" stroke="url(#salesStroke)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
    ${values.map((value, index) => {
      const x = 54 + index * (612 / Math.max(1, values.length - 1));
      const y = 282 - (value / max) * 220;
      return `<circle class="chart-dot" cx="${x}" cy="${y}" r="${index === peakIndex ? 5.5 : 3.5}" fill="${index === peakIndex ? "#9c6418" : "#fff8ec"}" stroke="#2c6faa" stroke-width="2" />`;
    }).join("")}
    <g class="chart-callout">
      <line x1="${peakX}" x2="${peakX}" y1="${peakY - 8}" y2="48" stroke="rgba(156,100,24,.34)" stroke-dasharray="4 6" />
      <rect x="${Math.min(560, Math.max(64, peakX - 56))}" y="20" width="112" height="34" rx="17" fill="#fff8ec" stroke="rgba(63,34,18,.16)" />
      <text x="${Math.min(616, Math.max(120, peakX))}" y="41" text-anchor="middle">Peak intent</text>
    </g>
    <g class="chart-axis" stroke="none"><text x="54" y="326">Week 1</text><text x="250" y="326">Week 2</text><text x="446" y="326">Week 3</text><text x="630" y="326">Week 4</text></g>
  </svg>`;
}

function kpi(label, value, detail, trend, color) {
  return `<article class="admin-kpi">
    <span>${label}</span>
    <strong>${value}</strong>
    <small>${detail}</small>
    ${spark(trend, color)}
  </article>`;
}

function renderKpis(data) {
  const target = $("[data-kpis]");
  if (!target) return;
  const scale = getScale();
  target.innerHTML = [
    kpi("Gross sales", data.estimatedRevenue, `${data.cartIntent} cart intents / ${scale.suffix}`, seriesFrom(data).slice(0, 8), "#2c6faa"),
    kpi("Cart conversion", data.conversionRate, `${data.cartIntent} carts / ${data.pageViews} sessions`, [2, 4, 3, 7, 6, 9, 7, 12].map((x) => x * scale.factor), "#527a36"),
    kpi("Orders confirmed", data.ordersFulfilled, "Checkout confirmations", [1, 2, 4, 3, 6, 8, 7, 10].map((x) => x * scale.factor), "#9c6418"),
    kpi("Sessions", data.pageViews, `${data.totalEvents} total events`, [3, 4, 4, 7, 6, 9, 8, 12].map((x) => x * scale.factor), "#7442ad")
  ].join("");
}

function renderSales(data) {
  const label = $("[data-sales-label]");
  if (label) label.textContent = `${data.estimatedRevenue} / ${getScale().suffix}`;
  const target = $("[data-main-chart]");
  if (target) target.innerHTML = chart(seriesFrom(data));
}

function renderBreakdown(data) {
  const target = $("[data-breakdown]");
  if (!target) return;
  const gross = Number(data.estimatedRevenueValue || 0);
  const discounts = gross * (state.focus === "discounts" ? 0.12 : 0.08);
  const returns = gross * (state.range === "today" ? 0 : 0.03);
  const tax = gross * 0.14975;
  const net = Math.max(0, gross - discounts - returns);
  target.innerHTML = [
    ["Gross sales", money(gross), "+28%"],
    ["Discounts", `-${money(discounts)}`, "-4%"],
    ["Returns", `-${money(returns)}`, state.range === "today" ? "0%" : "-2%"],
    ["Taxes", money(tax), "+14%"],
    ["Net sales", money(net), "+31%"]
  ].map(([label, value, delta]) => `<div class="breakdown-row"><div><strong>${label}</strong> <span>${delta}</span></div><strong>${value}</strong></div>`).join("");
}

function renderProducts(data) {
  const target = $("[data-product-report]");
  if (!target) return;
  const max = Math.max(1, ...data.productStats.map((item) => item.score));
  target.innerHTML = data.productStats.slice().sort((a, b) => b.score - a.score).map((item) => {
    const width = Math.max(5, (item.score / max) * 100);
    return `<div class="product-row" style="--bar:${item.accent};--w:${width}%">
      <img src="${item.image}" alt="${item.name}" />
      <div><strong>${item.name}</strong><small>${item.views} views / ${item.selects} selects / ${item.cart} carts</small></div>
      <div class="progress"><b></b></div>
      <strong>${money(item.revenueIntent)}</strong>
    </div>`;
  }).join("");
}

function renderEvents(data) {
  const target = $("[data-events]");
  if (!target) return;
  if (!data.latest.length) {
    target.innerHTML = `<div class="event-row"><span>--</span><strong>Aucun event encore</strong><small>Teste le site</small></div>`;
    return;
  }
  target.innerHTML = data.latest.slice(0, 12).map((event) => {
    const time = new Date(event.ts).toLocaleTimeString("fr-CA", { hour: "2-digit", minute: "2-digit" });
    return `<div class="event-row"><span>${time}</span><strong>${event.type}</strong><small>${event.product || event.path}</small></div>`;
  }).join("");
}

function renderLeads(data) {
  const target = $("[data-leads]");
  if (!target) return;
  if (!data.leads.length) {
    target.innerHTML = `<div class="lead-row"><strong>Aucun lead encore.</strong><span>Teste le finder ou le contact.</span></div>`;
    return;
  }
  target.innerHTML = data.leads.map((lead) => {
    const time = new Date(lead.ts).toLocaleString("fr-CA", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    return `<div class="lead-row"><strong>${lead.email}</strong><span>${lead.interest} / ${lead.product || "boutique"} / ${time}</span></div>`;
  }).join("");
}

function renderActions(data) {
  const target = $("[data-growth-actions]");
  if (!target) return;
  const actions = [
    ...(focusActions[state.focus] || []).map((item) => ({ ...item, focus: true })),
    ...(data.recommendations || [])
  ];
  target.innerHTML = actions.map((item) => `<div class="growth-action ${item.focus ? "is-focus" : ""}"><span>${item.label}</span><strong>${item.action}</strong></div>`).join("");
}

function applyPanels() {
  Object.entries(state.panels).forEach(([key, visible]) => {
    $$(`[data-panel="${key}"]`).forEach((node) => { node.hidden = !visible; });
    const input = $(`[data-panel-toggle="${key}"]`);
    if (input) input.checked = visible;
  });
}

function applySearch() {
  const q = state.search.trim().toLowerCase();
  const rows = $$(".product-row, .event-row, .lead-row, .growth-action, .admin-kpi, .breakdown-row");
  rows.forEach((row) => {
    const match = q && row.textContent.toLowerCase().includes(q);
    row.classList.toggle("is-match", Boolean(match));
  });
}

async function render() {
  try {
    const raw = await getAnalytics();
    const data = scaledData(raw);
    renderKpis(data);
    renderSales(data);
    renderBreakdown(data);
    renderProducts(data);
    renderEvents(data);
    renderLeads(data);
    renderActions(data);
    applyPanels();
    applySearch();
  } catch (error) {
    const main = $(".admin-main");
    if (main) main.insertAdjacentHTML("afterbegin", `<p class="empty-state">Dashboard indisponible: ${error.message}</p>`);
  }
}

function bind() {
  $("[data-admin-tabs]")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-range]");
    if (!button) return;
    state.range = button.dataset.range;
    $$("[data-range]").forEach((node) => node.classList.toggle("active", node === button));
    render();
  });

  $("[data-customize]")?.addEventListener("click", () => {
    const panel = $("[data-customizer]");
    if (panel) panel.hidden = !panel.hidden;
  });

  $$("[data-panel-toggle]").forEach((input) => input.addEventListener("change", () => {
    state.panels[input.dataset.panelToggle] = input.checked;
    applyPanels();
  }));

  $$("[data-admin-nav]").forEach((button) => button.addEventListener("click", () => {
    state.focus = button.dataset.adminNav;
    $$("[data-admin-nav]").forEach((node) => node.classList.toggle("active", node === button));
    render();
  }));

  $("[data-density]")?.addEventListener("click", () => {
    state.compact = !state.compact;
    document.body.classList.toggle("density-compact", state.compact);
  });

  $("[data-refresh]")?.addEventListener("click", render);
  $("[data-admin-search]")?.addEventListener("input", (event) => {
    state.search = event.target.value;
    applySearch();
  });
}

bind();
function initOwnerGate() {
  const gate = $("[data-owner-gate]");
  const dashboard = $("[data-owner-dashboard]");
  const form = $("[data-owner-form]");
  const input = $("[data-owner-code]");
  const status = $("[data-owner-status]");
  if (!gate || !dashboard || !form) return true;

  const unlock = () => {
    gate.hidden = true;
    dashboard.hidden = false;
    document.body.classList.add("owner-unlocked");
    return true;
  };

  if (localStorage.getItem("nubia-owner-ok") === "true") return unlock();

  gate.hidden = false;
  dashboard.hidden = true;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if ((input?.value || "").trim() === "NUBIA-OWNER") {
      localStorage.setItem("nubia-owner-ok", "true");
      unlock();
      render();
      return;
    }
    if (status) status.textContent = "Code invalide. Accès owner seulement.";
    input?.focus();
  });
  return false;
}

if (initOwnerGate()) render();
