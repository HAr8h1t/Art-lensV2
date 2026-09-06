import { data, verificationStates, mediaLibrary } from "./data/culture-data.js";
import { escapeHtml } from "./ui/escape.js";
import { badges } from "./ui/badges.js";
import { mediaFigure } from "./ui/media.js";
import { sourceLinks } from "./ui/sources.js";
import { relationshipTrail } from "./ui/trail.js";
import { emptyState, errorState } from "./ui/states.js";
import { traditionCard, creatorCard, eventCard, placeCard, workshopCard } from "./ui/cards.js";
import { topbar, explorerNav, creatorNav } from "./ui/nav.js";

const app = document.querySelector("#app");
const dialog = document.querySelector("#entityDialog");
const dialogBody = document.querySelector("#dialogBody");
const dialogClose = document.querySelector("#dialogClose");
const dialogTitle = document.querySelector("#dialogTitle");

const sourceById = new Map(data.sources.map((source) => [source.id, source]));
const traditionById = new Map(data.traditions.map((tradition) => [tradition.id, tradition]));
const creatorById = new Map(data.creators.map((creator) => [creator.id, creator]));
const regionById = new Map(data.regions.map((region) => [region.id, region]));
const siteById = new Map(data.sites.map((site) => [site.id, site]));

const demoProfiles = {
  explorer: {
    role: "explorer",
    title: "Explorer",
    email: "explorer-customer@artlens.demo",
    nav: explorerNav,
    cta: "Share Your Culture"
  },
  creator: {
    role: "creator",
    title: "Creator (demo shell)",
    email: "creator@artlens.demo",
    nav: creatorNav,
    cta: ""
  }
};

const collections = {
  tradition: data.traditions,
  creator: data.creators,
  event: data.events,
  workshop: data.workshops,
  artwork: data.artworks,
  product: data.products,
  site: data.sites,
  region: data.regions
};

const state = {
  screen: "role",
  selectedRole: null,
  activeNav: "Explore",
  creatorFilter: "all",
  session: JSON.parse(sessionStorage.getItem("artLensSession") || "null"),
  user: JSON.parse(
    localStorage.getItem("artLensUserState") ||
      '{"following":[],"saved":[],"support":[],"registeredEvents":[],"recent":[]}'
  )
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
  const entity = collections[type]?.find((item) => item.id === id);
  return entity?.name || entity?.title || id;
}

function traditionNames(creator) {
  return creator.traditionIds
    .map((id) => traditionById.get(id)?.name)
    .filter(Boolean)
    .join(", ");
}

function shell(content, active) {
  const profile = demoProfiles[state.session?.role];
  state.activeNav = active || state.activeNav;
  return `
    ${topbar({
      brandLabel: profile ? profile.title : "Digital Living Heritage Network",
      nav: profile?.nav || [],
      active: state.activeNav,
      email: profile?.email,
      cta: profile?.cta
    })}
    ${content}
    <footer class="footer">
      <p>ART-LENS prototype. Cultural records here are labelled demo or sample unless a source and verification state say otherwise.</p>
    </footer>
  `;
}

function renderRoleSelection() {
  app.innerHTML = `
    <main class="entry-screen">
      <section class="role-hero">
        <p class="eyebrow">India's Digital Living Heritage Network</p>
        <h1>Discover living culture through places, traditions, and creators.</h1>
        <p>ART-LENS connects regions to traditions, makers, works, stories, and experiences — without turning culture into a marketplace.</p>
      </section>
      <section class="role-grid two-role-grid" aria-label="Choose how to continue">
        <button class="role-card explorer-card" data-select-role="explorer">
          <small>Explorer</small>
          <strong>Explore culture</strong>
          <p>Find traditions, creators, places, and events in the Gujarat prototype.</p>
        </button>
        <button class="role-card creator-card" data-select-role="creator">
          <small>Practitioners</small>
          <strong>Creator demo shell</strong>
          <p>A labelled demonstration workspace. It is not a live creator platform yet.</p>
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
      <section class="login-card" aria-labelledby="loginTitle">
        <button class="back-link" data-route="role">← Change role</button>
        <p class="eyebrow">${isCreator ? "Creator access" : "Explorer access"}</p>
        <h1 id="loginTitle">${isCreator ? "Enter the creator demo shell." : "Continue your cultural journey."}</h1>
        <p class="muted">Demo mode for review. Any password is accepted. No real account is created.</p>
        <form id="loginForm">
          <label>Role<input value="${escapeHtml(profile.title)}" readonly /></label>
          <label>Email<input name="email" type="email" value="${escapeHtml(profile.email)}" autocomplete="username" required /></label>
          <label>Password<input name="password" type="password" value="demo-mode" autocomplete="current-password" required /></label>
          <button class="button primary wide" type="submit">Sign in</button>
          <button class="button wide" type="button" data-create-demo>Continue without an account</button>
        </form>
      </section>
    </main>
  `;
}

