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
    title: "Explorer / Customer Demo",
    email: "explorer-customer@artlens.demo",
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
  creatorFilter: "all",
  session: JSON.parse(sessionStorage.getItem("artLensSession") || "null"),
  user: JSON.parse(localStorage.getItem("artLensUserState") || "{\"following\":[],\"saved\":[],\"support\":[],\"registeredEvents\":[],\"recent\":[]}")
};

function saveSession(session) {
  state.session = session;
  sessionStorage.setItem("artLensSession", JSON.stringify(session));
}

function saveUserState() {
  localStorage.setItem("artLensUserState", JSON.stringify(state.user));
}

function toggleListValue(listName, value) {
  const list = state.user[listName];
  state.user[listName] = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
  saveUserState();
}

function rememberRecent(type, id) {
  state.user.recent = [{ type, id }, ...state.user.recent.filter((item) => item.type !== type || item.id !== id)].slice(0, 6);
  saveUserState();
}

function entityTitle(type, id) {
  const collections = {
    creator: data.creators,
    tradition: data.traditions,
    work: data.artworks,
    event: data.events,
    workshop: data.workshops,
    site: data.sites
  };
  const entity = collections[type]?.find((item) => item.id === id);
  return entity?.name || entity?.title || id;
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
      <section class="role-grid two-role-grid" aria-label="Choose how to continue">
        <button class="role-card explorer-card" data-select-role="explorer">
          <span class="role-icon">⌕</span>
          <small>Explorer / Customer</small>
          <strong>Explore and Support Culture</strong>
          <p>Discover traditions, artisans, artworks, events, cultural locations, saved items, and demo support flows.</p>
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
          <button class="state-card ${item.status}" data-region-state="${item.name}">
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
  const isCreator = type === "creator";
  const isEvent = type === "event";
  const followerBase = entity.followers || (isCreator ? 420 + entity.traditionIds.length * 85 : 0);
  const followed = isCreator && state.user.following.includes(entity.id);
  const saved = state.user.saved.includes(`${type}:${entity.id}`);
  return `
    <article class="card reveal">
      ${image}
      <div class="card-body">
        <div class="badges">${badge(entity)}</div>
        <h3>${title}</h3>
        <p>${description}</p>
        ${options.meta ? `<small class="meta">${options.meta}</small>` : ""}
        ${
          isCreator
            ? `<div class="mini-metrics"><span>${followerBase + (followed ? 1 : 0)} followers</span><span>${data.artworks.filter((work) => work.creatorId === entity.id).length} works</span><span>${data.events.filter((event) => event.creatorIds?.includes(entity.id)).length} events</span></div>`
            : ""
        }
        <div class="card-actions">
          <button class="text-button" data-open="${type}:${entity.id}">Explore</button>
          ${isCreator ? `<button class="text-button" data-follow="${entity.id}">${followed ? "Unfollow" : "Follow"}</button>` : ""}
          ${isCreator ? `<button class="text-button support" data-support="${entity.id}">Support Artisan</button>` : ""}
          ${!isCreator ? `<button class="text-button" data-save="${type}:${entity.id}">${saved ? "Saved" : "Save"}</button>` : ""}
          ${isEvent ? `<button class="text-button" data-register-event="${entity.id}">${state.user.registeredEvents.includes(entity.id) ? "Registered" : "Register / Contact"}</button>` : ""}
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
      <section class="section">
        <div class="section-head">
          <p class="eyebrow">Following</p>
          <h2>Your creator network</h2>
          <p>Followed creators appear here so the experience feels like a living platform, not a static directory.</p>
        </div>
        ${renderFollowingBlock()}
      </section>
    </main>
  `, active);
}

