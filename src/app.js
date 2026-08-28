import { data, verificationStates } from "./data/culture-data.js";

const app = document.querySelector("#app");
const dialog = document.querySelector("#entityDialog");
const dialogBody = document.querySelector("#dialogBody");
const dialogClose = document.querySelector("#dialogClose");

const sourceById = new Map(data.sources.map((source) => [source.id, source]));
const traditionById = new Map(data.traditions.map((tradition) => [tradition.id, tradition]));
const creatorById = new Map(data.creators.map((creator) => [creator.id, creator]));
const regionById = new Map(data.regions.map((region) => [region.id, region]));

const states = [
  { name: "Gujarat", status: "active", summary: "Complete demo data available for Kutch." },
  { name: "Rajasthan", status: "soon", summary: "ART-LENS is coming soon to this region." },
  { name: "Maharashtra", status: "soon", summary: "ART-LENS is coming soon to this region." },
  { name: "Tamil Nadu", status: "soon", summary: "ART-LENS is coming soon to this region." },
  { name: "West Bengal", status: "soon", summary: "ART-LENS is coming soon to this region." },
  { name: "Assam", status: "soon", summary: "ART-LENS is coming soon to this region." }
];

const demoProfiles = {
  explorer: {
    role: "explorer",
    title: "Explorer Demo",
    email: "explorer@artlens.demo",
    nav: ["Home", "Discover", "Creators", "Events", "Saved", "Profile"]
  },
  customer: {
    role: "customer",
    title: "Customer Demo",
    email: "customer@artlens.demo",
    nav: ["Home", "Discover", "Creators", "Events", "Saved", "Profile"]
  },
  creator: {
    role: "creator",
    title: "Creator Demo",
    email: "creator@artlens.demo",
    nav: ["Dashboard", "My Art", "Products", "Events", "Growth", "Notifications", "Profile"]
  }
};

const state = {
  screen: "role",
  selectedRole: null,
  session: JSON.parse(sessionStorage.getItem("artLensSession") || "null")
};

function saveSession(session) {
  state.session = session;
  sessionStorage.setItem("artLensSession", JSON.stringify(session));
}

function badge(entity) {
  const label = verificationStates[entity.verification] ?? "Unverified";
  const demo = entity.isDemo ? '<span class="badge demo">Demo / Sample Data</span>' : "";
  return `<span class="badge ${entity.verification}">${label}</span>${demo}`;
}

function sourceLinks(entity) {
  if (!entity.sourceIds?.length) {
    return '<p class="muted">No source attached yet. Keep this record out of verified flows.</p>';
  }
  return `<ul class="source-list">${entity.sourceIds
    .map((id) => sourceById.get(id))
    .filter(Boolean)
    .map((source) => `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.title}</a><span>${source.publisher}</span></li>`)
    .join("")}</ul>`;
}

function shell(content, active = "Home") {
  const profile = state.session ? demoProfiles[state.session.role] : null;
  const nav = profile?.nav || [];
  return `
    <header class="topbar">
      <button class="brand" data-route="role" aria-label="ART-LENS role selection">
        <span class="brand-mark">AL</span>
        <span>
          <strong>ART-LENS V2</strong>
          <small>${profile ? profile.title : "Digital Living Heritage Network"}</small>
        </span>
      </button>
      <nav class="nav" aria-label="Primary">
        ${nav.map((item) => `<button class="${item === active ? "active" : ""}" data-nav="${item}">${item}</button>`).join("")}
      </nav>
      ${profile ? `<button class="session-pill" data-logout><span>${profile.email}</span><strong>Sign out</strong></button>` : ""}
    </header>
    ${content}
    <footer class="footer">
      <p>ART-LENS V2 prototype. Cultural records in this build are demo/sample data unless explicitly verified.</p>
    </footer>
  `;
}