function renderRegionSelection() {
  app.innerHTML = shell(
    `
    <main class="section region-screen">
      <div class="section-head">
        <p class="eyebrow">Choose a region</p>
        <h1>Where do you want to explore?</h1>
        <p>Gujarat is the active prototype. Other states stay visible without invented cultural records.</p>
      </div>
      <div class="state-grid">
        ${data.states
          .map(
            (item) => `
          <button class="state-card ${item.status}" data-region-state="${escapeHtml(item.name)}">
            <span>${item.status === "active" ? "Active" : "Coming soon"}</span>
            <strong>${escapeHtml(item.name)}</strong>
            <p>${escapeHtml(item.summary)}</p>
          </button>
        `
          )
          .join("")}
      </div>
    </main>
  `,
    "Explore"
  );
}

function renderExplorerHome() {
  const kutch = regionById.get("region-kutch");
  app.innerHTML = shell(
    `
    <main>
      <section class="hero-editorial">
        <div class="hero-copy">
          <p class="eyebrow">Exploring Gujarat · Kutch</p>
          <h1>Discover the living culture of India.</h1>
          <p>ART-LENS helps you discover India's living culture through places, traditions, creators, stories and experiences.</p>
          <form class="search" id="searchForm" role="search">
            <label for="searchInput">Search the cultural network</label>
            <div>
              <input id="searchInput" name="query" type="search" placeholder="Search traditions, creators, places, events..." />
              <button type="submit">Search</button>
            </div>
          </form>
          <div class="hero-actions">
            <button class="button primary" data-nav="Traditions">Explore Gujarat traditions</button>
            <button class="button" data-nav="Map">Open the locator map</button>
          </div>
        </div>
        <div class="hero-visual">
          ${mediaFigure(kutch, { className: "media-frame hero-frame" })}
        </div>
      </section>
      <section class="section">
        <div class="section-head">
          <p class="eyebrow">Featured traditions</p>
          <h2>Crafts of Kutch in this prototype</h2>
        </div>
        <div class="grid tradition-grid">${data.traditions.map((item) => traditionCard(item, { region: kutch })).join("")}</div>
      </section>
      <section class="section band">
        <div class="section-head">
          <p class="eyebrow">Featured creators</p>
          <h2>Demonstration practitioner profiles</h2>
          <p>These accounts are labelled sample data. They are not verified living artisans onboarded to ART-LENS.</p>
        </div>
        <div class="grid">${data.creators
          .map((item) =>
            creatorCard(item, {
              region: kutch,
              traditionNames: traditionNames(item),
              followed: state.user.following.includes(item.id)
            })
          )
          .join("")}</div>
      </section>
      <section class="section">
        <div class="section-head">
          <p class="eyebrow">Cultural places</p>
          <h2>Locations prepared for mapping</h2>
        </div>
        <div class="grid">${data.sites.map((item) => placeCard(item)).join("")}</div>
      </section>
      <section class="section band">
        <div class="section-head">
          <p class="eyebrow">Upcoming experiences</p>
          <h2>Events and workshops</h2>
        </div>
        <div class="grid experience-grid">
          ${data.events
            .map((item) =>
              eventCard(item, {
                saved: state.user.saved.includes(`event:${item.id}`),
                registered: state.user.registeredEvents.includes(item.id)
              })
            )
            .join("")}
          ${data.workshops.map((item) => workshopCard(item)).join("")}
        </div>
      </section>
      <section class="section">
        <div class="section-head">
          <p class="eyebrow">How ART-LENS connects culture</p>
          <h2>A knowledge network, not a catalogue</h2>
        </div>
        <ol class="connect-steps">
          <li><strong>Region</strong> grounds the place.</li>
          <li><strong>Tradition</strong> names the living practice.</li>
          <li><strong>Creator</strong> is the practitioner or collective.</li>
          <li><strong>Artwork</strong> is a specific work.</li>
          <li><strong>Source</strong> keeps claims reviewable.</li>
          <li><strong>Site, event, workshop</strong> locate experience.</li>
        </ol>
      </section>
      <section class="section cta-band">
        <div class="section-head">
          <h2>Share a living practice</h2>
          <p>Creator tools are a labelled demonstration shell. They are not a live publishing platform yet.</p>
          <button class="button primary" data-share-culture>Share Your Culture</button>
        </div>
      </section>
    </main>
  `,
    "Explore"
  );
}

