import { verificationStates } from "../data/culture-data.js";
import { escapeHtml } from "./escape.js";

export function badges(entity, variant = "default") {
  if (!entity) return "";
  const label = verificationStates[entity.verification] ?? "Unverified";
  const demoLabel =
    variant === "creator" ? "Sample creator — demonstration data" : "Demo / sample data";
  const demo = entity.isDemo ? `<span class="badge demo">${escapeHtml(demoLabel)}</span>` : "";
  return `<span class="badge ${escapeHtml(entity.verification || "unverified")}">${escapeHtml(label)}</span>${demo}`;
}