function renderRoleSelection() {
  app.innerHTML = `
    <main class="entry-screen">
      <div class="ambient-layer" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
      <section class="role-hero">
        <p class="eyebrow">Discover • Preserve • Connect</p>
        <h1>Welcome to ART-LENS</h1>
        <p>Discover culture. Meet creators. Keep traditions alive.</p>
      </section>
      <section class="role-grid" aria-label="Choose how to continue">
        <button class="role-card explorer-card" data-select-role="explorer">
          <span class="role-icon">⌕</span>
          <small>For cultural discovery</small>
          <strong>Explore as a User</strong>
          <p>Discover traditions, artisans, artworks, events, and cultural locations.</p>
        </button>
        <button class="role-card customer-card" data-select-role="customer">
          <span class="role-icon">₹</span>
          <small>For cultural support</small>
          <strong>Continue as a Customer</strong>
          <p>Follow creators, save works, attend events, and support artisans through demo flows.</p>
        </button>
        <button class="role-card creator-card" data-select-role="creator">
          <span class="role-icon">✺</span>
          <small>For practitioners</small>
          <strong>Join as an Artisan / Creator</strong>
          <p>Showcase works, publish workshops, track growth, and reach audiences beyond your region.</p>
        </button>
      </section>
    </main>
  `;
}

function renderLogin(role) {
  const profile = demoProfiles[role];
  const isCreator = role === "creator";
  app.innerHTML = `
    <main class="login-screen ${isCreator ? "creator-login" : "explorer-login"}">
      <div class="animated-culture-bg" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <section class="login-card" aria-labelledby="loginTitle">
        <button class="back-link" data-route="role">← Change role</button>
        <p class="eyebrow">${isCreator ? "Creator access" : "Explorer access"}</p>
        <h1 id="loginTitle">${isCreator ? "Welcome back, Creator." : "Continue your cultural journey."}</h1>
        <p class="muted">Demo mode is enabled for SIH review. No real password or payment credential is used.</p>
        <form id="loginForm">
          <label>Role<input value="${profile.title}" readonly /></label>
          <label>Email<input name="email" type="email" value="${profile.email}" autocomplete="email" required /></label>
          <label>Password<input name="password" type="password" value="demo-mode" autocomplete="current-password" required /></label>
          <div class="form-row">
            <label class="checkbox"><input type="checkbox" checked /> Remember demo session</label>
            <button type="button" class="link-button">Forgot password?</button>
          </div>
          <button class="button primary wide" type="submit">Sign in</button>
          <button class="button wide" type="button" data-create-demo>Create demo account</button>
        </form>
      </section>
    </main>
  `;
}

function renderRegionSelection() {
  app.innerHTML = shell(`
    <main class="section region-screen">
      <div class="section-head">
        <p class="eyebrow">Select your region</p>
        <h1>Where do you want to explore?</h1>
        <p>Gujarat is active for the current prototype. Other states are visible without fabricated cultural data.</p>
      </div>
      <div class="state-grid">
        ${states.map((item) => `
          <button class="state-card ${item.status}" data-state="${item.name}">
            <span>${item.status === "active" ? "Active" : "Coming soon"}</span>
            <strong>${item.name}</strong>
            <p>${item.summary}</p>
          </button>
        `).join("")}
      </div>
    </main>
  `);
}

function card(entity, type, options = {}) {
  const image = entity.image ? `<img src="${entity.image}" alt="${entity.name || entity.title}" loading="lazy" />` : "";
  const title = entity.name || entity.title;
  const description = entity.intro || entity.bio || entity.description || entity.summary;
  return `
    <article class="card reveal">
      ${image}
      <div class="card-body">
        <div class="badges">${badge(entity)}</div>
        <h3>${title}</h3>
        <p>${description}</p>
        ${options.meta ? `<small class="meta">${options.meta}</small>` : ""}
        <div class="card-actions">
          <button class="text-button" data-open="${type}:${entity.id}">Explore</button>
          ${type === "creator" ? `<button class="text-button support" data-support="${entity.id}">Support Artisan</button>` : ""}
        </div>
      </div>
    </article>
  `;
}

function renderExplorerHome(active = "Home") {
  const stats = [
    ["Traditions", data.traditions.length],
    ["Creators", data.creators.length],
    ["Works", data.artworks.length],
    ["Events", data.events.length]
  ];

  app.innerHTML = shell(`
    <main>
      <section class="hero explorer-home">
        <div class="hero-media" role="img" aria-label="White Rann of Kutch landscape"></div>
        <div class="hero-content">
          <p class="eyebrow">Exploring Gujarat</p>
          <h1>Discover Gujarat's Living Culture</h1>
          <p>Move through the cultural network from Kutch to traditions, creators, works, workshops, events, and sources.</p>
          <form class="search" id="searchForm" role="search">
            <label for="searchInput">Global search</label>
            <div>
              <input id="searchInput" name="query" type="search" placeholder="Try Rogan, Kutch, Gujarati textile, handicraft events" />
              <button type="submit">Search</button>
            </div>
          </form>
        </div>
      </section>
      <section class="section band">
        <div class="stats">${stats.map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("")}</div>
      </section>
      <section class="section">
        <div class="section-head">
          <p class="eyebrow">Local crafts and arts</p>
          <h2>Source-aware cultural traditions</h2>
          <p>Each card connects to creators, works, events, cultural sites, and references.</p>
        </div>
        <div class="grid">${data.traditions.map((item) => card(item, "tradition", { meta: regionById.get(item.regionId)?.name })).join("")}</div>
      </section>
      <section class="section band">
        <div class="section-head">
          <p class="eyebrow">Recommended</p>
          <h2>Because you explored Gujarat textiles</h2>
        </div>
        <div class="recommendation-strip">${data.creators.map((item) => card(item, "creator", { meta: `${item.role} • ${item.traditionIds.length} tradition links` })).join("")}</div>
      </section>
    </main>
  `, active);
}