function renderTraditionsPage() {
  const kutch = regionById.get("region-kutch");
  app.innerHTML = shell(
    `
    <main class="section">
      <div class="section-head">
        <p class="eyebrow">Traditions</p>
        <h1>Living practices in the Gujarat slice</h1>
        <p>Each tradition stays linked to region, sources, and — where they exist — creators and places.</p>
      </div>
      <div class="grid tradition-grid">${data.traditions.map((item) => traditionCard(item, { region: kutch })).join("")}</div>
    </main>
  `,
    "Traditions"
  );
}

function renderDiscover() {
  app.innerHTML = shell(
    `
    <main class="section">
      <div class="section-head">
        <p class="eyebrow">Map</p>
        <h1>India locator</h1>
        <p>This is a placeholder locator, not a geographic map. Cultural places below carry latitude and longitude for Phase 2. Overlay pins are not used as coordinates.</p>
      </div>
      <div class="discover-layout">
        <div class="india-map real-map" aria-label="Locator map of India">
          <img class="india-map-image" src="${escapeHtml(mediaLibrary.indiaMap.url)}" alt="${escapeHtml(mediaLibrary.indiaMap.alt)}" />
          <button class="gujarat-hotspot" data-map-state="Gujarat" aria-label="Open Gujarat cultural network">
            <span>Gujarat</span>
          </button>
          ${data.states
            .filter((item) => item.name !== "Gujarat")
            .map(
              (item, index) =>
                `<button class="state-node ${item.status}" style="--x:${62 + (index % 2) * 20}%;--y:${18 + index * 13}%;" data-map-state="${escapeHtml(item.name)}">${escapeHtml(item.name)}<small>Coming soon</small></button>`
            )
            .join("")}
          <p class="map-caption">${escapeHtml(mediaLibrary.indiaMap.caption)} · ${escapeHtml(mediaLibrary.indiaMap.credit)}</p>
        </div>
        <aside class="side-panel" id="mapInfo">${renderGujaratInfo()}</aside>
      </div>
      <div class="section-head" style="margin-top:36px">
        <h2>Places with prepared coordinates</h2>
      </div>
      <div class="grid">${data.sites.map((item) => placeCard(item)).join("")}</div>
    </main>
  `,
    "Map"
  );
}

function renderGujaratInfo() {
  return `
    <div class="badges"><span class="badge source_backed">Gujarat active</span><span class="badge demo">Demo slice</span></div>
    <h3>Gujarat arts and artisans</h3>
    <p>Complete prototype region: Kutch. Ajrakh is not placed on the White Rann. Places without a sourced link are omitted.</p>
    <h4>Places</h4>
    <div class="pill-row">${data.sites
      .map((item) => `<button type="button" data-open="site:${item.id}">${escapeHtml(item.name)}</button>`)
      .join("")}</div>
    <h4>Traditions</h4>
    <div class="pill-row">${data.traditions
      .map((item) => `<button type="button" data-open="tradition:${item.id}">${escapeHtml(item.name)}</button>`)
      .join("")}</div>
  `;
}

function renderMarkerInfo(marker) {
  const tradition = traditionById.get(marker.traditionId);
  const creator = creatorById.get(marker.creatorId);
  const site = siteById.get(marker.siteId);
  const event = data.events.find((item) => item.id === marker.eventId);
  const workshop = data.workshops.find((item) => item.id === marker.workshopId);
  return `
    <div class="badges"><span class="badge source_backed">Gujarat</span><span class="badge">${escapeHtml(marker.kind)}</span></div>
    <h3>${escapeHtml(marker.label)}</h3>
    <p>${escapeHtml(site?.description || "A cultural discovery point in Gujarat.")}</p>
    <dl class="marker-facts">
      ${site ? `<div><dt>Place</dt><dd>${escapeHtml(site.name)}</dd></div>` : ""}
      ${site?.latitude != null ? `<div><dt>Coordinates</dt><dd>${site.latitude}, ${site.longitude}</dd></div>` : "<div><dt>Coordinates</dt><dd>Not verified yet</dd></div>"}
      ${tradition ? `<div><dt>Tradition</dt><dd>${escapeHtml(tradition.name)}</dd></div>` : ""}
      ${creator ? `<div><dt>Creator</dt><dd>${escapeHtml(creator.name)}</dd></div>` : ""}
      ${workshop ? `<div><dt>Workshop</dt><dd>${escapeHtml(workshop.title)}</dd></div>` : ""}
      ${event ? `<div><dt>Event</dt><dd>${escapeHtml(event.title)}</dd></div>` : ""}
    </dl>
    <div class="card-actions">
      ${site ? `<button class="text-button" data-open="site:${site.id}">View place</button>` : ""}
      ${tradition ? `<button class="text-button" data-open="tradition:${tradition.id}">Explore tradition</button>` : ""}
      ${creator ? `<button class="text-button" data-open="creator:${creator.id}">View creator</button>` : ""}
      ${event ? `<button class="text-button" data-open="event:${event.id}">View event</button>` : ""}
    </div>
  `;
}

