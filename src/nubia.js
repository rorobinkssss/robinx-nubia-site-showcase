const root = document.documentElement;
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const bootstrap = window.__NUBIA_BOOTSTRAP__ || {};
const exportMode = Boolean(window.__NUBIA_EXPORT__);
const offlineMode = exportMode || window.location.protocol === "file:";
const pathPrefix = typeof window.__NUBIA_PATH_PREFIX__ === "string" ? window.__NUBIA_PATH_PREFIX__ : "";
const siteOrigin = typeof window.__NUBIA_SITE_ORIGIN__ === "string"
  ? window.__NUBIA_SITE_ORIGIN__.replace(/\/+$/, "")
  : (/^https?:$/i.test(window.location.protocol) ? window.location.origin : "");

const state = {
  products: [],
  cart: [],
  lang: "fr",
  anime: null,
  pointer: { x: innerWidth / 2, y: innerHeight / 2 },
  particles: []
};

const TRANSLATION_PAIRS = [
  ["Recherche", "Search"],
  ["Panier", "Cart"],
  ["Changer la langue", "Change language"],
  ["Finder", "Finder"],
  ["Quel rituel tu veux?", "What ritual do you want?"],
  ["Calcul pro", "Pro calculator"],
  ["Commande professionnelle locale.", "Local professional order."],
  ["Kg personnalisé", "Custom kg"],
  ["Format", "Format"],
  ["Sacs", "Bags"],
  ["Cost", "Cost"],
  ["Store", "Store"],
  ["Size", "Size"],
  ["CAD", "CAD"],
  ["best", "best"],
  ["Du Cameroun à ton matin.", "From Cameroon to your morning."],
  ["Café camerounais premium", "Premium Cameroonian coffee"],
  ["Cafés d'origine claire, torréfiés à Montréal pour des rituels qui te ressemblent.", "Single-origin coffees roasted in Montreal for rituals that feel like yours."],
  ["Choisir mon café", "Choose my coffee"],
  ["Voir les cafés", "See coffees"],
  ["Grain entier", "Whole bean"],
  ["Traçabilité", "Traceability"],
  ["Emballage", "Packaging"],
  ["Commence par ton rituel", "Start with your ritual"],
  ["On t'aide à trouver ton café idéal.", "We help you find your ideal coffee."],
  ["Matin", "Morning"],
  ["Énergie douce", "Soft energy"],
  ["Concentration", "Focus"],
  ["Clarté & focus", "Clarity & focus"],
  ["Après-midi", "Afternoon"],
  ["Équilibre", "Balance"],
  ["Soir", "Evening"],
  ["Doux & réconfort", "Soft & comforting"],
  ["Riche & corse", "Rich & bold"],
  ["Répondre en 30 sec", "Answer in 30 sec"],
  ["Compare et choisis en confiance", "Compare and choose confidently"],
  ["Quatre profils. Quatre expériences.", "Four profiles. Four experiences."],
  ["Voir tous les cafés", "See all coffees"],
  ["Notre origine", "Our origin"],
  ["Un terroir. Des gens. Un standard.", "One terroir. Real people. One standard."],
  ["Nos cafés viennent des hauts plateaux du Cameroun. Des fermes partenaires, des pratiques durables, et une traçabilité totale.", "Our coffees come from Cameroon's highlands. Partner farms, durable practices, and full traceability."],
  ["Ouest Cameroun", "West Cameroon"],
  ["Altitude", "Altitude"],
  ["Espèce", "Species"],
  ["Récolte", "Harvest"],
  ["Séchage", "Drying"],
  ["Score qualité", "Quality score"],
  ["Voir la carte", "See the map"],
  ["Torréfié à Montréal", "Roasted in Montreal"],
  ["Petites torréfactions, fraîcheur garantie.", "Small-batch roasting, freshness guaranteed."],
  ["Livraison rapide", "Fast delivery"],
  ["Gratuite dès 100 $ à Montréal.", "Free over $100 in Montreal."],
  ["Satisfait ou ajusté", "Satisfied or adjusted"],
  ["On t'aide à trouver le bon profil.", "We help you find the right profile."],
  ["Paiement sécurisé", "Secure payment"],
  ["Carte, Apple Pay, Google Pay.", "Card, Apple Pay, Google Pay."],
  ["Club Nubia", "Nubia Club"],
  ["Rejoins le club, partage le goût.", "Join the club, share the taste."],
  ["Cafés exclusifs, offres membres et 10 $ de crédit quand un ami passe sa première commande.", "Exclusive coffees, member offers, and $10 credit when a friend places their first order."],
  ["Rejoindre le club", "Join the club"],
  ["10 $ pour toi", "$10 for you"],
  ["Crédit après chaque ami référé.", "Credit after each referred friend."],
  ["Offres exclusives", "Exclusive offers"],
  ["Réservées aux membres.", "Members only."],
  ["Accès prioritaire", "Priority access"],
  ["Nouveaux lots & éditions limitées.", "New lots & limited editions."],
  ["Boutique Nubia", "Nubia shop"],
  ["Choisis selon ta tasse.", "Choose by your cup."],
  ["Chaque café est présenté par usage, intensité, notes et méthode. Moins d'hésitation, meilleur premier achat.", "Every coffee is presented by use, intensity, notes and method. Less hesitation, a better first purchase."],
  ["Tous", "All"],
  ["Magasiner vite", "Shop fast"],
  ["Commence par ton rituel, puis compare seulement les profils qui ont du sens.", "Start with your ritual, then compare only the profiles that make sense."],
  ["Ouvrir le finder", "Open finder"],
  ["Livraison gratuite des 100 $", "Free shipping over $100"],
  ["Guide par usage", "Guide by use"],
  ["Notes de", "Notes"],
  ["Idéal pour", "Best for"],
  ["Ajouter au panier", "Add to cart"],
  ["Ajouter", "Add"],
  ["Voir le profil", "View profile"],
  ["Taxes et livraison au checkout", "Taxes and shipping at checkout"],
  ["Calculer format pro", "Calculate pro format"],
  ["Profil", "Profile"],
  ["Ce que tu vas remarquer.", "What you will notice."],
  ["Lecture rapide", "Quick read"],
  ["Structure tasse", "Cup structure"],
  ["Methode", "Method"],
  ["Méthode", "Method"],
  ["Fais simple.", "Keep it simple."],
  ["Comparer", "Compare"],
  ["Autres profils Nubia", "Other Nubia profiles"],
  ["Guide des rituels", "Ritual guide"],
  ["Choisis ton café sans devenir barista.", "Choose your coffee without becoming a barista."],
  ["Le bon sac se décide avec une question simple: comment tu le bois chez toi. Le reste sert seulement à confirmer le choix.", "The right bag starts with one simple question: how you drink it at home. The rest only confirms the choice."],
  ["Je bois avec du lait", "I drink it with milk"],
  ["Je veux un espresso dense", "I want a dense espresso"],
  ["Je veux un sac safe", "I want a safe pick"],
  ["Je veux plus doux", "I want something softer"],
  ["Corps rond, faible acidité, texture smooth.", "Round body, low acidity, smooth texture."],
  ["Cacao, crema, finale plus longue.", "Cacao, crema, longer finish."],
  ["Équilibre, caramel, café quotidien.", "Balanced, caramel, everyday coffee."],
  ["Sucre, finesse, intensité plus calme.", "Sugar, finesse, calmer intensity."],
  ["Usage", "Use"],
  ["Ce que ca veut dire", "What it means"],
  ["Ce que ça veut dire", "What it means"],
  ["Produit logique", "Logical product"],
  ["Le café doit rester rond avec le lait.", "The coffee should stay round with milk."],
  ["Tu veux du corps, de la crema, une finale cacao.", "You want body, crema and a cacao finish."],
  ["Tu veux lire plus clairement l'équilibre et la douceur.", "You want to read balance and sweetness more clearly."],
  ["Tu veux une tasse plus lourde, plus chaude, plus assumée.", "You want a heavier, warmer, more assertive cup."],
  ["Commence avec ta methode.", "Start with your method."],
  ["Commence avec ta méthode.", "Start with your method."],
  ["Machine espresso, moka pot, filtre, latte: c'est ça qui décide le profil en premier.", "Espresso machine, moka pot, filter, latte: that decides the profile first."],
  ["Lis le body avant les notes.", "Read body before notes."],
  ["Les notes sont utiles, mais le body détermine si le café va sembler faible, rond ou dense.", "Notes help, but body decides if the coffee feels weak, round or dense."],
  ["Garde un favori.", "Keep a favorite."],
  ["Quand tu sais ce qui marche dans ta tasse, reviens au même profil sans refaire toute la recherche.", "When you know what works in your cup, come back to the same profile without restarting the search."],
  ["Contact", "Contact"],
  ["La bonne demande, au bon endroit.", "The right request, in the right place."],
  ["Commande en ligne, distribution locale, collaboration ou café pour bureau: envoie le contexte et on te répond avec la prochaine étape claire.", "Online order, local distribution, collaboration or office coffee: send the context and we will answer with a clear next step."],
  ["Montréal", "Montreal"],
  ["Boutique", "Shop"],
  ["Distribution", "Distribution"],
  ["Nom", "Name"],
  ["Sujet", "Subject"],
  ["Commande", "Order"],
  ["Collaboration", "Collaboration"],
  ["Commande boutique", "Shop order"],
  ["Suivi, livraison, retour panier ou question sur un profil avant d'acheter.", "Tracking, delivery, cart follow-up or a profile question before buying."],
  ["Distribution locale", "Local distribution"],
  ["Restaurant, bureau, marché, épicerie fine ou collaboration B2B à Montréal.", "Restaurant, office, market, fine grocery or B2B collaboration in Montreal."],
  ["Partenariat brand", "Brand partnership"],
  ["Contenu, événement, dégustation ou activation autour de l'origine camerounaise.", "Content, event, tasting or activation around Cameroonian origin."],
  ["Lire le guide", "Read the guide"],
  ["Panier", "Cart"],
  ["Ta sélection Nubia.", "Your Nubia selection."],
  ["Vérifie tes sacs, ajuste les quantités, puis passe au checkout.", "Review your bags, adjust quantities, then continue to checkout."],
  ["Finaliser le rituel.", "Finalize the ritual."],
  ["Prépare ta commande, choisis la livraison, puis garde ton code de partage après confirmation.", "Prepare your order, choose delivery, then keep your sharing code after confirmation."],
  ["Ville", "City"],
  ["Montréal / livraison locale", "Montreal / local delivery"],
  ["Pickup / à confirmer", "Pickup / to confirm"],
  ["Code promo ou referral", "Promo or referral code"],
  ["Sous-total", "Subtotal"],
  ["Livraison", "Shipping"],
  ["Taxes est.", "Est. taxes"],
  ["Total", "Total"],
  ["Ton panier est vide.", "Your cart is empty."],
  ["Aucun profil trouve.", "No profile found."],
  ["Aucun profil trouvé.", "No profile found."],
  ["Essaie espresso ou latte", "Try espresso or latte"],
  ["Gratuit", "Free"],
  ["Recu. Profil suggere:", "Received. Suggested profile:"],
  ["Reçu. Profil suggéré:", "Received. Suggested profile:"],
  ["Le profil est pret, mais la capture locale n'a pas repondu.", "The profile is ready, but the local capture did not respond."],
  ["Le profil est prêt, mais la capture locale n'a pas répondu.", "The profile is ready, but the local capture did not respond."],
  ["Ajoute un cafe avant de confirmer.", "Add a coffee before confirming."],
  ["Ajoute un café avant de confirmer.", "Add a coffee before confirming."],
  ["Commande preparee.", "Order prepared."],
  ["Commande préparée.", "Order prepared."],
  ["Lien copie", "Link copied"],
  ["Lien copié", "Link copied"],
  ["Bags", "Bags"],
  ["Boutique", "Shop"],
  ["Tous les cafés", "All coffees"],
  ["Découvrir", "Discover"],
  ["Notre origine", "Our origin"],
  ["Nous contacter", "Contact us"],
  ["Profil signature", "Signature profile"],
  ["Profil origine", "Origin profile"],
  ["Profil puissant", "Power profile"],
  ["Profil intense", "Intense profile"],
  ["Profil arabica", "Arabica profile"],
  ["Profil equilibre", "Balanced profile"],
  ["Profond / crémeux", "Deep / creamy"],
  ["Rond / smooth", "Round / smooth"],
  ["Dense / cacao", "Dense / cacao"],
  ["Intense / épicé", "Intense / spiced"],
  ["Doux / raffiné", "Soft / refined"],
  ["Équilibre / quotidien", "Balanced / everyday"],
  ["Pour ceux qui veulent un café profond, crémeux, avec une vraie présence en lait.", "For people who want a deep, creamy coffee with real presence in milk."],
  ["Le profil le plus smooth pour les rituels quotidiens: rond, accessible, mais premium.", "The smoothest profile for daily rituals: round, accessible, but premium."],
  ["Un dark roast puissant, dense, construit pour l'espresso et les methodes qui demandent du corps.", "A powerful, dense dark roast built for espresso and methods that need body."],
  ["Le module le plus intense: cacao, dark choco, spices, crema dense et finish assumée.", "The most intense profile: cacao, dark chocolate, spices, dense crema and a confident finish."],
  ["Un profil plus doux et lumineux: milk chocolate, fruits rouges, miel, equilibre et finesse.", "A softer, brighter profile: milk chocolate, red fruits, honey, balance and finesse."],
  ["Le point d'entrée signature: full body, structure équilibrée, caramel, choco et amandes grillées.", "The signature entry point: full body, balanced structure, caramel, chocolate and roasted almonds."],
  ["Onyx est le profil signature pour un café intense mais enveloppant. Il garde une texture riche, une crema rassurante et une finale qui fonctionne autant en espresso qu'en lait.", "Onyx is the signature profile for an intense but enveloping coffee. It keeps a rich texture, steady crema and a finish that works in espresso and milk."],
  ["Cameroun met l'origine au centre. C'est le profil qui donne à Nubia son ancrage: une tasse ronde, douce, basse en acidité, facile à aimer mais clairement premium.", "Cameroun puts the origin at the center. It gives Nubia its anchor: a round, soft, low-acidity cup that is easy to love but clearly premium."],
  ["Titan est construit comme un moteur: dense, stable, rassurant. Il donne au client l'impression d'un cafe qui ne flanche pas, avec une presence cacao tres nette.", "Titan is built like an engine: dense, stable, reassuring. It gives the feeling of a coffee that does not collapse, with a clear cacao presence."],
  ["Vulcan est le profil qui vend le frisson. Il doit sentir la chaleur, la pression, la densité. C'est le café pour ceux qui veulent que leur espresso ait du poids.", "Vulcan is the profile that sells the thrill. It should feel hot, pressurized and dense. It is for people who want their espresso to carry weight."],
  ["Aurora apporte la lumière dans l'univers Nubia. Il garde le côté premium, mais ouvre une expérience plus douce, plus accessible, plus élégante.", "Aurora brings light into Nubia's world. It keeps the premium feeling while opening a softer, more accessible, more elegant experience."],
  ["Atlas est le profil qui porte la collection. Il est assez riche pour vendre la qualité, assez balancé pour devenir le café quotidien.", "Atlas carries the collection. It is rich enough to sell quality and balanced enough to become the daily coffee."],
  ["Prev", "Prev"],
  ["Next", "Next"],
  ["Quantite", "Quantity"],
  ["Fermer", "Close"],
  ["Voir le panier", "Review cart"],
  ["Passer au checkout", "Go to checkout"],
  ["espresso, latte, cacao, smooth...", "espresso, latte, cacao, smooth..."],
  ["Point de depart", "Starting point"],
  ["Ta tasse décide.", "Your cup decides."],
  ["Va direct à la situation qui te ressemble.", "Go straight to the situation that sounds like you."],
  ["Chaque choix mène à un produit, pas à un paragraphe de théorie.", "Each choice leads to a product, not a paragraph of theory."],
  ["Comment lire un sac Nubia en 20 secondes.", "How to read a Nubia bag in 20 seconds."],
  ["Ignore les mots qui ne changent rien dans ta tasse. Regarde l'usage, le body, l'acidité et la méthode recommandée.", "Ignore the words that do not change your cup. Look at use, body, acidity and recommended method."],
  ["Le Cameroun n'est pas un décor. C'est le point de départ.", "Cameroon is not decoration. It is the starting point."],
  ["L'origine donne la matière première. Nubia te l'explique vite, t'oriente mieux, et rend le choix évident.", "Origin gives the raw material. Nubia explains it fast, guides you better and makes the choice obvious."],
  ["Voir ma reponse", "See my answer"],
  ["Magasiner", "Shop"],
  ["Choisir maintenant", "Choose now"],
  ["Latte", "Latte"],
  ["Filtre", "Filter"],
  ["Intense", "Intense"],
  ["Commande boutique", "Shop order"],
  ["Restaurant, bureau, marché, épicerie fine ou collaboration B2B à Montréal.", "Restaurant, office, market, fine grocery or B2B collaboration in Montreal."],
  ["Profil origine", "Origin profile"],
  ["Contenu, événement, dégustation ou activation autour de l'origine camerounaise.", "Content, event, tasting or activation around Cameroonian origin."],
  ["Profil", "Profile"],
  ["Methode", "Method"],
  ["Résumé", "Summary"],
  ["Continuer au checkout", "Continue to checkout"],
  ["Continuer à magasiner", "Keep shopping"],
  ["Coordonnées", "Contact details"],
  ["Confirmer la commande", "Confirm order"],
  ["La confirmation apparaîtra ici.", "Confirmation will appear here."],
  ["Résumé commande", "Order summary"],
  ["Ton panier est vide pour l'instant.", "Your cart is empty for now."],
  ["Après achat", "After purchase"],
  ["Copier le lien", "Copy link"],
  ["Partage ton code avec quelqu'un qui devrait decouvrir Nubia.", "Share your code with someone who should discover Nubia."],
  ["Ton nom", "Your name"],
  ["Nom complet", "Full name"],
  ["Envoyer", "Send"],
  ["Ton message apparaîtra ici.", "Your message will appear here."],
  ["Voir les cafés", "See coffees"]
];

