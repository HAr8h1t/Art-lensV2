import { escapeHtml } from "./escape.js";
import { badges } from "./badges.js";
import { mediaFigure } from "./media.js";

function actions(buttons) {
  return `<div class="card-actions">${buttons.filter(Boolean).join("")}</div>`;
}

export function traditionCard(entity, { region } = {}) {
  return `<article class="card card-tradition">
    ${mediaFigure(entity)}
    <div class="card-body">
      <div class="badges">${badges(entity)}</div>
      <h3>${escapeHtml(entity.name)}</h3>
      <p class="meta">${escapeHtml(region?.name || entity.origin || "Region pending")}</p>
      <p>${escapeHtml(entity.intro)}</p>
      ${actions([
        `<button class="text-button primary-text" data-open="tradition:${entity.id}">Explore</button>`,
        `<button class="text-button" data-save="tradition:${entity.id}">Save</button>`
      ])}
    </div>
  </article>`;
}

export function creatorCard(entity, { region, traditionNames, followed }) {
  return `<article class="card card-creator">
    ${mediaFigure(entity, { className: "media-frame portrait" })}
    <div class="card-body">
      <div class="badges">${badges(entity, "creator")}</div>
      <h3>${escapeHtml(entity.name)}</h3>
      <p class="meta">${escapeHtml(traditionNames || entity.role)} · ${escapeHtml(region?.name || "Kutch")}</p>
      <p>${escapeHtml(entity.bio)}</p>
      ${actions([
        `<button class="text-button" data-open="creator:${entity.id}">View profile</button>`,
        `<button class="text-button" data-follow="${entity.id}">${followed ? "Unfollow" : "Follow"}</button>`,
        `<button class="text-button support" data-support="${entity.id}">Support <span class="demo-tag">demo</span></button>`
      ])}
    </div>
  </article>`;
}

export function eventCard(entity, { saved, registered }) {
  return `<article class="card card-event event-card">
    ${mediaFigure(entity)}
    <div class="card-body event-body">
      <div class="badges">${badges(entity)}</div>
      <h3>${escapeHtml(entity.title)}</h3>
      <p class="meta">${escapeHtml(entity.location)}${entity.date ? ` · ${escapeHtml(entity.date)}` : ""}</p>
      <p>${escapeHtml(entity.description)}</p>
      ${actions([
        `<button class="text-button primary-text" data-open="event:${entity.id}">View event</button>`,
        `<button class="text-button" data-save="event:${entity.id}">${saved ? "Saved" : "Save"}</button>`
      ])}
      <p class="muted">${registered ? "You marked interest in this demo record. No booking was made." : "ART-LENS does not take bookings."}</p>
    </div>
  </article>`;
}

export function placeCard(entity) {
  return `<article class="card card-place">
    ${mediaFigure(entity)}
    <div class="card-body">
      <div class="badges">${badges(entity)}</div>
      <p class="eyebrow">${escapeHtml(entity.type || "Place")}</p>
      <h3>${escapeHtml(entity.name)}</h3>
      <p>${escapeHtml(entity.description)}</p>
      ${entity.latitude != null ? `<p class="meta">Prepared for mapping · ${entity.latitude}, ${entity.longitude}</p>` : `<p class="meta">Coordinates not verified yet</p>`}
      ${actions([`<button class="text-button primary-text" data-open="site:${entity.id}">View place</button>`])}
    </div>
  </article>`;
}

export function workshopCard(entity) {
  return `<article class="card card-workshop">
    ${mediaFigure(entity)}
    <div class="card-body">
      <div class="badges">${badges(entity)}</div>
      <h3>${escapeHtml(entity.title)}</h3>
      <p class="meta">${escapeHtml(entity.location)} · ${escapeHtml(entity.date)}</p>
      <p>${escapeHtml(entity.description)}</p>
      ${actions([`<button class="text-button primary-text" data-open="workshop:${entity.id}">View workshop</button>`])}
    </div>
  </article>`;
}