function renderCreatorStudio() {
  app.innerHTML = shell(
    `
    <main class="section creator-studio">
      <div class="notice-banner" role="note">Demonstration workspace. Uploaded files stay in this browser session and are not published.</div>
      <div class="section-head">
        <p class="eyebrow">Creator studio</p>
        <h1>Draft a work</h1>
        <p>Save a culturally contextualized draft for review. This does not publish to the public network.</p>
      </div>
      <div class="studio-layout">
        <form class="studio-form" id="artworkDraftForm">
          <label>Artwork name<input name="name" value="Tree of Life Cloth Panel" required /></label>
          <label>Category<input name="category" value="Textile painting" required /></label>
          <label>Tradition<select name="tradition">${data.traditions
            .map((tradition) => `<option>${escapeHtml(tradition.name)}</option>`)
            .join("")}</select></label>
          <label>Description<textarea name="description" rows="3">A cloth work connected to Rogan Painting and Kutch cultural storytelling.</textarea></label>
          <label>Cultural significance<textarea name="significance" rows="3">Explain the story, practice, motifs, and relationship to the living tradition.</textarea></label>
          <label>Materials<input name="materials" value="Cloth, oil-based pigment paste, metal stylus" /></label>
          <label>Region<input name="region" value="Kutch, Gujarat" /></label>
          <label>Images<input name="images" type="file" multiple /></label>
          <div class="card-actions">
            <button class="button" type="submit" data-draft-action="draft">Save as draft</button>
            <button class="button primary" type="submit" data-draft-action="preview">Preview</button>
          </div>
        </form>
        <aside class="draft-preview" id="draftPreview">
          <p class="eyebrow">Preview</p>
          <h2>Draft preview</h2>
          <p>Complete the form to generate a reviewable card. Nothing is stored on a server.</p>
        </aside>
      </div>
    </main>
  `,
    "My Art"
  );
}

function renderProductManagement() {
  app.innerHTML = shell(
    `
    <main class="section">
      <div class="notice-banner" role="note">Supportable works are demonstration records. Editing and marketplace tools are not available yet.</div>
      <div class="section-head">
        <p class="eyebrow">Supportable works</p>
        <h1>Works that can carry a support path later</h1>
        <p>These stay connected to cultural context. They are not live products.</p>
      </div>
      <div class="grid">
        ${data.products
          .map(
            (product) => `
          <article class="card">
            ${mediaFigure(product)}
            <div class="card-body">
              <div class="badges">${badges(product)}</div>
              <h3>${escapeHtml(product.title)}</h3>
              <p>${escapeHtml(product.description)}</p>
              <p><strong>${escapeHtml(product.availability)}</strong></p>
              <div class="card-actions">
                <button class="text-button" data-open="artwork:${product.artworkId}">View cultural work</button>
              </div>
            </div>
          </article>
        `
          )
          .join("")}
      </div>
    </main>
  `,
    "Works"
  );
}

function renderCreatorsPage() {
  const filters = [
    ["all", "All creators"],
    ["textile", "Textile arts"],
    ["embroidery", "Embroidery"]
  ];
  const creators = data.creators.filter((creator) => {
    if (state.creatorFilter === "textile") {
      return creator.traditionIds.some((id) => {
        const category = traditionById.get(id)?.category.toLowerCase() || "";
        return category.includes("textile") || category.includes("needle") || category.includes("printing");
      });
    }
    if (state.creatorFilter === "embroidery") {
      return creator.traditionIds.includes("trad-kutch-embroidery");
    }
    return true;
  });

  app.innerHTML = shell(
    `
    <main class="section">
      <div class="section-head">
        <p class="eyebrow">Creators</p>
        <h1>Practitioners in this prototype</h1>
        <p>Every profile below is demonstration data unless a future submission says otherwise.</p>
      </div>
      <div class="filter-bar" role="group" aria-label="Filter creators">
        ${filters
          .map(
            ([id, label]) =>
              `<button type="button" class="${state.creatorFilter === id ? "active" : ""}" data-creator-filter="${id}">${label}</button>`
          )
          .join("")}
      </div>
      ${
        creators.length
          ? `<div class="grid">${creators
              .map((item) =>
                creatorCard(item, {
                  region: regionById.get(item.regionId),
                  traditionNames: traditionNames(item),
                  followed: state.user.following.includes(item.id)
                })
              )
              .join("")}</div>`
          : emptyState({ title: "Nothing here yet.", body: "No creators match this filter in the Gujarat slice." })
      }
    </main>
  `,
    "Creators"
  );
}