const translationLookup = new Map();
TRANSLATION_PAIRS.forEach(([fr, en]) => {
  translationLookup.set(fr.trim(), { fr, en });
  translationLookup.set(en.trim(), { fr, en });
});

function translateText(value, lang = state.lang) {
  const original = String(value || "");
  const trimmed = original.trim().replace(/\s+/g, " ");
  const pair = translationLookup.get(trimmed);
  if (!pair) return original;
  const next = lang === "en" ? pair.en : pair.fr;
  return original.replace(trimmed, next);
}

const TRANSLATABLE_ATTRS = ["placeholder", "aria-label", "title"];

function applyAutoTranslations(lang = state.lang) {
  if (!document.body) return;

  $$("[data-split]").forEach((node) => {
    const next = translateText(node.textContent, lang);
    if (next !== node.textContent) {
      node.textContent = next;
      delete node.dataset.splitReady;
    }
  });

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent || parent.closest("script, style, noscript, svg, canvas, .brand-word, [data-no-auto-i18n]")) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    const next = translateText(node.nodeValue, lang);
    if (next !== node.nodeValue) node.nodeValue = next;
  });

  $$("[placeholder], [aria-label], [title]").forEach((node) => {
    TRANSLATABLE_ATTRS.forEach((attr) => {
      if (!node.hasAttribute(attr)) return;
      const next = translateText(node.getAttribute(attr), lang);
      if (next !== node.getAttribute(attr)) node.setAttribute(attr, next);
    });
  });
}

