import type siteContent from "@/content/siteContent.json";

export type ResourcePageData = (typeof siteContent.resourcePages)[number];

const directory = "../content/generated-resources/pages/";
const files = import.meta.glob<ResourcePageData>(
  "../content/generated-resources/pages/**/*.json",
  { import: "default" },
);

export const resourceLoaders = new Map(
  Object.entries(files).map(([file, load]) => [file.slice(directory.length, -".json".length), load]),
);
export const loadedResources = new Map<string, ResourcePageData>();

export async function loadResource(slug: string): Promise<ResourcePageData> {
  const load = resourceLoaders.get(slug);
  if (!load) throw new Error(`No resource data for ${slug}`);
  const page = await load();
  loadedResources.set(slug, page);
  return page;
}