function renderEventsPage() {
  app.innerHTML = shell(
    `
    <main class="section">
      <div class="section-head">
        <p class="eyebrow">Events</p>
        <h1>Cultural events and experiences</h1>
        <p>ART-LENS does not take bookings. Follow official sources before travel.</p>
      </div>
      <div class="event-grid">
        ${data.events
          .map((event) =>
            eventCard(event, {
              saved: state.user.saved.includes(`event:${event.id}`),
              registered: state.user.registeredEvents.includes(event.id)
            })
          )
          .join("")}
      </div>
      <div class="section-head" style="margin-top:36px">
        <h2>Workshops</h2>
      </div>
      ${
        data.workshops.length
          ? `<div class="grid">${data.workshops.map((item) => workshopCard(item)).join("")}</div>`
          : emptyState({ title: "Nothing here yet.", body: "No sourced workshops are listed." })
      }
    </main>
  `,
    "Events"
  );
}

function renderCreatorDashboard() {
  app.innerHTML = shell(
    `
    <main class="creator-dashboard">
      <section class="section">
        <div class="notice-banner" role="note">Demonstration UI. There are no live earnings, followers, or analytics in this prototype.</div>
        <div class="dashboard-hero">
          <div>
            <p class="eyebrow">Creator demo shell</p>
            <h1>Welcome back.</h1>
            <p>This workspace shows how a practitioner might later understand visibility. Numbers are not connected to accounts.</p>
          </div>
          <div class="quick-actions">
            <button type="button" data-nav="My Art">Draft artwork</button>
            <button type="button" data-nav="Works">View supportable works</button>
            <button type="button" data-open="creator:creator-khatri-demo">View public demo profile</button>
          </div>
        </div>
      </section>
      <section class="section band">
        <div class="analytics-grid">
          <article><span>Sales</span><strong>No sales data yet</strong><small>Payments are not enabled</small></article>
          <article><span>Followers</span><strong>No live follower count</strong><small>Explorer follows stay on this device</small></article>
          <article><span>Analytics</span><strong>No analytics available</strong><small>Charts will wait for real activity</small></article>
        </div>
      </section>
    </main>
  `,
    "Dashboard"
  );
}

function renderUserDashboard(title) {
  const saved = state.user.saved.map((key) => {
    const [type, id] = key.split(":");
    return { type, id, title: entityTitle(type, id) };
  });
  const support = state.user.support;
  const recent = state.user.recent.map((item) => ({ ...item, title: entityTitle(item.type, item.id) }));
  const following = state.user.following.length
    ? state.user.following.map((id) => `<button class="list-button" data-open="creator:${id}">${escapeHtml(entityTitle("creator", id))}</button>`).join("")
    : emptyState({ title: "Nothing here yet.", body: "Follow a creator to build a personal network." });

  app.innerHTML = shell(
    `
    <main class="section">
      <div class="section-head">
        <p class="eyebrow">${escapeHtml(title)}</p>
        <h1>${title === "Profile" ? "Creator profile (demo)" : "Saved and following"}</h1>
        <p>These lists stay on this device. They are not a public account.</p>
      </div>
      <div class="profile-grid">
        <article class="profile-panel">
          <p class="eyebrow">Following</p>
          <h2>${state.user.following.length} creators</h2>
          ${following}
        </article>
        <article class="profile-panel">
          <p class="eyebrow">Saved</p>
          <h2>${saved.length} items</h2>
          ${
            saved.length
              ? saved.map((item) => `<button class="list-button" data-open="${item.type}:${item.id}">${escapeHtml(item.title)}</button>`).join("")
              : emptyState({ title: "Nothing here yet.", body: "Save a tradition, place, or event." })
          }
        </article>
        <article class="profile-panel">
          <p class="eyebrow">Demo support</p>
          <h2>${support.length} notes</h2>
          ${
            support.length
              ? support.map((item) => `<p>${escapeHtml(item.amount)} for ${escapeHtml(entityTitle("creator", item.creatorId))}: ${escapeHtml(item.reason)}</p>`).join("")
              : "<p>No demo support recorded. No money is transferred.</p>"
          }
        </article>
        <article class="profile-panel">
          <p class="eyebrow">Recently explored</p>
          <h2>${recent.length} records</h2>
          ${
            recent.length
              ? recent.map((item) => `<button class="list-button" data-open="${item.type}:${item.id}">${escapeHtml(item.title)}</button>`).join("")
              : "<p>Open a tradition, creator, or place to start a trail.</p>"
          }
        </article>
      </div>
    </main>
  `,
    title
  );
}