function money(value) {
  return `$${Number(value || 0).toFixed(2)} CAD`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function appendLocalQueue(key, payload) {
  try {
    const current = JSON.parse(localStorage.getItem(key) || "[]");
    current.push({ ...payload, ts: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(current));
  } catch {}
}

function pathFor(target) {
  if (!target) return target;
  if (!offlineMode || !String(target).startsWith("/")) return target;
  if (target === "/") return `${pathPrefix}index.html`;
  if (/\.[a-z0-9]+$/i.test(target)) return `${pathPrefix}${target.replace(/^\//, "")}`;
  return `${pathPrefix}${target.replace(/^\//, "").replace(/\/?$/, "/index.html")}`;
}

async function submitLead(payload) {
  if (offlineMode) {
    appendLocalQueue("nubia-export-leads-v1", payload);
    return { ok: true, offline: true };
  }

  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Lead failed");
  return response.json().catch(() => ({ ok: true }));
}

async function loadProducts() {
  if (state.products.length) return state.products;
  if (Array.isArray(bootstrap.products) && bootstrap.products.length) {
    state.products = bootstrap.products;
    return state.products;
  }
  const response = await fetch("/api/products");
  const data = await response.json();
  state.products = data.products || [];
  return state.products;
}

function initCompareProfiles() {
  const productByName = new Map(state.products.map((product) => [product.name.toLowerCase(), product]));
  $$(".compare-table em").forEach((node) => {
    const names = node.textContent.split("/").map((name) => name.trim()).filter(Boolean);
    const profiles = names.map((name) => productByName.get(name.toLowerCase())).filter(Boolean);
    if (!profiles.length) return;

    const wrapper = document.createElement("div");
    wrapper.className = "compare-profiles";
    profiles.forEach((product) => {
      const link = document.createElement("a");
      link.className = "compare-profile-pill";
      link.href = pathFor(`/products/${product.slug}`);
      link.style.setProperty("--accent", product.accent || "#c08552");
      link.style.setProperty("--soft", product.soft || "rgba(255, 248, 235, .5)");
      link.innerHTML = `<img src="${product.tile || product.image}" alt="" loading="lazy" decoding="async" /><span>${product.name}</span>`;
      wrapper.appendChild(link);
    });
    node.replaceWith(wrapper);
  });
}

function renderGuideCoffeeLinks() {
  const target = $(".da-guide .da-steps article:nth-child(3) small");
  if (!target || !state.products.length) return;

  const bySlug = new Map(state.products.map((product) => [product.slug, product]));
  const linkFor = (slug) => {
    const product = bySlug.get(slug);
    if (!product) return "";
    return `<a class="da-coffee-link" href="${pathFor(`/products/${product.slug}`)}" style="--accent:${product.accent || "#c08552"}">${product.name}</a>`;
  };

  target.classList.add("da-step-products");
  if (state.lang === "en") {
    target.innerHTML = `${linkFor("atlas")}/${linkFor("cameroun")} to start. ${linkFor("onyx")}/${linkFor("vulcan")} for more weight.`;
  } else {
    target.innerHTML = `${linkFor("atlas")}/${linkFor("cameroun")} pour commencer. ${linkFor("onyx")}/${linkFor("vulcan")} pour plus de poids.`;
  }
}

function track(type, metadata = {}) {
  const payload = {
    type,
    path: location.pathname,
    product: document.body.dataset.productSlug || metadata.product || null,
    metadata
  };

  if (offlineMode) {
    appendLocalQueue("nubia-export-events-v1", payload);
    return;
  }

  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {
    appendLocalQueue("nubia-export-events-v1", payload);
  });
}

function applyLanguage(lang, resplit = false) {
  state.lang = lang === "en" ? "en" : "fr";
  root.lang = state.lang;
  document.body.dataset.lang = state.lang;
  localStorage.setItem("nubia-lang-v1", state.lang);

  $$("[data-i18n]").forEach((node) => {
    const value = state.lang === "en" ? node.dataset.en : node.dataset.fr;
    if (value) node.textContent = value;
  });
  $$("[data-lang-current]").forEach((node) => { node.textContent = state.lang.toUpperCase(); });
  $$("[data-lang-next]").forEach((node) => { node.textContent = state.lang === "en" ? "FR" : "EN"; });
  applyAutoTranslations(state.lang);
  renderGuideCoffeeLinks();

  if (resplit) {
    $$("[data-split]").forEach((node) => {
      delete node.dataset.splitReady;
    });
    splitText();
  }
}

function initLanguage() {
  applyLanguage(localStorage.getItem("nubia-lang-v1") || "fr", false);
  $$("[data-lang-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      applyLanguage(state.lang === "fr" ? "en" : "fr", true);
      pulse(button);
    });
  });
}