function renderCreatorDashboard(active = "Dashboard") {
  const metrics = [
    ["Demo earnings", "₹18,400", "+12%"],
    ["Followers", "1,248", "+86"],
    ["Artwork likes", "3,920", "+214"],
    ["Profile views", "8,730", "+19%"]
  ];

  app.innerHTML = shell(`
    <main class="creator-dashboard">
      <section class="section dashboard-hero">
        <div>
          <p class="eyebrow">Demo analytics</p>
          <h1>Welcome back, Creator.</h1>
          <p>Sample dashboard showing how cultural practitioners can understand visibility, support, and event opportunities.</p>
        </div>
        <div class="quick-actions">
          <button>Upload Artwork</button>
          <button>Add Product</button>
          <button>Create Event</button>
          <button>Add Workshop</button>
          <button>Edit Profile</button>
          <button data-open="creator:creator-khatri-demo">View Public Profile</button>
        </div>
      </section>
      <section class="section band">
        <div class="analytics-grid">${metrics.map(([label, value, change]) => `<article><span>${label}</span><strong>${value}</strong><small>${change} demo change</small></article>`).join("")}</div>
      </section>
      <section class="section two-column">
        <article class="chart-panel">
          <div class="section-head">
            <p class="eyebrow">Growth</p>
            <h2>Visibility beyond local region</h2>
          </div>
          <div class="bar-chart" aria-label="Demo growth chart">
            <span style="height:38%"></span><span style="height:52%"></span><span style="height:48%"></span><span style="height:68%"></span><span style="height:76%"></span><span style="height:88%"></span>
          </div>
        </article>
        <article class="notifications-panel">
          <div class="section-head">
            <p class="eyebrow">Notifications</p>
            <h2>Recent activity</h2>
          </div>
          <ul class="activity-list">
            <li>Someone followed your demo creator profile.</li>
            <li>Your artwork received 12 new demo views.</li>
            <li>New cultural event near Kutch matches Rogan Painting.</li>
            <li>Your workshop draft needs verification sources.</li>
          </ul>
        </article>
      </section>
    </main>
  `, active);
}

function renderDiscover() {
  app.innerHTML = shell(`
    <main class="section">
      <div class="section-head">
        <p class="eyebrow">Discover</p>
        <h1>India cultural map</h1>
        <p>Gujarat is active. Other states are visible but intentionally limited until sourced data is available.</p>
      </div>
      <div class="discover-layout">
        <div class="india-map" aria-label="India cultural map">
          ${states.map((item, index) => `<button class="state-node ${item.status}" style="--x:${18 + index * 12}%;--y:${28 + (index % 3) * 18}%;" data-state="${item.name}">${item.name}</button>`).join("")}
        </div>
        <aside class="side-panel">
          <div class="badges"><span class="badge source_backed">Gujarat Active</span></div>
          <h3>Kutch cultural network</h3>
          <p>Rogan Painting, Kutch Embroidery, Ajrakh, Nirona Village, White Rann, Rann Utsav, demo creators, and workshops.</p>
          <div class="pill-row">${data.sites.map((site) => `<button data-site="${site.id}">${site.name}</button>`).join("")}</div>
        </aside>
      </div>
    </main>
  `, "Discover");
}

function renderComingSoon(title) {
  app.innerHTML = shell(`
    <main class="section empty-state">
      <p class="eyebrow">Coming next</p>
      <h1>${title}</h1>
      <p>This screen has its route in place. The next commits will expand it without fabricating unavailable cultural records.</p>
    </main>
  `, title);
}

