/**
 * check-agent-readability.mjs — internal self-check: does a reader that runs no
 * JavaScript get the key facts from our pages?
 *
 * Many AI agents fetch a page over plain HTTP and read the HTML as served: no
 * JavaScript, no meta-refresh. This check reads the built pages in dist/ the
 * same way and fails the build when one of them would leave such a reader
 * without its facts. It reads only files on disk and makes no network requests.
 *
 * For every page in src/content/agentReadability.json it checks the page's text
 * outside <script>, <style>, <template> and <svg>:
 *
 *   1. every key fact is there: the facts listed for the page, plus those it
 *      takes from a data file (`from`: "team" or "pricing", see
 *      scripts/agent-facts.mjs);
 *   2. there is exactly one <h1>.
 *
 * A page that redirects with a meta-refresh passes only if it carries its facts
 * itself (/pricing/ does).
 *
 * The React pages are held to the same facts by src/test/agentReadability.test.tsx,
 * so the static copy and the rendered copy cannot drift apart.
 *
 * Usage: node scripts/check-agent-readability.mjs [--dist <dir>]
 * (`npm run check:agents`; also the last step of `npm run build`).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import { normalizeText, pageFacts } from "./agent-facts.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distArg = process.argv.indexOf("--dist");
const dist = distArg > -1 ? path.resolve(process.argv[distArg + 1]) : path.join(rootDir, "dist");
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(rootDir, rel), "utf8"));

const config = readJson("src/content/agentReadability.json");
const data = { team: readJson("src/content/team.json"), pricing: readJson("src/content/pricing.json") };

if (!fs.existsSync(dist)) {
  console.error(`check-agent-readability: ${dist} not found — run the build first.`);
  process.exit(1);
}

const SKIP = new Set(["SCRIPT", "STYLE", "TEMPLATE", "SVG"]);

// The text a reader that runs no JavaScript gets: every text node outside
// script/style/template/svg, joined with spaces so adjacent elements don't merge.
function noJsText(document) {
  const parts = [];
  const walk = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) parts.push(child.data);
      else if (child.nodeType === 1 && !SKIP.has(child.nodeName.toUpperCase())) walk(child);
    }
  };
  walk(document.body);
  return normalizeText(parts.join(" "));
}

// Pages are listed by route ("/", "/about/"); each is built as <route>/index.html.
function htmlFileFor(route) {
  return path.join(dist, route.replace(/^\/+/, ""), "index.html");
}

const failures = [];
let checked = 0;
for (const page of config.pages) {
  const file = htmlFileFor(page.path);
  if (!fs.existsSync(file)) {
    failures.push(`${page.path}: ${path.relative(rootDir, file)} was not built`);
    continue;
  }
  const { document } = new JSDOM(fs.readFileSync(file, "utf8")).window;
  const text = noJsText(document);
  const words = text ? text.split(" ").length : 0;
  const refresh = document.querySelector('meta[http-equiv="refresh" i]');
  const facts = pageFacts(page, data);
  const missing = facts.filter((fact) => !text.includes(normalizeText(fact)));
  checked += facts.length;
  for (const fact of missing) {
    failures.push(
      `${page.path}: "${fact}" is not in the HTML a reader without JavaScript gets (${words} words${
        refresh ? `; the page only redirects: ${refresh.getAttribute("content")}` : ""
      })`
    );
  }
  const h1s = document.querySelectorAll("h1").length;
  if (h1s !== 1) failures.push(`${page.path}: ${h1s} <h1> elements in the static HTML (want exactly 1)`);
}

if (failures.length === 0) {
  console.log(`check-agent-readability: OK — ${config.pages.length} pages, ${checked} key facts readable without JavaScript.`);
  process.exit(0);
}
console.error(`\ncheck-agent-readability: FAIL — ${failures.length} problem(s):\n`);
for (const failure of failures) console.error(`  ${failure}`);
console.error(
  "\nFix: the static page is built by scripts/prerender.mjs from the same data as the React page" +
    " (src/content/team.json, src/content/pricing.json). Edit the data, not a copy; the facts each page" +
    " must carry are listed in src/content/agentReadability.json.\n"
);
process.exit(1);