function saveCart() {
  localStorage.setItem("nubia-cart-v1", JSON.stringify(state.cart));
}

function loadCart() {
  try {
    state.cart = JSON.parse(localStorage.getItem("nubia-cart-v1") || "[]");
  } catch {
    state.cart = [];
  }
}

function cartTotal() {
  return state.cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1), 0);
}

function renderCart() {
  const count = state.cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  $$("[data-cart-count]").forEach((node) => { node.textContent = String(count); });
  $$("[data-cart-total]").forEach((node) => { node.textContent = money(cartTotal()); });

  const lines = state.cart.map((item) => {
    const product = state.products.find((entry) => entry.slug === item.slug);
    return `<div class="cart-line" style="--accent:${product?.accent || "#c08552"};--soft:${product?.soft || "rgba(192, 133, 82, 0.18)"};">
      <img src="${product?.tile || product?.image || ""}" alt="${item.name}" />
      <div><strong>${item.name}</strong><small>${item.variant} / ${item.qty} x ${money(item.price)}</small></div>
      <button class="round-button" type="button" data-remove-cart="${item.key}">x</button>
    </div>`;
  }).join("") || `<p class="empty-state">${translateText("Ton panier est vide.")}</p>`;

  $$("[data-cart-lines], [data-cart-page]").forEach((node) => { node.innerHTML = lines; });
  renderCheckout();
  applyAutoTranslations(state.lang);
}

function checkoutAmounts() {
  const subtotal = cartTotal();
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 8.95;
  const tax = subtotal * 0.14975;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}

function renderCheckout() {
  const linesNode = $("[data-checkout-lines]");
  if (!linesNode) return;
  const emptyNode = $("[data-checkout-empty]");
  const amounts = checkoutAmounts();
  const lines = state.cart.map((item) => {
    const product = state.products.find((entry) => entry.slug === item.slug);
    return `<div class="checkout-line">
      <img src="${product?.tile || product?.image || ""}" alt="${item.name}" />
      <div><strong>${item.name}</strong><span>${item.variant} / ${item.qty} x ${money(item.price)}</span></div>
      <b>${money(Number(item.price || 0) * Number(item.qty || 1))}</b>
    </div>`;
  }).join("");
  linesNode.innerHTML = lines;
  if (emptyNode) emptyNode.hidden = Boolean(state.cart.length);
  $("[data-checkout-subtotal]") && ($("[data-checkout-subtotal]").textContent = money(amounts.subtotal));
  $("[data-checkout-shipping]") && ($("[data-checkout-shipping]").textContent = amounts.shipping ? money(amounts.shipping) : translateText("Gratuit"));
  $("[data-checkout-tax]") && ($("[data-checkout-tax]").textContent = money(amounts.tax));
  $("[data-checkout-total]") && ($("[data-checkout-total]").textContent = money(amounts.total));
  applyAutoTranslations(state.lang);
}