function relationshipTrail(entity) {
  const region = regionById.get(entity.regionId);
  const traditions = (entity.traditionIds || entity.relatedTraditionIds || [entity.id])
    .map((id) => traditionById.get(id))
    .filter(Boolean);
  const creators = data.creators.filter((creator) => traditions.some((tradition) => creator.traditionIds.includes(tradition.id)));
  const works = data.artworks.filter((work) => traditions.some((tradition) => work.traditionIds.includes(tradition.id)));
  const events = data.events.filter((event) => traditions.some((tradition) => event.traditionIds.includes(tradition.id)));

  return `
    <div class="trail">
      <span>${region?.state ?? "India"}</span>
      <span>${region?.name ?? "Region"}</span>
      ${traditions.map((item) => `<span>${item.name}</span>`).join("")}
      ${creators.slice(0, 2).map((item) => `<span>${item.name}</span>`).join("")}
      ${works.slice(0, 2).map((item) => `<span>${item.title}</span>`).join("")}
      ${events.slice(0, 1).map((item) => `<span>${item.title}</span>`).join("")}
    </div>
  `;
}

function openEntity(target) {
  const [type, id] = target.split(":");
  const collections = {
    tradition: data.traditions,
    creator: data.creators,
    event: data.events,
    workshop: data.workshops,
    work: data.artworks,
    site: data.sites
  };
  const entity = collections[type]?.find((item) => item.id === id);
  if (!entity) return;

  const relatedTraditionIds = entity.traditionIds || entity.relatedTraditionIds || [entity.id];
  const relatedCreators = data.creators.filter((creator) => relatedTraditionIds.some((traditionId) => creator.traditionIds.includes(traditionId)));
  const relatedWorks = data.artworks.filter((work) => relatedTraditionIds.some((traditionId) => work.traditionIds.includes(traditionId)));
  const relatedEvents = data.events.filter((event) => relatedTraditionIds.some((traditionId) => event.traditionIds.includes(traditionId)));

  dialogBody.innerHTML = `
    <div class="badges">${badge(entity)}</div>
    <h2>${entity.name || entity.title}</h2>
    <p class="lead">${entity.intro || entity.bio || entity.description}</p>
    ${type === "creator" ? "<h3>The Story Behind the Craft</h3>" : ""}
    ${entity.significance ? `<h3>Cultural significance</h3><p>${entity.significance}</p>` : ""}
    ${entity.practice ? `<h3>Practice</h3><p>${entity.practice}</p>` : ""}
    ${entity.story ? `<p>${entity.story}</p>` : ""}
    <h3>Cultural connection</h3>
    ${relationshipTrail(entity)}
    <div class="detail-grid">
      <section><h3>Creators</h3>${relatedCreators.length ? relatedCreators.map((item) => `<button class="list-button" data-open="creator:${item.id}">${item.name}</button>`).join("") : "<p class='muted'>No creator linked yet.</p>"}</section>
      <section><h3>Works</h3>${relatedWorks.length ? relatedWorks.map((item) => `<button class="list-button" data-open="work:${item.id}">${item.title}</button>`).join("") : "<p class='muted'>No work linked yet.</p>"}</section>
      <section><h3>Events</h3>${relatedEvents.length ? relatedEvents.map((item) => `<button class="list-button" data-open="event:${item.id}">${item.title}</button>`).join("") : "<p class='muted'>No event linked yet.</p>"}</section>
    </div>
    ${type === "creator" ? `<button class="button primary" data-support="${entity.id}">Support Artisan</button>` : ""}
    <h3>Sources / References</h3>
    ${sourceLinks(entity)}
  `;
  dialog.showModal();
}

function runSearch(query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const records = [
    ...data.regions.map((item) => ({ type: "region", item })),
    ...data.traditions.map((item) => ({ type: "tradition", item })),
    ...data.creators.map((item) => ({ type: "creator", item })),
    ...data.artworks.map((item) => ({ type: "work", item })),
    ...data.events.map((item) => ({ type: "event", item })),
    ...data.workshops.map((item) => ({ type: "workshop", item })),
    ...data.sites.map((item) => ({ type: "site", item }))
  ];
  const results = records.filter(({ item }) => terms.every((term) => JSON.stringify(item).toLowerCase().includes(term)));
  dialogBody.innerHTML = `
    <h2>Global search</h2>
    <p class="lead">Results come from platform entities, not generated cultural claims.</p>
    <div class="search-results">
      ${results.length ? results.map(({ type, item }) => `<button class="search-result" data-open="${type}:${item.id}"><span>${type}</span><strong>${item.name || item.title}</strong><small>${verificationStates[item.verification] ?? "Unverified"}</small></button>`).join("") : "<p>No platform entities matched that query yet.</p>"}
    </div>
  `;
  dialog.showModal();
}

