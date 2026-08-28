import { data, verificationStates } from "./data/culture-data.js";

const $ = (selector) => document.querySelector(selector);

const sourceById = new Map(data.sources.map((source) => [source.id, source]));
const traditionById = new Map(data.traditions.map((tradition) => [tradition.id, tradition]));
const creatorById = new Map(data.creators.map((creator) => [creator.id, creator]));
const regionById = new Map(data.regions.map((region) => [region.id, region]));

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

function card(entity, type) {
  const image = entity.image ? `<img src="${entity.image}" alt="${entity.name || entity.title}" loading="lazy" />` : "";
  const title = entity.name || entity.title;
  const description = entity.intro || entity.bio || entity.description || entity.summary;
  return `
    <article class="card">
      ${image}
      <div class="card-body">
        <div class="badges">${badge(entity)}</div>
        <h3>${title}</h3>
        <p>${description}</p>
        <button class="text-button" data-open="${type}:${entity.id}">Open connected view</button>
      </div>
    </article>
  `;
}

function renderStats() {
  const stats = [
    ["Regions", data.regions.length],
    ["Traditions", data.traditions.length],
    ["Demo creators", data.creators.length],
    ["Works", data.artworks.length],
    ["Sites", data.sites.length],
    ["Events", data.events.length],
    ["Sources", data.sources.length]
  ];
  $("#networkStats").innerHTML = stats.map(([label, value]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join("");
}

function renderGrids() {
  $("#traditionGrid").innerHTML = data.traditions.map((item) => card(item, "tradition")).join("");
  $("#creatorGrid").innerHTML = data.creators.map((item) => card(item, "creator")).join("");
  $("#eventGrid").innerHTML = data.events.map((item) => card(item, "event")).join("");
}

function renderMap() {
  const canvas = $("#mapCanvas");
  canvas.innerHTML = data.sites
    .map((site, index) => {
      const top = index === 0 ? 45 : 22;
      const left = index === 0 ? 38 : 62;
      return `
        <button class="map-pin" style="top:${top}%;left:${left}%;" data-site="${site.id}">
          <span>${site.name}</span>
        </button>
      `;
    })
    .join("");
  renderSiteDetail(data.sites[0].id);
}

function renderSiteDetail(siteId) {
  const site = data.sites.find((item) => item.id === siteId);
  const traditions = site.relatedTraditionIds.map((id) => traditionById.get(id)).filter(Boolean);
  $("#mapDetail").innerHTML = `
    <div class="badges">${badge(site)}</div>
    <h3>${site.name}</h3>
    <p>${site.description}</p>
    <h4>Connected traditions</h4>
    <div class="pill-row">${traditions.map((item) => `<button data-open="tradition:${item.id}">${item.name}</button>`).join("")}</div>
    <h4>Sources</h4>
    ${sourceLinks(site)}
  `;
}

function renderTrustTable() {
  const records = [
    ...data.traditions.map((item) => ["Tradition", item]),
    ...data.creators.map((item) => ["Creator", item]),
    ...data.artworks.map((item) => ["Work", item]),
    ...data.events.map((item) => ["Event", item]),
    ...data.workshops.map((item) => ["Workshop", item])
  ];

  $("#trustTable").innerHTML = `
    <div class="trust-row heading">
      <span>Type</span><span>Record</span><span>Status</span><span>Source coverage</span>
    </div>
    ${records
      .map(([type, item]) => `
        <button class="trust-row" data-open="${type.toLowerCase()}:${item.id}">
          <span>${type}</span>
          <strong>${item.name || item.title}</strong>
          <span>${verificationStates[item.verification]}</span>
          <span>${item.sourceIds?.length ? `${item.sourceIds.length} linked` : "Needs source"}</span>
        </button>
      `)
      .join("")}
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
    work: data.artworks
  };
  const entity = collections[type]?.find((item) => item.id === id);
  if (!entity) return;

  const relatedCreators = data.creators.filter((creator) =>
    (entity.traditionIds || [entity.id]).some((traditionId) => creator.traditionIds.includes(traditionId))
  );
  const relatedWorks = data.artworks.filter((work) =>
    (entity.traditionIds || [entity.id]).some((traditionId) => work.traditionIds.includes(traditionId))
  );
  const relatedEvents = data.events.filter((event) =>
    (entity.traditionIds || [entity.id]).some((traditionId) => event.traditionIds.includes(traditionId))
  );

  $("#dialogBody").innerHTML = `
    <div class="badges">${badge(entity)}</div>
    <h2>${entity.name || entity.title}</h2>
    <p class="lead">${entity.intro || entity.bio || entity.description}</p>
    ${entity.significance ? `<h3>Cultural significance</h3><p>${entity.significance}</p>` : ""}
    ${entity.practice ? `<h3>Practice</h3><p>${entity.practice}</p>` : ""}
    ${entity.story ? `<h3>Creator story</h3><p>${entity.story}</p>` : ""}
    <h3>Relationship path</h3>
    ${relationshipTrail(entity)}
    <div class="detail-grid">
      <section>
        <h3>Creators</h3>
        ${relatedCreators.length ? relatedCreators.map((item) => `<button class="list-button" data-open="creator:${item.id}">${item.name}</button>`).join("") : "<p class='muted'>No creator linked yet.</p>"}
      </section>
      <section>
        <h3>Works</h3>
        ${relatedWorks.length ? relatedWorks.map((item) => `<button class="list-button" data-open="work:${item.id}">${item.title}</button>`).join("") : "<p class='muted'>No work linked yet.</p>"}
      </section>
      <section>
        <h3>Events</h3>
        ${relatedEvents.length ? relatedEvents.map((item) => `<button class="list-button" data-open="event:${item.id}">${item.title}</button>`).join("") : "<p class='muted'>No event linked yet.</p>"}
      </section>
    </div>
    <h3>Sources and verification</h3>
    ${sourceLinks(entity)}
  `;
  $("#entityDialog").showModal();
}

function searchableRecords() {
  return [
    ...data.regions.map((item) => ({ type: "region", item })),
    ...data.traditions.map((item) => ({ type: "tradition", item })),
    ...data.creators.map((item) => ({ type: "creator", item })),
    ...data.artworks.map((item) => ({ type: "work", item })),
    ...data.events.map((item) => ({ type: "event", item })),
    ...data.workshops.map((item) => ({ type: "workshop", item })),
    ...data.sites.map((item) => ({ type: "site", item }))
  ];
}

function runSearch(query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = searchableRecords().filter(({ item }) => {
    const haystack = JSON.stringify(item).toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });

  const body = results.length
    ? results
        .map(({ type, item }) => `
          <button class="search-result" ${type === "site" || type === "region" ? "" : `data-open="${type}:${item.id}"`}>
            <span>${type}</span>
            <strong>${item.name || item.title}</strong>
            <small>${verificationStates[item.verification] ?? "Unverified"}</small>
          </button>
        `)
        .join("")
    : "<p>No platform entities matched that query yet. Add or verify records before expanding AI answers.</p>";

  $("#dialogBody").innerHTML = `
    <h2>Structured search results</h2>
    <p class="lead">Results come from platform entities, not generated cultural claims.</p>
    <div class="search-results">${body}</div>
  `;
  $("#entityDialog").showModal();
}

function bindEvents() {
  document.body.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-open]");
    const siteButton = event.target.closest("[data-site]");
    if (openButton) openEntity(openButton.dataset.open);
    if (siteButton) renderSiteDetail(siteButton.dataset.site);
  });

  $("#dialogClose").addEventListener("click", () => $("#entityDialog").close());
  $("#searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query").toString().trim();
    if (query) runSearch(query);
  });
}

renderStats();
renderGrids();
renderMap();
renderTrustTable();
bindEvents();
