import { escapeHtml } from "./escape.js";

export const explorerNav = ["Explore", "Map", "Traditions", "Creators", "Events", "Saved"];
export const creatorNav = ["Dashboard", "My Art", "Works", "Events", "Profile"];

export function topbar({ brandLabel, nav, active, email, cta }) {
  return `
    <header class="topbar">
      <button class="brand" data-home aria-label="ART-LENS home">
        <span class="brand-mark" aria-hidden="true">AL</span>
        <span>
          <strong>ART-LENS</strong>
          <small>${escapeHtml(brandLabel)}</small>
        </span>
      </button>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primaryNav">Menu</button>
      <nav class="nav" id="primaryNav" aria-label="Primary">
        ${nav
          .map(
            (item) =>
              `<button type="button" class="${item === active ? "active" : ""}" data-nav="${escapeHtml(item)}" ${
                item === active ? 'aria-current="page"' : ""
              }>${escapeHtml(item)}</button>`
          )
          .join("")}
      </nav>
      <div class="topbar-end">
        ${cta ? `<button class="button primary" type="button" data-share-culture>${escapeHtml(cta)}</button>` : ""}
        ${
          email
            ? `<button class="session-pill" type="button" data-logout><span>${escapeHtml(email)}</span><strong>Sign out</strong></button>`
            : ""
        }
      </div>
    </header>
  `;
}
