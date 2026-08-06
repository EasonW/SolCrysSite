import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "sonner";
import ContactFloatingButton from "./components/ContactFloatingButton";

const Index = lazy(() => import("./pages/Index"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Customers = lazy(() => import("./pages/Customers"));
const NextSiliconCaseStudy = lazy(() => import("./pages/NextSiliconCaseStudy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Resources = lazy(() => import("./pages/Resources"));
const ResourcePage = lazy(() => import("./pages/ResourcePage"));
const Compare = lazy(() => import("./pages/Compare"));
const PromptPulseHub = lazy(() => import("./pages/PromptPulseHub"));
const PromptPulseVertical = lazy(() => import("./pages/PromptPulseVertical"));
const FreeTrackerPage = lazy(() => import("./pages/FreeTrackerPage"));
const FreeAeoAuditPage = lazy(() => import("./pages/FreeAeoAuditPage"));
const PricingRedirect = lazy(() => import("./components/PricingRedirect"));
const News = lazy(() => import("./pages/News"));
const NewsArticle = lazy(() => import("./pages/NewsArticle"));
const LearnHub = lazy(() => import("./pages/LearnHub"));
const CoursePage = lazy(() => import("./pages/CoursePage"));
const LessonPage = lazy(() => import("./pages/LessonPage"));

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading page">
    <span className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground motion-reduce:animate-none" />
  </div>
);

const App = () => (
  <>
    <Sonner richColors position="top-right" />
    <BrowserRouter>
      <ContactFloatingButton />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/nextsilicon" element={<NextSiliconCaseStudy />} />
          <Route path="/pricing" element={<PricingRedirect />} />
          <Route path="/free-chatgpt-visibility-tracker" element={<FreeTrackerPage />} />
          <Route path="/free-aeo-audit" element={<FreeAeoAuditPage />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/prompt-pulse" element={<PromptPulseHub />} />
          <Route path="/prompt-pulse/:vertical" element={<PromptPulseVertical />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsArticle />} />
          {/* Course routes MUST be declared above the `/:slug` catch-all — that
              route serves resource pages from the flat root namespace and would
              otherwise swallow `/learn`. */}
          <Route path="/learn" element={<LearnHub />} />
          <Route path="/learn/:courseSlug" element={<CoursePage />} />
          <Route
            path="/learn/:courseSlug/:moduleSlug/:lessonSlug"
            element={<LessonPage />}
          />
          <Route path="/:slug" element={<ResourcePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </>
);

export default App;
