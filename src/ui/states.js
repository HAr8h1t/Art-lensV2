import { escapeHtml } from "./escape.js";

export function emptyState({ title = "Nothing here yet.", body = "", action = "" } = {}) {
  return `<div class="state-card empty-card" role="status">
    <h3>${escapeHtml(title)}</h3>
    ${body ? `<p>${body}</p>` : ""}
    ${action}
  </div>`;
}

export function errorState({ title = "We couldn't load this content.", body = "Please try again." } = {}) {
  return `<div class="state-card error-card" role="alert">
    <h3>${escapeHtml(title)}</h3>
    <p>${escapeHtml(body)}</p>
  </div>`;
}

export function loadingState(label = "Loading") {
  return `<div class="state-card loading-card" role="status" aria-live="polite" aria-label="${escapeHtml(label)}">
    <div class="skeleton-row"></div>
    <div class="skeleton-row short"></div>
    <div class="skeleton-row"></div>
  </div>`;
}