function showSupport(creatorId) {
  const creator = creatorById.get(creatorId);
  dialogBody.innerHTML = `
    <h2>Support Artisan</h2>
    <p class="lead">Help this creator continue their craft.</p>
    <p><strong>${creator?.name ?? "Demo Creator"}</strong></p>
    <form class="support-form">
      <label>Amount<select><option>₹250</option><option>₹500</option><option>₹1000</option></select></label>
      <label>Reason<select><option>Support craft continuity</option><option>Workshop interest</option><option>Commission inquiry</option></select></label>
      <p class="warning">Demo transaction — no real money will be transferred.</p>
      <button class="button primary" type="button" data-confirm-support>Confirm demo support</button>
    </form>
  `;
  dialog.showModal();
}

function routeNav(label) {
  if (label === "Home") renderExplorerHome(label);
  else if (label === "Discover") renderDiscover();
  else if (label === "Creators") {
    app.innerHTML = shell(`<main class="section"><div class="section-head"><p class="eyebrow">Creators</p><h1>Browse artisans</h1></div><div class="grid">${data.creators.map((item) => card(item, "creator")).join("")}</div></main>`, label);
  } else if (label === "Events") {
    app.innerHTML = shell(`<main class="section"><div class="section-head"><p class="eyebrow">Events</p><h1>Cultural events</h1></div><div class="grid">${data.events.map((item) => card(item, "event", { meta: `${item.date} • ${item.location}` })).join("")}</div></main>`, label);
  } else if (label === "Dashboard") renderCreatorDashboard(label);
  else renderComingSoon(label);
}

function render() {
  if (!state.session) {
    state.screen === "login" ? renderLogin(state.selectedRole || "explorer") : renderRoleSelection();
    return;
  }
  if (state.session.role === "creator") {
    renderCreatorDashboard();
    return;
  }
  renderRegionSelection();
}

document.body.addEventListener("click", (event) => {
  const role = event.target.closest("[data-select-role]")?.dataset.selectRole;
  const route = event.target.closest("[data-route]")?.dataset.route;
  const logout = event.target.closest("[data-logout]");
  const createDemo = event.target.closest("[data-create-demo]");
  const nav = event.target.closest("[data-nav]")?.dataset.nav;
  const selectedState = event.target.closest("[data-state]")?.dataset.state;
  const open = event.target.closest("[data-open]")?.dataset.open;
  const site = event.target.closest("[data-site]")?.dataset.site;
  const support = event.target.closest("[data-support]")?.dataset.support;
  const confirmSupport = event.target.closest("[data-confirm-support]");

  if (role) {
    state.selectedRole = role;
    state.screen = "login";
    render();
  }
  if (route === "role" || logout) {
    sessionStorage.removeItem("artLensSession");
    state.session = null;
    state.screen = "role";
    render();
  }
  if (createDemo) {
    saveSession({ role: state.selectedRole || "explorer", createdAt: new Date().toISOString() });
    render();
  }
  if (nav) routeNav(nav);
  if (selectedState) {
    if (selectedState === "Gujarat") renderExplorerHome();
    else {
      dialogBody.innerHTML = `<h2>${selectedState}</h2><p class="lead">ART-LENS is coming soon to this region.</p><p>No cultural data has been fabricated for this state.</p>`;
      dialog.showModal();
    }
  }
  if (open) openEntity(open);
  if (site) openEntity(`site:${site}`);
  if (support) showSupport(support);
  if (confirmSupport) {
    dialogBody.innerHTML = `<h2>Demo support recorded</h2><p class="lead">This simulated support action is now part of the prototype flow. No real transaction occurred.</p>`;
  }
});

document.body.addEventListener("submit", (event) => {
  if (event.target.id === "loginForm") {
    event.preventDefault();
    saveSession({ role: state.selectedRole || "explorer", createdAt: new Date().toISOString() });
    render();
  }
  if (event.target.id === "searchForm") {
    event.preventDefault();
    const query = new FormData(event.target).get("query").toString().trim();
    if (query) runSearch(query);
  }
});

dialogClose.addEventListener("click", () => dialog.close());

render();