function relatedFor(entity, type) {
  const relatedTraditionIds =
    entity.traditionIds || entity.relatedTraditionIds || (type === "tradition" ? [entity.id] : []);
  return {
    relatedTraditionIds,
    relatedCreators: data.creators.filter((creator) => relatedTraditionIds.some((id) => creator.traditionIds.includes(id))),
    relatedWorks: data.artworks.filter((work) => relatedTraditionIds.some((id) => work.traditionIds.includes(id))),
    relatedEvents: data.events.filter((event) => (event.traditionIds || []).some((id) => relatedTraditionIds.includes(id))),
    relatedWorkshops: data.workshops.filter((workshop) => (workshop.traditionIds || []).some((id) => relatedTraditionIds.includes(id))),
    relatedSites: data.sites.filter((site) => (site.relatedTraditionIds || []).some((id) => relatedTraditionIds.includes(id)) || site.id === entity.siteId)
  };
}

function openEntity(target) {
  const [type, id] = target.split(":");
  const entity = collections[type]?.find((item) => item.id === id);
  if (!entity) {
    dialogTitle.textContent = "Unavailable";
    dialogBody.innerHTML = errorState({
      title: "We couldn't load this content.",
      body: "That record is not in the prototype dataset, or it cannot be opened yet."
    });
    dialog.showModal();
    return;
  }
  rememberRecent(type, id);
  const { relatedCreators, relatedWorks, relatedEvents, relatedWorkshops, relatedSites } = relatedFor(entity, type);
  const title = entity.name || entity.title;
  dialogTitle.textContent = title;
  const primary =
    type === "creator"
      ? `<button class="button" data-follow="${entity.id}">${state.user.following.includes(entity.id) ? "Unfollow" : "Follow"}</button>
         <button class="button primary" data-support="${entity.id}">Support artisan <span class="demo-tag">demo</span></button>`
      : type === "event"
        ? `<button class="button primary" data-save="event:${entity.id}">${state.user.saved.includes(`event:${entity.id}`) ? "Saved" : "Save"}</button>`
        : `<button class="button primary" data-save="${type}:${entity.id}">${state.user.saved.includes(`${type}:${entity.id}`) ? "Saved" : "Save"}</button>`;

  dialogBody.innerHTML = `
    ${mediaFigure(entity)}
    <div class="badges">${badges(entity, type === "creator" ? "creator" : "default")}</div>
    <p class="lead">${escapeHtml(entity.intro || entity.bio || entity.description)}</p>
    ${entity.significance ? `<h3>Cultural significance</h3><p>${escapeHtml(entity.significance)}</p>` : ""}
    ${entity.practice ? `<h3>Practice</h3><p>${escapeHtml(entity.practice)}</p>` : ""}
    ${entity.story ? `<p>${escapeHtml(entity.story)}</p>` : ""}
    <h3>Cultural connection</h3>
    ${relationshipTrail(entity, { regionById, traditionById, data })}
    <div class="detail-grid">
      <section><h3>Creators</h3>${relatedCreators.length ? relatedCreators.map((item) => `<button class="list-button" data-open="creator:${item.id}">${escapeHtml(item.name)}</button>`).join("") : '<p class="muted">Nothing here yet.</p>'}</section>
      <section><h3>Works</h3>${relatedWorks.length ? relatedWorks.map((item) => `<button class="list-button" data-open="artwork:${item.id}">${escapeHtml(item.title)}</button>`).join("") : '<p class="muted">Nothing here yet.</p>'}</section>
      <section><h3>Places</h3>${relatedSites.length ? relatedSites.map((item) => `<button class="list-button" data-open="site:${item.id}">${escapeHtml(item.name)}</button>`).join("") : '<p class="muted">Nothing here yet.</p>'}</section>
      <section><h3>Events</h3>${relatedEvents.length ? relatedEvents.map((item) => `<button class="list-button" data-open="event:${item.id}">${escapeHtml(item.title)}</button>`).join("") : '<p class="muted">Nothing here yet.</p>'}</section>
      <section><h3>Workshops</h3>${relatedWorkshops.length ? relatedWorkshops.map((item) => `<button class="list-button" data-open="workshop:${item.id}">${escapeHtml(item.title)}</button>`).join("") : '<p class="muted">Nothing here yet.</p>'}</section>
    </div>
    <div class="card-actions">${primary}</div>
    <h3>Sources / references</h3>
    ${sourceLinks(entity, sourceById)}
  `;
  dialog.showModal();
}

