import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { captureAttribution, installAttributionLinks } from "./lib/attribution";

// GitHub Pages also serves directory pages at their explicit index.html URLs.
// Normalize the alias before BrowserRouter mounts so it loads the same page.
const currentUrl = new URL(window.location.href);
if (currentUrl.pathname.endsWith("/index.html")) {
  currentUrl.pathname = currentUrl.pathname.slice(0, -"index.html".length);
  window.history.replaceState(window.history.state, "", currentUrl);
}

captureAttribution();
installAttributionLinks();

const root = document.getElementById("root")!;
const resourceSlug = root.querySelector<HTMLElement>("[data-resource-slug]")?.dataset.resourceSlug;

if (resourceSlug) {
  // Keep the prerendered article visible until both imports succeed. On a
  // slow connection or stale asset from a deploy, it remains usable.
  Promise.all([import("./pages/ResourcePage"), import("./lib/resource-data")])
    .then(async ([{ default: ResourcePage }, { loadResource }]) => {
      await loadResource(resourceSlug);
      createRoot(root).render(<App preloadedResourcePage={ResourcePage} />);
    })
    .catch((error: unknown) => {
      console.warn("Using the prerendered article after an asset could not be loaded.", error);
    });
} else {
  createRoot(root).render(<App />);
}
