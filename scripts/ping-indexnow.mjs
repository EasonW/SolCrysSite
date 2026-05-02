// Ping IndexNow with the canonical URL list emitted by prerender.mjs.
//
// Usage:
//   1. Generate a key (any 8-128 char hex string), e.g. `openssl rand -hex 16`
//   2. Place it in `public/<KEY>.txt` with the same key as the file contents.
//      The key must be reachable at https://solcrys.com/<KEY>.txt for IndexNow to validate ownership.
//   3. Set INDEXNOW_KEY in the deploy env, then run `node scripts/ping-indexnow.mjs` after deploy.
//
// The script is a no-op (with a notice) when INDEXNOW_KEY is unset, so it is safe in CI.
// IndexNow is consumed by Bing, Yandex, Naver, Seznam (Google does not support it as of 2026).
// Reference: https://www.indexnow.org/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const HOST = "solcrys.com";
const ENDPOINT = "https://api.indexnow.org/IndexNow";

const key = process.env.INDEXNOW_KEY;
if (!key) {
  console.warn("[indexnow] INDEXNOW_KEY not set; skipping ping. Generate a key and add it to your deploy env to enable.");
  process.exit(0);
}

const urlsPath = path.join(distDir, "indexnow-urls.json");
if (!fs.existsSync(urlsPath)) {
  console.error(`[indexnow] ${urlsPath} not found. Run \`npm run build\` first.`);
  process.exit(1);
}

const urlList = JSON.parse(fs.readFileSync(urlsPath, "utf8"));

const payload = {
  host: HOST,
  key,
  keyLocation: `https://${HOST}/${key}.txt`,
  urlList
};

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload)
});

if (response.status === 200 || response.status === 202) {
  console.log(`[indexnow] Submitted ${urlList.length} URLs to ${ENDPOINT} (status ${response.status}).`);
} else {
  const body = await response.text();
  console.error(`[indexnow] Submission failed: HTTP ${response.status} ${body}`);
  process.exit(1);
}
