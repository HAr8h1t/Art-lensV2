import { data, verificationStates } from "../src/data/culture-data.js";

const errors = [];

function requireFields(collectionName, fields) {
  for (const item of data[collectionName]) {
    for (const field of fields) {
      if (item[field] === undefined || item[field] === null || item[field] === "") {
        errors.push(`${collectionName}:${item.id} is missing ${field}`);
      }
    }
  }
}

function assertRefs(collectionName, fieldName, validIds) {
  for (const item of data[collectionName]) {
    const refs = Array.isArray(item[fieldName]) ? item[fieldName] : item[fieldName] ? [item[fieldName]] : [];
    for (const ref of refs) {
      if (!validIds.has(ref)) {
        errors.push(`${collectionName}:${item.id} has invalid ${fieldName} reference ${ref}`);
      }
    }
  }
}

function assertVerification(collectionName) {
  for (const item of data[collectionName]) {
    if (!verificationStates[item.verification]) {
      errors.push(`${collectionName}:${item.id} has invalid verification state ${item.verification}`);
    }
    if (["source_backed", "verified", "institution_verified"].includes(item.verification) && !item.sourceIds?.length) {
      errors.push(`${collectionName}:${item.id} is ${item.verification} but has no sources`);
    }
  }
}

const sourceIds = new Set(data.sources.map((item) => item.id));
const regionIds = new Set(data.regions.map((item) => item.id));
const traditionIds = new Set(data.traditions.map((item) => item.id));
const creatorIds = new Set(data.creators.map((item) => item.id));
const artworkIds = new Set(data.artworks.map((item) => item.id));
const siteIds = new Set(data.sites.map((item) => item.id));
const eventIds = new Set(data.events.map((item) => item.id));
const workshopIds = new Set(data.workshops.map((item) => item.id));

requireFields("regions", ["id", "state", "name", "summary", "verification"]);
requireFields("traditions", ["id", "name", "regionId", "intro", "verification"]);
requireFields("creators", ["id", "name", "regionId", "traditionIds", "bio", "verification"]);
requireFields("artworks", ["id", "title", "creatorId", "traditionIds", "verification"]);
requireFields("products", ["id", "title", "creatorId", "artworkId", "traditionIds", "availability", "verification"]);
requireFields("events", ["id", "title", "date", "location", "traditionIds", "verification"]);
requireFields("workshops", ["id", "title", "creatorId", "traditionIds", "verification"]);
requireFields("mapMarkers", ["id", "label", "kind", "state", "regionId", "siteId", "traditionId", "x", "y"]);

for (const collectionName of ["regions", "traditions", "creators", "artworks", "products", "sites", "events", "workshops"]) {
  assertVerification(collectionName);
  assertRefs(collectionName, "sourceIds", sourceIds);
}

assertRefs("traditions", "regionId", regionIds);
assertRefs("traditions", "relatedTraditionIds", traditionIds);
assertRefs("creators", "regionId", regionIds);
assertRefs("creators", "traditionIds", traditionIds);
assertRefs("artworks", "creatorId", creatorIds);
assertRefs("artworks", "traditionIds", traditionIds);
assertRefs("products", "creatorId", creatorIds);
assertRefs("products", "artworkId", artworkIds);
assertRefs("products", "traditionIds", traditionIds);
assertRefs("events", "traditionIds", traditionIds);
assertRefs("events", "creatorIds", creatorIds);
assertRefs("workshops", "creatorId", creatorIds);
assertRefs("workshops", "traditionIds", traditionIds);
assertRefs("mapMarkers", "regionId", regionIds);
assertRefs("mapMarkers", "siteId", siteIds);
assertRefs("mapMarkers", "traditionId", traditionIds);
assertRefs("mapMarkers", "creatorId", creatorIds);
assertRefs("mapMarkers", "eventId", eventIds);
assertRefs("mapMarkers", "workshopId", workshopIds);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Data validation passed.");
