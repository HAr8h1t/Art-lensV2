import { spawn } from "node:child_process";

const port = 4183;
const server = spawn(process.execPath, ["backend/server.mjs"], {
  env: { ...process.env, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"]
});

function waitForServer() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("API server did not start in time")), 5000);
    server.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("ART-LENS V2 running")) {
        clearTimeout(timeout);
        resolve();
      }
    });
    server.stderr.on("data", (chunk) => reject(new Error(chunk.toString())));
  });
}

async function expectOk(path, options = {}) {
  const response = await fetch(`http://localhost:${port}${path}`, options);
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  return response.json();
}

try {
  await waitForServer();
  await expectOk("/api/health");
  const search = await expectOk("/api/search?q=Kutch%20Rogan");
  if (!search.results.length) throw new Error("Search returned no results");
  await expectOk("/api/relationships/tradition/trad-rogan");
  await expectOk("/api/admin/review-queue", { headers: { "x-demo-role": "admin" } });
  const suggestions = await expectOk("/api/ai/onboarding-suggestions", {
    method: "POST",
    headers: { "content-type": "application/json", "x-demo-role": "creator" },
    body: JSON.stringify({ text: "I make Rogan textile work in Kutch with cloth and castor oil." })
  });
  if (!suggestions.reviewRequired) throw new Error("AI suggestions must require review");
  console.log("API smoke test passed.");
} finally {
  server.kill();
}
