import { escapeHtml } from "./escape.js";

export function sourceLinks(entity, sourceById) {
  if (!entity?.sourceIds?.length) {
    return '<p class="muted">No source attached yet. Keep this record out of verified flows.</p>';
  }
  return `<ul class="source-list">${entity.sourceIds
    .map((id) => sourceById.get(id))
    .filter(Boolean)
    .map(
      (source) =>
        `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a><span>${escapeHtml(source.publisher)}</span></li>`
    )
    .join("")}</ul>`;
}
