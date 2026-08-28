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

requireFields("regions", ["id", "state", "name", "summary", "verification"]);
requireFields("traditions", ["id", "name", "regionId", "intro", "verification"]);
requireFields("creators", ["id", "name", "regionId", "traditionIds", "bio", "verification"]);
requireFields("artworks", ["id", "title", "creatorId", "traditionIds", "verification"]);
requireFields("events", ["id", "title", "date", "location", "traditionIds", "verification"]);
requireFields("workshops", ["id", "title", "creatorId", "traditionIds", "verification"]);

for (const collectionName of ["regions", "traditions", "creators", "artworks", "sites", "events", "workshops"]) {
  assertVerification(collectionName);
  assertRefs(collectionName, "sourceIds", sourceIds);
}

assertRefs("traditions", "regionId", regionIds);
assertRefs("traditions", "relatedTraditionIds", traditionIds);
assertRefs("creators", "regionId", regionIds);
assertRefs("creators", "traditionIds", traditionIds);
assertRefs("artworks", "creatorId", creatorIds);
assertRefs("artworks", "traditionIds", traditionIds);
assertRefs("events", "traditionIds", traditionIds);
assertRefs("events", "creatorIds", creatorIds);
assertRefs("workshops", "creatorId", creatorIds);
assertRefs("workshops", "traditionIds", traditionIds);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Data validation passed.");
