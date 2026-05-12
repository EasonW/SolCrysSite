import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Fragment } from "react";
import { Toaster as Sonner } from "sonner";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import Resources from "./pages/Resources";
import ResourcePage from "./pages/ResourcePage";
import Pricing from "./pages/Pricing";
import siteContent from "@/content/siteContent.json";

const App = () => (
  <>
    <Sonner richColors position="top-right" />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/about/" element={<AboutUs />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/pricing/" element={<Pricing />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/" element={<Resources />} />
        {siteContent.resourcePages.map((page) => (
          <Fragment key={page.slug}>
            <Route path={`/${page.slug}`} element={<ResourcePage slug={page.slug} />} />
            <Route path={`/${page.slug}/`} element={<ResourcePage slug={page.slug} />} />
          </Fragment>
        ))}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
