import { data, verificationStates } from "../../src/data/culture-data.js";

function records() {
  return [
    ...data.regions.map((item) => ({ type: "region", item })),
    ...data.traditions.map((item) => ({ type: "tradition", item })),
    ...data.creators.map((item) => ({ type: "creator", item })),
    ...data.artworks.map((item) => ({ type: "artwork", item })),
    ...data.events.map((item) => ({ type: "event", item })),
    ...data.workshops.map((item) => ({ type: "workshop", item })),
    ...data.sites.map((item) => ({ type: "site", item }))
  ];
}

export function structuredSearch(query) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  if (!terms.length) return [];

  return records()
    .map(({ type, item }) => {
      const haystack = JSON.stringify(item).toLowerCase();
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      return {
        id: item.id,
        type,
        title: item.name || item.title,
        summary: item.intro || item.bio || item.description || item.summary,
        verification: item.verification,
        verificationLabel: verificationStates[item.verification] || "Unverified",
        isDemo: Boolean(item.isDemo),
        sourceCount: item.sourceIds?.length || 0,
        score
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || b.sourceCount - a.sourceCount);
}