function openCart() {
  const drawer = $("#cart-drawer");
  if (!drawer) return;
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  const drawer = $("#cart-drawer");
  if (!drawer) return;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
}

function initCart() {
  loadCart();
  renderCart();

  document.addEventListener("click", async (event) => {
    const add = event.target.closest("[data-add-cart]");
    const remove = event.target.closest("[data-remove-cart]");

    if (add) {
      await loadProducts();
      const product = state.products.find((item) => item.slug === add.dataset.product);
      const box = add.closest(".product-buy-box");
      const qtyInput = box ? $("[data-qty-input]", box) : null;
      const dock = add.closest("[data-mobile-buy-dock]");
      const pageBuyBox = $(".product-buy-box");
      const variantButton = box ? $(".variant-row button.active", box) : (dock && pageBuyBox ? $(".variant-row button.active", pageBuyBox) : null);
      const qty = clamp(Number(qtyInput?.value || 1), 1, 99);
      const variant = variantButton?.dataset.variant || add.dataset.variant || "340 g";
      const price = Number(variantButton?.dataset.variantPrice || add.dataset.price || 0);
      const key = `${add.dataset.product}-${variant}`;
      const existing = state.cart.find((item) => item.key === key);

      if (existing) existing.qty += qty;
      else state.cart.push({
        key,
        slug: add.dataset.product,
        name: add.dataset.name || product?.name || add.dataset.product,
        variant,
        price,
        qty
      });

      saveCart();
      renderCart();
      openCart();
      track("cart_intent", { product: add.dataset.product, qty, variant, price });
      pulse(add);
    }

    if (remove) {
      state.cart = state.cart.filter((item) => item.key !== remove.dataset.removeCart);
      saveCart();
      renderCart();
    }
  });

  $$("[data-cart-toggle]").forEach((button) => button.addEventListener("click", openCart));
  $$("[data-cart-close]").forEach((button) => button.addEventListener("click", closeCart));
}

function initQuantity() {
  const input = $("[data-qty-input]");
  if (!input) return;
  $("[data-qty-minus]")?.addEventListener("click", () => { input.value = String(clamp(Number(input.value || 1) - 1, 1, 99)); });
  $("[data-qty-plus]")?.addEventListener("click", () => { input.value = String(clamp(Number(input.value || 1) + 1, 1, 99)); });
}

function initGallery() {
  $$("[data-product-gallery]").forEach((gallery) => {
    const slides = $$("[data-gallery-slide]", gallery);
    const thumbs = $$("[data-gallery-thumb]", gallery);
    const status = $("[data-gallery-status]", gallery);
    if (!slides.length) return;
    let index = 0;
    let timer = null;

    const show = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === index));
      thumbs.forEach((thumb, thumbIndex) => thumb.classList.toggle("is-active", thumbIndex === index));
      if (status) status.textContent = `${index + 1} / ${slides.length}`;
    };

    const schedule = () => {
      clearInterval(timer);
      timer = setInterval(() => show(index + 1), 6200);
    };

    $("[data-gallery-prev]", gallery)?.addEventListener("click", () => { show(index - 1); schedule(); });
    $("[data-gallery-next]", gallery)?.addEventListener("click", () => { show(index + 1); schedule(); });
    thumbs.forEach((thumb) => thumb.addEventListener("click", () => { show(Number(thumb.dataset.galleryThumb)); schedule(); }));
    gallery.addEventListener("pointerenter", () => clearInterval(timer));
    gallery.addEventListener("pointerleave", schedule);
    schedule();
  });
}

function initVariants() {
  $$(".variant-row").forEach((row) => {
    row.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      $$("button", row).forEach((node) => node.classList.toggle("active", node === button));
      const box = row.closest(".product-buy-box") || document;
      const price = Number(button.dataset.variantPrice || 0);
      const priceNode = $("[data-product-price]", box);
      const add = $("[data-add-cart][data-price]", box);
      if (priceNode) priceNode.textContent = money(price);
      if (add) {
        add.dataset.price = price.toFixed(2);
        add.dataset.variant = button.dataset.variant || "340 g";
      }
      $$("[data-mobile-buy-dock] [data-add-cart]").forEach((node) => {
        node.dataset.price = price.toFixed(2);
        node.dataset.variant = button.dataset.variant || "340 g";
      });
      $$("[data-mobile-dock-price]").forEach((node) => { node.textContent = money(price); });
      pulse(button);
    });
  });
}

function initFilters() {
  const wrapper = $("[data-catalogue-filters]");
  if (!wrapper) return;
  wrapper.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    $$("[data-filter]", wrapper).forEach((node) => node.classList.toggle("active", node === button));
    const filter = button.dataset.filter;
    $$("[data-product-card]").forEach((card) => {
      const methods = card.dataset.methods || "";
      const visible = filter === "all"
        || (filter === "milk" && /latte|cappuccino|flat white|milk/.test(methods))
        || (filter === "filter" && /filter|pour-over/.test(methods))
        || (filter === "espresso" && /espresso/.test(methods));
      card.hidden = !visible;
    });
  });
}

function initSearch() {
  const overlay = $("#search-overlay");
  const input = $("[data-search-input]");
  const results = $("[data-search-results]");
  if (!overlay || !input || !results) return;

  const render = (query = "") => {
    const q = query.trim().toLowerCase();
    const matches = state.products.filter((product) => {
      const blob = [product.name, product.label, product.description, product.notes?.join(" "), product.methods?.join(" ")].join(" ").toLowerCase();
      return !q || blob.includes(q);
    });
    results.innerHTML = matches.length ? matches.map((product) => `<a class="search-result" href="${pathFor(`/products/${product.slug}`)}" style="--accent:${product.accent || "#c08552"};--soft:${product.soft || "rgba(192, 133, 82, 0.18)"};">
      <img src="${product.tile}" alt="${product.name}" />
      <div><strong>${product.name}</strong><small>${product.label} / ${product.notes.slice(0, 3).join(", ")}</small></div>
      <span>${product.price}</span>
    </a>`).join("") : `<div class="search-result"><div></div><strong>${translateText("Aucun profil trouve.")}</strong><span>${translateText("Essaie espresso ou latte")}</span></div>`;
    applyAutoTranslations(state.lang);
  };

  const open = async () => {
    await loadProducts();
    render(input.value);
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    setTimeout(() => input.focus(), 60);
  };
  const close = () => {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
  };

  $$("[data-search-toggle]").forEach((button) => button.addEventListener("click", open));
  $$("[data-search-close]").forEach((button) => button.addEventListener("click", close));
  input.addEventListener("input", () => render(input.value));
  overlay.addEventListener("click", (event) => { if (event.target === overlay) close(); });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
    }
  });
}

