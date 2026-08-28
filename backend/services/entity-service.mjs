import { data, verificationStates } from "../../src/data/culture-data.js";

export function allEntities() {
  return {
    regions: data.regions,
    traditions: data.traditions,
    creators: data.creators,
    artworks: data.artworks,
    sites: data.sites,
    events: data.events,
    workshops: data.workshops,
    sources: data.sources,
    verificationStates
  };
}

export function getEntity(collectionName, id) {
  const collection = data[collectionName];
  if (!Array.isArray(collection)) return null;
  return collection.find((item) => item.id === id) || null;
}

export function reviewQueue() {
  const queueCollections = ["traditions", "creators", "artworks", "events", "workshops", "sites"];
  return queueCollections.flatMap((collectionName) =>
    data[collectionName].map((item) => ({
      id: item.id,
      type: collectionName.slice(0, -1),
      title: item.name || item.title,
      verification: item.verification,
      sourceCount: item.sourceIds?.length || 0,
      isDemo: Boolean(item.isDemo),
      needsSource: !item.sourceIds?.length,
      needsReview: item.verification === "unverified" || item.verification === "community_submitted"
    }))
  );
}

export function relationshipBundle(type, id) {
  const lookup = {
    tradition: ["traditions", "traditionIds"],
    creator: ["creators", "creatorIds"],
    artwork: ["artworks", "artworkIds"],
    product: ["products", "productIds"],
    event: ["events", "eventIds"],
    workshop: ["workshops", "workshopIds"],
    site: ["sites", "siteIds"]
  };
  const [collectionName] = lookup[type] || [];
  const entity = getEntity(collectionName, id);
  if (!entity) return null;

  const traditionIds = new Set(entity.traditionIds || entity.relatedTraditionIds || (type === "tradition" ? [entity.id] : []));
  const creatorIds = new Set(entity.creatorIds || (entity.creatorId ? [entity.creatorId] : []));

  for (const creator of data.creators) {
    if (creator.traditionIds.some((traditionId) => traditionIds.has(traditionId))) {
      creatorIds.add(creator.id);
    }
  }

  return {
    entity,
    region: data.regions.find((region) => region.id === entity.regionId) || null,
    traditions: data.traditions.filter((tradition) => traditionIds.has(tradition.id)),
    creators: data.creators.filter((creator) => creatorIds.has(creator.id)),
    artworks: data.artworks.filter((artwork) => artwork.traditionIds.some((traditionId) => traditionIds.has(traditionId))),
    sites: data.sites.filter((site) => site.relatedTraditionIds.some((traditionId) => traditionIds.has(traditionId))),
    events: data.events.filter((event) => event.traditionIds.some((traditionId) => traditionIds.has(traditionId))),
    workshops: data.workshops.filter((workshop) => workshop.traditionIds.some((traditionId) => traditionIds.has(traditionId))),
    sources: (entity.sourceIds || []).map((sourceId) => data.sources.find((source) => source.id === sourceId)).filter(Boolean)
  };
}
