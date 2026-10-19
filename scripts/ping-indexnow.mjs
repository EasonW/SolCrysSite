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
// IndexNow engines share submissions with each other, so one accepted
// submission reaches all of them. Bing (behind api.indexnow.org) has rejected
// solcrys.com with 403 UserForbiddedToAccessSite since at least 2026-07, while
// Yandex accepts the same key; a URL accepted by Yandex then shows up in Bing
// Webmaster Tools' IndexNow report (verified 2026-10-18). Try the generic
// endpoint first and fall back to the next one when it refuses.
const ENDPOINTS = ["https://api.indexnow.org/IndexNow", "https://yandex.com/indexnow"];

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

let accepted = false;
for (const endpoint of ENDPOINTS) {
  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000)
    });
  } catch (error) {
    console.error(`[indexnow] ${endpoint} unreachable: ${error.message}`);
    continue;
  }
  if (response.status === 200 || response.status === 202) {
    console.log(`[indexnow] Submitted ${urlList.length} URLs to ${endpoint} (status ${response.status}).`);
    accepted = true;
    break;
  }
  const body = await response.text().catch((error) => `(body unreadable: ${error.message})`);
  console.error(`[indexnow] ${endpoint} refused: HTTP ${response.status} ${body}`);
}

if (!accepted) {
  console.error("[indexnow] Submission failed at every endpoint.");
  process.exit(1);
}