function renderFollowingBlock() {
  const creators = data.creators.filter((creator) => state.user.following.includes(creator.id));
  if (!creators.length) {
    return `<div class="empty-card"><h3>No creators followed yet.</h3><p>Follow an artisan to build your personal cultural network.</p></div>`;
  }
  return `<div class="grid">${creators.map((creator) => card(creator, "creator")).join("")}</div>`;
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
          <button data-nav="My Art">Upload Artwork</button>
          <button data-nav="Products">Add Product</button>
          <button data-nav="Events">Create Event</button>
          <button data-nav="Events">Add Workshop</button>
          <button data-nav="Profile">Edit Profile</button>
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
        <div class="india-map real-map" aria-label="Full India cultural map">
          <img class="india-map-image" src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Political%20map%20of%20India.svg" alt="Political map of India showing Indian states" />
          <button class="gujarat-hotspot" data-map-state="Gujarat" aria-label="Open Gujarat cultural network">
            <span>Gujarat</span>
          </button>
          ${states.filter((item) => item.name !== "Gujarat").map((item, index) => `<button class="state-node ${item.status}" style="--x:${62 + (index % 2) * 20}%;--y:${18 + index * 13}%;" data-map-state="${item.name}">${item.name}<small>Coming soon</small></button>`).join("")}
          ${data.mapMarkers.map((marker) => `<button class="culture-marker ${marker.kind}" style="--x:${marker.x}%;--y:${marker.y}%;" data-marker="${marker.id}"><span>${marker.kind}</span>${marker.label}</button>`).join("")}
        </div>
        <aside class="side-panel" id="mapInfo">
          ${renderGujaratInfo()}
        </aside>
      </div>
    </main>
  `, "Discover");
}

function renderGujaratInfo() {
  return `
    <div class="badges"><span class="badge source_backed">Gujarat Active</span><span class="badge demo">Demo slice</span></div>
    <h3>Gujarat arts and artisans</h3>
    <p>Current complete demo region: Kutch. Explore source-aware crafts, demo creators, cultural works, events, workshops, and support actions.</p>
    <div class="map-summary-grid">
      <div><strong>${data.traditions.length}</strong><span>Arts and traditions</span></div>
      <div><strong>${data.creators.length}</strong><span>Demo artisans</span></div>
      <div><strong>${data.artworks.length}</strong><span>Cultural works</span></div>
      <div><strong>${data.events.length}</strong><span>Events</span></div>
    </div>
    <h4>Arts</h4>
    <div class="pill-row">${data.traditions.map((item) => `<button data-open="tradition:${item.id}">${item.name}</button>`).join("")}</div>
    <h4>Artisans</h4>
    <div class="pill-row">${data.creators.map((item) => `<button data-open="creator:${item.id}">${item.name}</button>`).join("")}</div>
  `;
}

function renderCreatorStudio(active = "My Art") {
  app.innerHTML = shell(`
    <main class="section creator-studio">
      <div class="section-head">
        <p class="eyebrow">Creator studio</p>
        <h1>Upload artwork</h1>
        <p>Save a culturally contextualized draft before publishing. This is a prototype workflow; uploaded files are not sent to storage yet.</p>
      </div>
      <div class="studio-layout">
        <form class="studio-form" id="artworkDraftForm">
          <label>Artwork name<input name="name" value="Tree of Life Cloth Panel" required /></label>
          <label>Category<input name="category" value="Textile painting" required /></label>
          <label>Tradition<select name="tradition">${data.traditions.map((tradition) => `<option>${tradition.name}</option>`).join("")}</select></label>
          <label>Description<textarea name="description" rows="3">A cloth work connected to Rogan Painting and Kutch cultural storytelling.</textarea></label>
          <label>Cultural significance<textarea name="significance" rows="3">Explain the story, practice, motifs, and relationship to the living tradition before listing it as a supportable work.</textarea></label>
          <label>Materials<input name="materials" value="Cloth, oil-based pigment paste, metal stylus" /></label>
          <label>Region<input name="region" value="Kutch, Gujarat" /></label>
          <label>Images<input name="images" type="file" multiple /></label>
          <label>Optional video<input name="video" type="file" /></label>
          <label>Price if applicable<input name="price" value="Demo inquiry only" /></label>
          <label>Availability<select name="availability"><option>Draft</option><option>Available for support inquiry</option><option>Unavailable</option></select></label>
          <label>Tags<input name="tags" value="rogan, kutch, textile, demo" /></label>
          <div class="card-actions">
            <button class="button" type="submit" data-draft-action="draft">Save as draft</button>
            <button class="button primary" type="submit" data-draft-action="preview">Preview before publishing</button>
          </div>
        </form>
        <aside class="draft-preview" id="draftPreview">
          <p class="eyebrow">Preview</p>
          <h2>Your first artwork starts here.</h2>
          <p>Complete the form to generate a reviewable draft card.</p>
        </aside>
      </div>
    </main>
  `, active);
}

function renderProductManagement(active = "Products") {
  app.innerHTML = shell(`
    <main class="section">
      <div class="section-head">
        <p class="eyebrow">Product management</p>
        <h1>Supportable works, not a generic marketplace</h1>
        <p>Products stay connected to cultural context, creator story, source status, and support interest.</p>
      </div>
      <div class="grid">
        ${data.products.map((product) => `
          <article class="card">
            <div class="card-body">
              <div class="badges">${badge(product)}</div>
              <h3>${product.title}</h3>
              <p>${product.description}</p>
              <div class="mini-metrics">
                <span>${product.views} views</span>
                <span>${product.likes} likes</span>
                <span>${product.supportInterest} support inquiries</span>
              </div>
              <p><strong>${product.availability}</strong></p>
              <div class="card-actions">
                <button class="text-button">Edit</button>
                <button class="text-button">Mark unavailable</button>
                <button class="text-button" data-open="work:${product.artworkId}">View cultural work</button>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    </main>
  `, active);
}

function renderCreatorsPage(active = "Creators") {
  const filters = [
    ["all", "All creators"],
    ["textile", "Textile arts"],
    ["upcoming", "Upcoming events"],
    ["popular", "Popular"]
  ];
  const creators = data.creators
    .filter((creator) => {
      if (state.creatorFilter === "textile") {
        return creator.traditionIds.some((id) => {
          const category = traditionById.get(id)?.category.toLowerCase() || "";
          return category.includes("textile") || category.includes("needle") || category.includes("printing");
        });
      }
      if (state.creatorFilter === "upcoming") {
        return data.events.some((event) => event.creatorIds?.includes(creator.id));
      }
      return true;
    })
    .sort((a, b) => (state.creatorFilter === "popular" ? (b.followers || 0) - (a.followers || 0) : 0));

  app.innerHTML = shell(`
    <main class="section">
      <div class="section-head">
        <p class="eyebrow">Creators</p>
        <h1>Browse artisans by culture, region, and activity</h1>
        <p>Each creator card keeps practice, followers, works, events, support, and verification visible.</p>
      </div>
      <div class="filter-bar">
        ${filters.map(([id, label]) => `<button class="${state.creatorFilter === id ? "active" : ""}" data-creator-filter="${id}">${label}</button>`).join("")}
      </div>
      ${
        creators.length
          ? `<div class="grid">${creators.map((item) => card(item, "creator", { meta: `${item.yearsPractice} • ${item.recentActivity}` })).join("")}</div>`
          : `<div class="empty-card"><h3>No creators found.</h3><p>More creators will appear as sourced Gujarat records are onboarded.</p></div>`
      }
    </main>
  `, active);
}

function renderEventsPage(active = "Events") {
  const eventCards = data.events.map((event) => {
    const traditions = event.traditionIds.map((id) => traditionById.get(id)?.name).filter(Boolean).join(", ");
    const registered = state.user.registeredEvents.includes(event.id);
    const saved = state.user.saved.includes(`event:${event.id}`);
    return `
      <article class="event-card">
        <img src="${event.image}" alt="${event.title}" loading="lazy" />
        <div class="event-body">
          <div class="badges">${badge(event)}</div>
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          <dl class="event-facts">
            <div><dt>Date</dt><dd>${event.date}</dd></div>
            <div><dt>Time</dt><dd>${event.time}</dd></div>
            <div><dt>Location</dt><dd>${event.location}</dd></div>
            <div><dt>Distance</dt><dd>${event.distance}</dd></div>
            <div><dt>Organizer</dt><dd>${event.organizer}</dd></div>
            <div><dt>Traditions</dt><dd>${traditions}</dd></div>
            <div><dt>Status</dt><dd>${event.seats}</dd></div>
          </dl>
          <div class="card-actions">
            <button class="text-button" data-open="event:${event.id}">View Details</button>
            <button class="text-button" data-save="event:${event.id}">${saved ? "Saved" : "Save Event"}</button>
            <button class="text-button support" data-register-event="${event.id}">${registered ? "Registered" : "Register / Contact"}</button>
          </div>
        </div>
      </article>
    `;
  });

  app.innerHTML = shell(`
    <main class="section">
      <div class="section-head">
        <p class="eyebrow">Events</p>
        <h1>Cultural events and experiences</h1>
        <p>Events appear here and remain linked back to creators, traditions, map locations, and sources.</p>
      </div>
      <div class="event-grid">${eventCards.join("")}</div>
      <div class="empty-card subtle-empty">
        <h3>No additional events found nearby.</h3>
        <p>More events will be added only when there is sourced or creator-submitted data.</p>
      </div>
    </main>
  `, active);
}

function renderMarkerInfo(marker) {
  const tradition = traditionById.get(marker.traditionId);
  const creator = creatorById.get(marker.creatorId);
  const site = data.sites.find((item) => item.id === marker.siteId);
  const event = data.events.find((item) => item.id === marker.eventId);
  const workshop = data.workshops.find((item) => item.id === marker.workshopId);
  return `
    <div class="badges"><span class="badge source_backed">Gujarat Active</span><span class="badge">${marker.kind}</span></div>
    <h3>${marker.label}</h3>
    <p>${site?.description || "A cultural discovery point in Gujarat."}</p>
    <dl class="marker-facts">
      <div><dt>Traditional craft</dt><dd>${tradition?.name || "Linked tradition"}</dd></div>
      <div><dt>Creator</dt><dd>${creator?.name || "Creator to be linked"}</dd></div>
      <div><dt>Experience</dt><dd>${workshop?.title || "Workshop discovery available"}</dd></div>
      <div><dt>Upcoming event</dt><dd>${event?.title || "No event linked yet"}</dd></div>
      <div><dt>Distance</dt><dd>${marker.distance}</dd></div>
    </dl>
    <div class="card-actions">
      <button class="text-button" data-open="tradition:${marker.traditionId}">Explore Tradition</button>
      ${creator ? `<button class="text-button" data-open="creator:${creator.id}">View Creator</button>` : ""}
      ${event ? `<button class="text-button" data-open="event:${event.id}">View Event</button>` : ""}
    </div>
  `;
}

function renderComingSoon(title) {
  app.innerHTML = shell(`
    <main class="section empty-state">
      <p class="eyebrow">Coming next</p>
      <h1>${title}</h1>
      ${title === "Saved" || title === "Profile" ? renderUserDashboard(title) : "<p>This screen has its route in place. The next commits will expand it without fabricating unavailable cultural records.</p>"}
    </main>
  `, title);
}

function renderUserDashboard(title) {
  const saved = state.user.saved.map((key) => {
    const [type, id] = key.split(":");
    return { type, id, title: entityTitle(type, id) };
  });
  const support = state.user.support;
  const recent = state.user.recent.map((item) => ({ ...item, title: entityTitle(item.type, item.id) }));

  return `
    <div class="profile-grid">
      <article class="profile-panel">
        <p class="eyebrow">My profile</p>
        <h2>${demoProfiles[state.session.role].title}</h2>
        <p>Exploring Gujarat manually. Demo account for SIH prototype flow.</p>
      </article>
      <article class="profile-panel">
        <p class="eyebrow">Following</p>
        <h2>${state.user.following.length} creators</h2>
        ${state.user.following.length ? state.user.following.map((id) => `<button class="list-button" data-open="creator:${id}">${entityTitle("creator", id)}</button>`).join("") : "<p>No creators followed yet.</p>"}
      </article>
      <article class="profile-panel">
        <p class="eyebrow">Saved</p>
        <h2>${saved.length} items</h2>
        ${saved.length ? saved.map((item) => `<button class="list-button" data-open="${item.type}:${item.id}">${item.title}</button>`).join("") : "<p>No saved items yet.</p>"}
      </article>
      <article class="profile-panel">
        <p class="eyebrow">My support</p>
        <h2>${support.length} demo contributions</h2>
        ${support.length ? support.map((item) => `<p>${item.amount} for ${entityTitle("creator", item.creatorId)}: ${item.reason}</p>`).join("") : "<p>No demo support recorded yet.</p>"}
      </article>
      <article class="profile-panel">
        <p class="eyebrow">My events</p>
        <h2>${state.user.registeredEvents.length} registered</h2>
        ${state.user.registeredEvents.length ? state.user.registeredEvents.map((id) => `<button class="list-button" data-open="event:${id}">${entityTitle("event", id)}</button>`).join("") : "<p>No event registrations yet.</p>"}
      </article>
      <article class="profile-panel">
        <p class="eyebrow">Recently explored</p>
        <h2>${recent.length} records</h2>
        ${recent.length ? recent.map((item) => `<button class="list-button" data-open="${item.type}:${item.id}">${item.title}</button>`).join("") : "<p>Open a tradition, creator, or event to start your trail.</p>"}
      </article>
    </div>
  `;
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
    product: data.products,
    site: data.sites
  };
  const entity = collections[type]?.find((item) => item.id === id);
  if (!entity) return;
  rememberRecent(type, id);

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
    <div class="card-actions">
      ${type === "creator" ? `<button class="button primary" data-follow="${entity.id}">${state.user.following.includes(entity.id) ? "Unfollow" : "Follow"}</button><button class="button primary" data-support="${entity.id}">Support Artisan</button>` : ""}
      ${type !== "creator" ? `<button class="button" data-save="${type}:${entity.id}">${state.user.saved.includes(`${type}:${entity.id}`) ? "Saved" : "Save"}</button>` : ""}
      ${type === "event" ? `<button class="button primary" data-register-event="${entity.id}">${state.user.registeredEvents.includes(entity.id) ? "Registered" : "Register / Contact"}</button>` : ""}
    </div>
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
    ...data.products.map((item) => ({ type: "product", item })),
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
      <label>Amount<select name="amount"><option>₹250</option><option>₹500</option><option>₹1000</option></select></label>
      <label>Reason<select name="reason"><option>Support craft continuity</option><option>Workshop interest</option><option>Commission inquiry</option></select></label>
      <p class="warning">Demo transaction — no real money will be transferred.</p>
      <button class="button primary" type="button" data-confirm-support="${creatorId}">Confirm demo support</button>
    </form>
  `;
  dialog.showModal();
}

function routeNav(label) {
  if (label === "Home") renderExplorerHome(label);
  else if (label === "Discover") renderDiscover();
  else if (label === "Creators") renderCreatorsPage(label);
  else if (label === "Events") renderEventsPage(label);
  else if (label === "Dashboard") renderCreatorDashboard(label);
  else if (label === "My Art") renderCreatorStudio(label);
  else if (label === "Products") renderProductManagement(label);
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
  const selectedState = event.target.closest("[data-region-state]")?.dataset.regionState;
  const mapState = event.target.closest("[data-map-state]")?.dataset.mapState;
  const open = event.target.closest("[data-open]")?.dataset.open;
  const site = event.target.closest("[data-site]")?.dataset.site;
  const markerId = event.target.closest("[data-marker]")?.dataset.marker;
  const support = event.target.closest("[data-support]")?.dataset.support;
  const follow = event.target.closest("[data-follow]")?.dataset.follow;
  const save = event.target.closest("[data-save]")?.dataset.save;
  const registerEvent = event.target.closest("[data-register-event]")?.dataset.registerEvent;
  const confirmSupport = event.target.closest("[data-confirm-support]")?.dataset.confirmSupport;
  const creatorFilter = event.target.closest("[data-creator-filter]")?.dataset.creatorFilter;

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
  if (mapState) {
    if (mapState === "Gujarat") {
      const panel = document.querySelector("#mapInfo");
      if (panel) panel.innerHTML = renderGujaratInfo();
    } else {
      const panel = document.querySelector("#mapInfo");
      if (panel) {
        panel.innerHTML = `<div class="badges"><span class="badge unverified">Coming Soon</span></div><h3>${mapState}</h3><p>Data for this region is coming soon.</p><p>No cultural records have been fabricated for this state.</p>`;
      }
    }
  }
  if (open) openEntity(open);
  if (site) openEntity(`site:${site}`);
  if (markerId) {
    const marker = data.mapMarkers.find((item) => item.id === markerId);
    const panel = document.querySelector("#mapInfo");
    if (marker && panel) panel.innerHTML = renderMarkerInfo(marker);
  }
  if (support) showSupport(support);
  if (follow) {
    toggleListValue("following", follow);
    routeNav(state.session?.role === "creator" ? "Dashboard" : "Home");
  }
  if (save) {
    toggleListValue("saved", save);
    dialogBody.innerHTML = `<h2>${state.user.saved.includes(save) ? "Saved" : "Removed from saved"}</h2><p class="lead">${entityTitle(...save.split(":"))}</p>`;
    dialog.showModal();
  }
  if (registerEvent) {
    toggleListValue("registeredEvents", registerEvent);
    dialogBody.innerHTML = `<h2>${state.user.registeredEvents.includes(registerEvent) ? "Demo registration saved" : "Registration removed"}</h2><p class="lead">${entityTitle("event", registerEvent)}</p><p>No real booking or payment occurred.</p>`;
    dialog.showModal();
  }
  if (confirmSupport) {
    const form = event.target.closest("form");
    const amount = new FormData(form).get("amount");
    const reason = new FormData(form).get("reason");
    state.user.support = [{ creatorId: confirmSupport, amount, reason, createdAt: new Date().toISOString() }, ...state.user.support];
    saveUserState();
    dialogBody.innerHTML = `<h2>Demo support recorded</h2><p class="lead">${amount} marked for ${entityTitle("creator", confirmSupport)}.</p><p>No real transaction occurred.</p>`;
  }
  if (creatorFilter) {
    state.creatorFilter = creatorFilter;
    renderCreatorsPage();
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
  if (event.target.id === "artworkDraftForm") {
    event.preventDefault();
    const form = new FormData(event.target);
    const preview = document.querySelector("#draftPreview");
    const action = event.submitter?.dataset.draftAction || "draft";
    preview.innerHTML = `
      <p class="eyebrow">${action === "preview" ? "Publishing preview" : "Draft saved"}</p>
      <h2>${form.get("name")}</h2>
      <p>${form.get("description")}</p>
      <dl class="marker-facts">
        <div><dt>Tradition</dt><dd>${form.get("tradition")}</dd></div>
        <div><dt>Region</dt><dd>${form.get("region")}</dd></div>
        <div><dt>Materials</dt><dd>${form.get("materials")}</dd></div>
        <div><dt>Availability</dt><dd>${form.get("availability")}</dd></div>
      </dl>
      <p class="warning">Demo draft only. A creator/admin review and source workflow is required before publishing cultural claims.</p>
    `;
  }
});

dialogClose.addEventListener("click", () => dialog.close());

render();