function initBulk() {
  const modal = $("#bulk-modal");
  if (!modal) return;
  const title = $("[data-bulk-title]", modal);
  const sub = $("[data-bulk-sub]", modal);
  const results = $("[data-bulk-results]", modal);
  const note = $("[data-bulk-note]", modal);
  const custom = $("[data-bulk-custom]", modal);
  let prices = {};
  let kg = 10;

  const render = (nextKg) => {
    kg = Number(nextKg || kg || 10);
    const targetG = kg * 1000;
    const entries = Object.entries(prices).sort((a, b) => Number(a[0]) - Number(b[0]));
    const lowest = Math.min(...entries.map(([size, price]) => Number(price) / (Number(size) / 1000)));
    results.innerHTML = `<div class="bulk-row"><strong>${translateText("Format")}</strong><span>${translateText("Sacs")}</span><span>${translateText("Cost")}</span><span>+35%</span></div>${entries.map(([size, price]) => {
      const grams = Number(size);
      const bagPrice = Number(price);
      const bags = Math.ceil(targetG / grams);
      const total = bags * bagPrice;
      const retail = total * 1.35;
      const best = Math.abs((bagPrice / (grams / 1000)) - lowest) < 0.01;
      const label = grams === 1000 ? "1 kg" : grams === 2270 ? "2.27 kg" : `${grams} g`;
      return `<div class="bulk-row ${best ? "best" : ""}"><strong>${label}${best ? ` / ${translateText("best")}` : ""}</strong><span>${bags}</span><span>${money(total)}</span><span>${money(retail)}</span></div>`;
    }).join("")}`;
    if (note) note.textContent = state.lang === "en"
      ? `Local calculation to cover ${kg} kg. Bags are rounded up.`
      : `Calcul local pour couvrir ${kg} kg. Les sacs sont arrondis vers le haut.`;
    applyAutoTranslations(state.lang);
  };

  const open = (button) => {
    prices = JSON.parse(button.dataset.bulkPrices || "{}");
    if (title) title.textContent = button.dataset.bulkName || "Nubia";
    if (sub) sub.textContent = `${button.dataset.bulkSub || "Profil Nubia"} / Bulk order calculator`;
    const tonePaint = {
      red: "#ef4b1f",
      violet: "#8d4bb2",
      sage: "#7e8f55",
      copper: "#bd6a31",
      gold: "#c98b2f",
      blue: "#126dd8"
    };
    const paint = tonePaint[button.dataset.bulkTone] || button.dataset.bulkAccent || "#c08552";
    modal.style.setProperty("--pdp-paint", paint);
    modal.style.setProperty("--pdp-button", `color-mix(in srgb, ${paint} 74%, #3f1f11)`);
    custom.value = "";
    $$("[data-bulk-qty]", modal).forEach((tab, index) => tab.classList.toggle("active", index === 0));
    render(10);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
  };
  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  };

  $$("[data-bulk-open]").forEach((button) => button.addEventListener("click", () => open(button)));
  $$("[data-bulk-close]").forEach((button) => button.addEventListener("click", close));
  $$("[data-bulk-qty]", modal).forEach((button) => button.addEventListener("click", () => {
    $$("[data-bulk-qty]", modal).forEach((tab) => tab.classList.toggle("active", tab === button));
    custom.value = "";
    render(Number(button.dataset.bulkQty));
  }));
  custom?.addEventListener("input", () => {
    if (Number(custom.value) > 0) {
      $$("[data-bulk-qty]", modal).forEach((tab) => tab.classList.remove("active"));
      render(Number(custom.value));
    }
  });
  modal.addEventListener("click", (event) => { if (event.target === modal) close(); });
  window.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
}

function initForms() {
  $$("[data-ritual-form]").forEach((form) => {
    const output = $("[data-finder-result]", form);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const mood = String(data.get("mood") || "balanced");
      const method = String(data.get("method") || "boutique");
      const product = { strong: "vulcan", smooth: "cameroun", sweet: "aurora", balanced: "atlas" }[mood] || "atlas";
      try {
        await submitLead({
          email: String(data.get("email") || ""),
          name: String(data.get("name") || "Nubia lead"),
          interest: `${mood} / ${method}`,
          product,
          path: location.pathname
        });
        if (output) output.innerHTML = state.lang === "en"
          ? `Received. Suggested profile: <a href="${pathFor(`/products/${product}`)}">${product}</a>.`
          : `Recu. Profil suggere: <a href="${pathFor(`/products/${product}`)}">${product}</a>.`;
        form.reset();
      } catch {
        if (output) output.textContent = state.lang === "en"
          ? "The profile is ready, but the local capture did not respond."
          : "Le profil est pret, mais la capture locale n'a pas repondu.";
      }
    });
  });
}

function initCheckout() {
  renderCheckout();
  const form = $("[data-checkout-form]");
  const output = $("[data-checkout-output]");
  const referralNode = $("[data-referral-code]");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.cart.length) {
      if (output) output.textContent = state.lang === "en" ? "Add a coffee before confirming." : "Ajoute un cafe avant de confirmer.";
      return;
    }
    const data = new FormData(form);
    const seed = Math.random().toString(36).slice(2, 6).toUpperCase();
    const code = `NUBIA-${seed}`;
    const amounts = checkoutAmounts();
    const order = {
      id: `NB-${Date.now().toString(36).toUpperCase()}`,
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      city: String(data.get("city") || ""),
      delivery: String(data.get("delivery") || "local"),
      code: String(data.get("code") || ""),
      referral: code,
      total: amounts.total,
      cart: state.cart,
      ts: new Date().toISOString()
    };
    localStorage.setItem("nubia-last-order-v1", JSON.stringify(order));
    if (referralNode) referralNode.textContent = code;
    if (output) {
      output.innerHTML = state.lang === "en"
        ? `Order prepared. Share code <strong>${code}</strong> with a friend.`
        : `Commande preparee. Partage le code <strong>${code}</strong> avec un ami.`;
    }
    track("checkout_confirm", { total: amounts.total, items: state.cart.length, referral: code });
    submitLead({
        email: order.email,
        name: order.name || "Nubia customer",
        interest: `checkout / ${order.delivery}`,
        product: state.cart[0]?.slug || "cart",
        path: location.pathname
      }).catch(() => {});
    pulse(form.querySelector("button[type='submit']"));
  });

  $("[data-copy-referral]")?.addEventListener("click", async (event) => {
    const code = referralNode?.textContent?.trim() || "NUBIA-CLUB";
    const link = siteOrigin
      ? `${siteOrigin}/?ref=${encodeURIComponent(code)}`
      : `?ref=${encodeURIComponent(code)}`;
    try {
      await navigator.clipboard.writeText(link);
      event.currentTarget.textContent = state.lang === "en" ? "Link copied" : "Lien copie";
    } catch {
      event.currentTarget.textContent = link;
    }
    pulse(event.currentTarget);
  });
}

