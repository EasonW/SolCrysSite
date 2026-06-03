import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Fragment } from "react";
import { Toaster as Sonner } from "sonner";
import Index from "./pages/Index";
import AboutUs from "./pages/AboutUs";
import Customers from "./pages/Customers";
import NextSiliconCaseStudy from "./pages/NextSiliconCaseStudy";
import NotFound from "./pages/NotFound";
import Resources from "./pages/Resources";
import ResourcePage from "./pages/ResourcePage";
import PromptPulseHub from "./pages/PromptPulseHub";
import PromptPulseVertical from "./pages/PromptPulseVertical";
import FreeTrackerPage from "./pages/FreeTrackerPage";
// Phase E: /pricing is canonical-hosted at app.solcrys.com/pricing.
// The SPA route now renders a redirect bridge that handles warm-cache
// client-side navigations (the static prerendered HTML handles cold
// loads via meta-refresh).
import PricingRedirect from "./components/PricingRedirect";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import ContactFloatingButton from "./components/ContactFloatingButton";
import siteContent from "@/content/siteContent.json";

const App = () => (
  <>
    <Sonner richColors position="top-right" />
    <BrowserRouter>
      <ContactFloatingButton />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/about/" element={<AboutUs />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/" element={<Customers />} />
        <Route path="/customers/nextsilicon" element={<NextSiliconCaseStudy />} />
        <Route path="/customers/nextsilicon/" element={<NextSiliconCaseStudy />} />
        <Route path="/pricing" element={<PricingRedirect />} />
        <Route path="/pricing/" element={<PricingRedirect />} />
        <Route path="/free-chatgpt-visibility-tracker" element={<FreeTrackerPage />} />
        <Route path="/free-chatgpt-visibility-tracker/" element={<FreeTrackerPage />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/" element={<Resources />} />
        <Route path="/prompt-pulse" element={<PromptPulseHub />} />
        <Route path="/prompt-pulse/" element={<PromptPulseHub />} />
        <Route path="/prompt-pulse/:vertical" element={<PromptPulseVertical />} />
        <Route path="/prompt-pulse/:vertical/" element={<PromptPulseVertical />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/" element={<News />} />
        <Route path="/news/:slug" element={<NewsArticle />} />
        <Route path="/news/:slug/" element={<NewsArticle />} />
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