function searchTypeLabel(type) {
  const labels = {
    region: "Region",
    tradition: "Tradition",
    creator: "Creator",
    artwork: "Artwork",
    product: "Supportable work",
    event: "Event",
    workshop: "Workshop",
    site: "Site"
  };
  return labels[type] || type;
}

function runSearch(query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const records = [
    ...data.regions.map((item) => ({ type: "region", item })),
    ...data.traditions.map((item) => ({ type: "tradition", item })),
    ...data.creators.map((item) => ({ type: "creator", item })),
    ...data.artworks.map((item) => ({ type: "artwork", item })),
    ...data.events.map((item) => ({ type: "event", item })),
    ...data.workshops.map((item) => ({ type: "workshop", item })),
    ...data.sites.map((item) => ({ type: "site", item }))
  ];
  const results = records.filter(({ item }) => terms.every((term) => JSON.stringify(item).toLowerCase().includes(term)));
  dialogTitle.textContent = "Search";
  dialogBody.innerHTML = `
    <p class="lead">Results come from platform entities, not generated cultural claims.</p>
    <div class="search-results">
      ${
        results.length
          ? results
              .map(
                ({ type, item }) =>
                  `<button class="search-result" data-open="${type}:${item.id}"><span>${searchTypeLabel(type)}</span><strong>${escapeHtml(
                    item.name || item.title
                  )}</strong><small>${escapeHtml(verificationStates[item.verification] ?? "Unverified")}${item.isDemo ? " · Demo" : ""}</small></button>`
              )
              .join("")
          : emptyState({ title: "Nothing here yet.", body: "No platform entities matched that query." })
      }
    </div>
  `;
  dialog.showModal();
}

function showSupport(creatorId) {
  const creator = creatorById.get(creatorId);
  dialogTitle.textContent = "Support artisan";
  dialogBody.innerHTML = `
    <p class="lead">This is a demonstration note only. No payment is processed.</p>
    <p><strong>${escapeHtml(creator?.name ?? "Demo Creator")}</strong></p>
    ${badges(creator, "creator")}
    <form class="support-form">
      <label>Amount<select name="amount"><option>₹250</option><option>₹500</option><option>₹1000</option></select></label>
      <label>Reason<select name="reason"><option>Support craft continuity</option><option>Workshop interest</option><option>Commission inquiry</option></select></label>
      <p class="warning">Demo transaction — no real money will be transferred.</p>
      <button class="button primary" type="button" data-confirm-support="${creatorId}">Record demo support</button>
    </form>
  `;
  dialog.showModal();
}

function showShareCulture() {
  dialogTitle.textContent = "Share Your Culture";
  dialogBody.innerHTML = `
    <p class="lead">Creator publishing is not live yet. You can open the labelled creator demo shell to see the workspace.</p>
    <div class="card-actions">
      <button class="button primary" type="button" data-enter-creator-demo>Open creator demo shell</button>
    </div>
  `;
  dialog.showModal();
}

function routeNav(label) {
  if (label === "Explore" || label === "Home") renderExplorerHome();
  else if (label === "Map" || label === "Discover") renderDiscover();
  else if (label === "Traditions") renderTraditionsPage();
  else if (label === "Creators") renderCreatorsPage();
  else if (label === "Events") renderEventsPage();
  else if (label === "Dashboard") renderCreatorDashboard();
  else if (label === "My Art") renderCreatorStudio();
  else if (label === "Works" || label === "Products") renderProductManagement();
  else if (label === "Saved" || label === "Profile") renderUserDashboard(label);
  else {
    app.innerHTML = shell(
      `<main class="section">${emptyState({
        title: "Coming soon",
        body: "This route is reserved. ART-LENS will not invent a fake screen for it."
      })}</main>`,
      label
    );
  }
}

