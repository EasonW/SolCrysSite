import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(rootDir, "src/content/siteContent.json");
const outputPath = path.join(rootDir, "src/content/homeContent.json");
const featuredSlugs = new Set([
  "aeo-vs-seo",
  "visibility-measurement-methodology",
  "ai-visibility-platform-buyers-guide",
]);

const content = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const clientContent = {
  site: content.site,
  home: content.home,
  featuredResourcePages: content.resourcePages.filter((page) => featuredSlugs.has(page.slug)),
};

fs.writeFileSync(outputPath, `${JSON.stringify(clientContent, null, 2)}\n`);