async function loadAnime() {
  if (prefersReduced || offlineMode) return null;
  const allowCdn = !/^(localhost|127\.0\.0\.1)$/i.test(location.hostname) || new URLSearchParams(location.search).has("animecdn");
  if (!allowCdn) return null;
  try {
    return await import("https://cdn.jsdelivr.net/npm/animejs/+esm");
  } catch {
    try {
      return await import("https://esm.sh/animejs");
    } catch {
      return null;
    }
  }
}

function waapi(targets, keyframes, options = {}, stagger = 0) {
  const list = typeof targets === "string" ? $$(targets) : (targets instanceof Element ? [targets] : [...targets].filter(Boolean));
  return list.map((node, index) => node.animate(keyframes, {
    duration: options.duration || 720,
    delay: (options.delay || 0) + index * stagger,
    easing: options.easing || "cubic-bezier(.16,1,.3,1)",
    fill: "both"
  }));
}

function pulse(target) {
  if (!target || prefersReduced) return;
  if (state.anime?.animate && state.anime?.spring) {
    try {
      state.anime.animate(target, { scale: [1, .965, 1], ease: state.anime.spring({ bounce: .25, duration: 360 }) });
      return;
    } catch {}
  }
  waapi(target, [{ transform: "scale(1)" }, { transform: "scale(.965)" }, { transform: "scale(1)" }], { duration: 280, easing: "cubic-bezier(.18,1.2,.32,1)" });
}

function splitText() {
  $$("[data-split]").forEach((node) => {
    if (node.dataset.splitReady) return;
    node.dataset.splitReady = "true";
    if (state.anime?.splitText) {
      try {
        const split = state.anime.splitText(node, { words: { wrap: "span", class: "split-word" } });
        if (split?.words?.length) return;
      } catch {}
    }
    node.innerHTML = node.textContent.trim().split(/\s+/).map((word) => `<span class="split-word">${word}</span>`).join(" ");
  });
}

function animateIntro() {
  if (prefersReduced) return;
  if ($(".da-site")) {
    const springEase = "cubic-bezier(.16,1,.3,1)";
    waapi($$(".da-scene-copy, .da-hero-profile, .da-product-card, .da-shop-tools, .da-buy-box, .product-gallery, .admin-panel, .admin-kpi"), [
      { opacity: 0, transform: "translateY(14px)" },
      { opacity: 1, transform: "translateY(0)" }
    ], { duration: 420, delay: 40, easing: springEase }, 38);
    return;
  }
  const words = $$("[data-split] .split-word");
  const springEase = "cubic-bezier(.18,1.18,.32,1)";
  let animeGuideMotion = false;

  if (state.anime?.animate && state.anime?.stagger) {
    try {
      state.anime.animate(words, {
        opacity: [0, 1],
        translateY: [36, 0],
        rotateX: [16, 0],
        filter: ["blur(10px)", "blur(0px)"],
        delay: state.anime.stagger(38, { start: 100 }),
        duration: 900,
        ease: state.anime.spring ? state.anime.spring({ bounce: .18, duration: 650 }) : "out(3)"
      });
      state.anime.animate(".trace", {
        strokeDashoffset: [680, 0],
        delay: state.anime.stagger(130, { start: 260 }),
        duration: 1250,
        ease: state.anime.spring ? state.anime.spring({ bounce: .28, duration: 720 }) : "out(3)"
      });
      state.anime.animate(".guide-orbit path", {
        strokeDashoffset: [700, 0],
        delay: state.anime.stagger(160, { start: 340 }),
        duration: 1300,
        ease: state.anime.spring ? state.anime.spring({ bounce: .2, duration: 760 }) : "out(3)"
      });
      state.anime.animate(".card-accent", {
        scaleX: [0, 1],
        transformOrigin: "0 50%",
        delay: state.anime.stagger(52, { start: 220 }),
        duration: 760,
        ease: state.anime.spring ? state.anime.spring({ bounce: .16, duration: 520 }) : "out(3)"
      });
      state.anime.animate(".bar-fill", {
        scaleX: [0, 1],
        transformOrigin: "0 50%",
        delay: state.anime.stagger(24, { start: 420 }),
        duration: 620,
        ease: state.anime.spring ? state.anime.spring({ bounce: .12, duration: 480 }) : "out(3)"
      });
      animeGuideMotion = true;
    } catch {
      waapi(words, [
        { opacity: 0, transform: "translateY(36px) rotateX(16deg)", filter: "blur(10px)" },
        { opacity: 1, transform: "translateY(0) rotateX(0deg)", filter: "blur(0)" }
      ], { duration: 900, easing: springEase }, 38);
    }
  } else {
    waapi(words, [
      { opacity: 0, transform: "translateY(36px) rotateX(16deg)", filter: "blur(10px)" },
      { opacity: 1, transform: "translateY(0) rotateX(0deg)", filter: "blur(0)" }
    ], { duration: 900, delay: 100, easing: springEase }, 38);
    waapi(".trace", [
      { strokeDashoffset: 680 },
      { strokeDashoffset: 0 }
    ], { duration: 1250, delay: 260, easing: springEase }, 130);
    waapi(".guide-orbit path", [
      { strokeDashoffset: 700 },
      { strokeDashoffset: 0 }
    ], { duration: 1300, delay: 340, easing: springEase }, 160);
  }

  if (!animeGuideMotion) {
    waapi(".card-accent", [
      { transform: "scaleX(0)" },
      { transform: "scaleX(1)" }
    ], { duration: 760, delay: 180, easing: springEase }, 52);
    waapi(".bar-fill", [
      { transform: "scaleX(0)" },
      { transform: "scaleX(1)" }
    ], { duration: 620, delay: 420, easing: springEase }, 24);
  }

  waapi($$(".hero-copy > .eyebrow, .hero-copy > p, .home-cinema-copy > p, .storefront-copy > p, .commerce-copy > p, .home-v5-copy > p, .guide-studio-copy > p, .guide-practical-copy > p, .brand-hero-copy > .eyebrow, .brand-hero-copy > p, .hero-controls, .hero-actions, .hero-console, .cinema-stage, .storefront-visual, .commerce-interface, .home-v5-media, .ritual-dock, .guide-studio-stage, .guide-practical-media, .product-card, .product-gallery, .product-buy-box, .admin-panel, .admin-kpi"), [
    { opacity: 0, transform: "translateY(18px)" },
    { opacity: 1, transform: "translateY(0)" }
  ], { duration: 720, delay: 160, easing: springEase }, 62);
}

