import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { readDemoRole, canCreateCulturalRecords, canModerate } from "./auth/roles.mjs";
import { allEntities, getEntity, relationshipBundle, reviewQueue } from "./services/entity-service.mjs";
import { structuredSearch } from "./services/search-service.mjs";
import { suggestCreatorMetadata } from "./services/onboarding-assist-service.mjs";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body, null, 2));
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

async function handleApi(request, response, url) {
  const role = readDemoRole(request);

  if (url.pathname === "/api/health") {
    sendJson(response, 200, { ok: true, service: "art-lens-v2", role });
    return true;
  }

  if (url.pathname === "/api/entities") {
    sendJson(response, 200, allEntities());
    return true;
  }

  if (url.pathname === "/api/search") {
    sendJson(response, 200, { query: url.searchParams.get("q") || "", results: structuredSearch(url.searchParams.get("q") || "") });
    return true;
  }

  if (url.pathname === "/api/admin/review-queue") {
    if (!canModerate(role)) {
      sendJson(response, 403, { error: "Admin role required for moderation queue." });
      return true;
    }
    sendJson(response, 200, { results: reviewQueue() });
    return true;
  }

  if (url.pathname === "/api/ai/onboarding-suggestions" && request.method === "POST") {
    if (!canCreateCulturalRecords(role)) {
      sendJson(response, 403, { error: "Creator or admin role required for onboarding assistance." });
      return true;
    }
    const body = await readBody(request);
    sendJson(response, 200, suggestCreatorMetadata(body.text || ""));
    return true;
  }

  const bundleMatch = url.pathname.match(/^\/api\/relationships\/([^/]+)\/([^/]+)$/);
  if (bundleMatch) {
    const bundle = relationshipBundle(bundleMatch[1], bundleMatch[2]);
    sendJson(response, bundle ? 200 : 404, bundle || { error: "Entity not found." });
    return true;
  }

  const entityMatch = url.pathname.match(/^\/api\/([^/]+)\/([^/]+)$/);
  if (entityMatch) {
    const entity = getEntity(entityMatch[1], entityMatch[2]);
    sendJson(response, entity ? 200 : 404, entity || { error: "Entity not found." });
    return true;
  }

  return false;
}

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://localhost:${port}`);
    if (url.pathname.startsWith("/api/") && (await handleApi(request, response, url))) return;

    const requestPath = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = normalize(join(root, requestPath));
    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    const body = await readFile(filePath);
    response.writeHead(200, { "Content-Type": contentTypes[extname(filePath)] || "text/plain; charset=utf-8" });
    response.end(body);
  } catch (error) {
    sendJson(response, 404, { error: "Not found" });
  }
}).listen(port, () => {
  console.log(`ART-LENS V2 running at http://localhost:${port}`);
});