function goHome() {
  if (!state.session) {
    state.screen = "role";
    render();
    return;
  }
  if (state.session.role === "creator") renderCreatorDashboard();
  else renderExplorerHome();
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
  const toggle = event.target.closest(".nav-toggle");
  if (toggle) {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    document.querySelector("#primaryNav")?.classList.toggle("open", !expanded);
    return;
  }

  const role = event.target.closest("[data-select-role]")?.dataset.selectRole;
  const route = event.target.closest("[data-route]")?.dataset.route;
  const home = event.target.closest("[data-home]");
  const logout = event.target.closest("[data-logout]");
  const createDemo = event.target.closest("[data-create-demo]");
  const share = event.target.closest("[data-share-culture]");
  const enterCreator = event.target.closest("[data-enter-creator-demo]");
  const nav = event.target.closest("[data-nav]")?.dataset.nav;
  const selectedState = event.target.closest("[data-region-state]")?.dataset.regionState;
  const mapState = event.target.closest("[data-map-state]")?.dataset.mapState;
  const open = event.target.closest("[data-open]")?.dataset.open;
  const markerId = event.target.closest("[data-marker]")?.dataset.marker;
  const support = event.target.closest("[data-support]")?.dataset.support;
  const follow = event.target.closest("[data-follow]")?.dataset.follow;
  const save = event.target.closest("[data-save]")?.dataset.save;
  const confirmSupport = event.target.closest("[data-confirm-support]")?.dataset.confirmSupport;
  const creatorFilter = event.target.closest("[data-creator-filter]")?.dataset.creatorFilter;

  if (role) {
    state.selectedRole = role;
    state.screen = "login";
    render();
  }
  if (route === "role") {
    sessionStorage.removeItem("artLensSession");
    state.session = null;
    state.screen = "role";
    render();
  }
  if (home) goHome();
  if (logout) {
    sessionStorage.removeItem("artLensSession");
    state.session = null;
    state.screen = "role";
    render();
  }
  if (createDemo) {
    saveSession({ role: state.selectedRole || "explorer", createdAt: new Date().toISOString() });
    render();
  }
  if (share) showShareCulture();
  if (enterCreator) {
    dialog.close();
    saveSession({ role: "creator", createdAt: new Date().toISOString() });
    render();
  }
  if (nav) routeNav(nav);
  if (selectedState) {
    if (selectedState === "Gujarat") renderExplorerHome();
    else {
      dialogTitle.textContent = selectedState;
      dialogBody.innerHTML = `<p class="lead">ART-LENS is coming soon to this region.</p><p>No cultural data has been fabricated for this state.</p>`;
      dialog.showModal();
    }
  }
  if (mapState) {
    const panel = document.querySelector("#mapInfo");
    if (mapState === "Gujarat" && panel) panel.innerHTML = renderGujaratInfo();
    else if (panel) {
      panel.innerHTML = `<div class="badges"><span class="badge unverified">Coming soon</span></div><h3>${escapeHtml(
        mapState
      )}</h3><p>Data for this region is coming soon. No cultural records have been fabricated for this state.</p>`;
    }
  }
  if (open) openEntity(open);
  if (markerId) {
    const marker = data.mapMarkers.find((item) => item.id === markerId);
    const panel = document.querySelector("#mapInfo");
    if (marker && panel) panel.innerHTML = renderMarkerInfo(marker);
  }
  if (support) showSupport(support);
  if (follow) {
    toggleListValue("following", follow);
    if (dialog.open) dialog.close();
    routeNav(state.activeNav || (state.session?.role === "creator" ? "Dashboard" : "Explore"));
  }
  if (save) {
    toggleListValue("saved", save);
    dialogTitle.textContent = state.user.saved.includes(save) ? "Saved" : "Removed from saved";
    dialogBody.innerHTML = `<p class="lead">${escapeHtml(entityTitle(...save.split(":")))}</p>`;
    dialog.showModal();
  }
  if (confirmSupport) {
    const form = event.target.closest("form");
    const amount = new FormData(form).get("amount");
    const reason = new FormData(form).get("reason");
    state.user.support = [{ creatorId: confirmSupport, amount, reason, createdAt: new Date().toISOString() }, ...state.user.support];
    saveUserState();
    dialogTitle.textContent = "Demo support recorded";
    dialogBody.innerHTML = `<p class="lead">${escapeHtml(amount)} marked for ${escapeHtml(entityTitle("creator", confirmSupport))}.</p><p>No real transaction occurred.</p>`;
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
      <p class="eyebrow">${action === "preview" ? "Preview" : "Draft on this device"}</p>
      <h2>${escapeHtml(form.get("name"))}</h2>
      <p>${escapeHtml(form.get("description"))}</p>
      <p class="warning">Demo draft only. A review and source workflow is required before publishing cultural claims.</p>
    `;
  }
});

dialogClose.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

render();