function initGuideReveals() {
  if (prefersReduced || !("IntersectionObserver" in window)) return;
  const items = $$(".section .product-card, .section [data-card], .pdp-details [data-card], .pdp-story-v5 article, .education-grid article, .origin-block [data-card], .visual-story-card, .mission-band, .origin-rhythm, .coffee-chooser, .product-path, .path-card, .origin-service, .morning-panel, .club-signup, .quick-buy-bar, .taste-lab, .taste-matrix a, .shop-floor, .shop-tile, .origin-proof, .bundle-club, .answer-card, .compare-guide, .brew-cards article, .home-v5-products, .v5-product-card, .origin-v5, .trust-v5 article, .club-v5, .catalogue-v5-guide, .home-shop-strip, .ritual-window, .strip-product, .decision-steps article, .brew-map, .origin-explainer, .guide-scroll-copy article, .guide-method-wall, .guide-path article, .checkout-grid [data-card], .catalogue-toolbox");
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      entry.target.animate([
        { opacity: 0, transform: "translateY(20px)", filter: "blur(7px)" },
        { opacity: 1, transform: "translateY(0)", filter: "blur(0)" }
      ], {
        duration: 620,
        delay: Number.parseInt(entry.target.style.getPropertyValue("--reveal-delay") || "0", 10),
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "both"
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: .16, rootMargin: "0px 0px -8% 0px" });

  items.forEach((item, index) => {
    item.classList.add("reveal-item");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
    observer.observe(item);
  });
}

function initScroll() {
  const update = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const progress = clamp(scrollY / max, 0, 1);
    root.style.setProperty("--scroll", progress.toFixed(4));
  };
  update();
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update, { passive: true });
}

function initPointer() {
  addEventListener("pointermove", (event) => {
    root.style.setProperty("--mx", `${event.clientX}px`);
    root.style.setProperty("--my", `${event.clientY}px`);
    state.pointer.x = event.clientX;
    state.pointer.y = event.clientY;
    const card = event.target.closest("[data-card], .product-card, .admin-panel, .admin-kpi, .hero-console");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
    card.style.setProperty("--spot-y", `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
  }, { passive: true });
}

function initCanvas() {
  const canvas = $("#ambient-canvas");
  if (!canvas || prefersReduced) return;
  const ctx = canvas.getContext("2d", { alpha: true });
  const colors = ["#9c6418", "#cfb298", "#527a36", "#7442ad", "#b93830"];
  let width = 0;
  let height = 0;
  let dpr = 1;

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.7);
    width = innerWidth;
    height = innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = clamp(Math.round(width * height / 56000), 28, 70);
    state.particles = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .18,
      vy: -.08 - Math.random() * .22,
      r: .8 + Math.random() * 2.3,
      color: colors[index % colors.length],
      phase: Math.random() * Math.PI * 2
    }));
  };

  const draw = (time) => {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    state.particles.forEach((dot, index) => {
      dot.x += dot.vx + Math.sin(time * .001 + dot.phase) * .06;
      dot.y += dot.vy;
      if (dot.y < -20) dot.y = height + 20;
      if (dot.x < -20) dot.x = width + 20;
      if (dot.x > width + 20) dot.x = -20;
      const pulseValue = .65 + Math.sin(time * .002 + index) * .35;
      ctx.beginPath();
      ctx.globalAlpha = .1 + pulseValue * .08;
      ctx.fillStyle = dot.color;
      ctx.arc(dot.x, dot.y, dot.r + pulseValue, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(draw);
  };

  resize();
  addEventListener("resize", resize);
  requestAnimationFrame(draw);
}

function initProfileControls() {
  const wrappers = $$("[data-profile-controls]");
  if (!wrappers.length) return;

  wrappers.forEach((wrapper) => {
    const scope = wrapper.closest("[data-profile-root]") || document;
    const stageImage = $("[data-stage-image]", scope);
    const stageName = $("[data-stage-name]", scope);
    const stageLabel = $("[data-stage-label]", scope);
    const stagePrice = $("[data-stage-price]", scope);
    const stageLink = $("[data-stage-link]", scope);
    const hero = scope instanceof Element && scope.matches("[data-hero]") ? scope : $("[data-hero]", scope);

    wrapper.addEventListener("click", (event) => {
      const button = event.target.closest("[data-profile]");
      if (!button) return;
      $$("[data-profile]", wrapper).forEach((node) => node.classList.toggle("active", node === button));
      if (stageImage) {
        stageImage.src = button.dataset.image;
        stageImage.alt = `${button.dataset.name} Nubia`;
        pulse(stageImage);
      }
      if (stageName) stageName.textContent = button.dataset.name || "";
      if (stageLabel) stageLabel.textContent = button.dataset.label || "";
      if (stagePrice) stagePrice.textContent = button.dataset.price || "";
      if (stageLink && button.dataset.url) stageLink.href = button.dataset.url;
      if (hero && button.dataset.accent) hero.style.setProperty("--accent", button.dataset.accent);
      if (hero && button.dataset.soft) hero.style.setProperty("--soft", button.dataset.soft);
      if (button.dataset.ritualTarget) {
        const productCard = document.querySelector(`[data-product-card="${button.dataset.ritualTarget}"]`);
        if (productCard) {
          productCard.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
          pulse(productCard);
        }
      }
      track("product_select", { product: button.dataset.profile, source: "hero_control" });
    });
  });
}

function initProductTracking() {
  const slug = document.body.dataset.productSlug;
  if (slug) track("product_view", { product: slug });
  $$("[data-product-card]").forEach((card) => card.addEventListener("mouseenter", () => {
    track("product_select", { product: card.dataset.productCard, source: "hover" });
  }, { once: true }));
  track("page_view", { route: document.body.dataset.route || "boutique" });
}

async function boot() {
  root.classList.add("motion-ready");
  state.anime = await loadAnime();
  root.dataset.animeEngine = state.anime ? "animejs" : "local-spring-fallback";

  await loadProducts().catch(() => {});
  initCompareProfiles();
  initLanguage();
  splitText();
  initScroll();
  initGuideReveals();
  initPointer();
  initCanvas();
  initProfileControls();
  initCart();
  initQuantity();
  initGallery();
  initVariants();
  initFilters();
  initSearch();
  initBulk();
  initForms();
  initCheckout();
  initProductTracking();
  animateIntro();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
