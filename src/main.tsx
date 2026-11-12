import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { captureAttribution, installAttributionLinks } from "./lib/attribution";

captureAttribution();
installAttributionLinks();

createRoot(document.getElementById("root")!).render(<App />);
