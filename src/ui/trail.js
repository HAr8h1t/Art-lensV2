import { escapeHtml } from "./escape.js";

export function relationshipTrail(entity, { regionById, traditionById, data }) {
  const region = regionById.get(entity.regionId);
  const traditionIds = entity.traditionIds || entity.relatedTraditionIds || (traditionById.has(entity.id) ? [entity.id] : []);
  const traditions = traditionIds.map((id) => traditionById.get(id)).filter(Boolean);
  const creators = data.creators.filter((creator) => traditions.some((tradition) => creator.traditionIds.includes(tradition.id)));
  const works = data.artworks.filter((work) => traditions.some((tradition) => work.traditionIds.includes(tradition.id)));
  const events = data.events.filter((event) => (event.traditionIds || []).some((id) => traditions.some((tradition) => tradition.id === id)));

  const parts = [
    region?.state ?? "India",
    region?.name,
    ...traditions.map((item) => item.name),
    ...creators.slice(0, 2).map((item) => item.name),
    ...works.slice(0, 2).map((item) => item.title),
    ...events.slice(0, 1).map((item) => item.title)
  ].filter(Boolean);

  if (!parts.length) return '<p class="muted">No relationship trail yet.</p>';
  return `<div class="trail" aria-label="Cultural relationship trail">${parts
    .map((part) => `<span>${escapeHtml(part)}</span>`)
    .join("")}</div>`;
}
