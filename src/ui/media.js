import { escapeHtml } from "./escape.js";

export function mediaFigure(entity, { className = "media-frame" } = {}) {
  const url = entity?.image;
  if (!url) {
    return `<div class="${className} media-placeholder" role="img" aria-label="No verified image yet">No verified image yet</div>`;
  }
  const alt = escapeHtml(entity.imageAlt || entity.name || entity.title || "Cultural image");
  const caption = entity.imageCredit
    ? `<figcaption class="media-credit">${escapeHtml(entity.imageCaption || entity.imageCredit)}${entity.imageLicense ? ` · ${escapeHtml(entity.imageLicense)}` : ""}${
        entity.imageSourceUrl
          ? ` · <a href="${escapeHtml(entity.imageSourceUrl)}" target="_blank" rel="noreferrer">Source</a>`
          : ""
      }</figcaption>`
    : "";
  return `<figure class="${className}">
    <img src="${escapeHtml(url)}" alt="${alt}" loading="lazy" />
    ${caption}
  </figure>`;
}
