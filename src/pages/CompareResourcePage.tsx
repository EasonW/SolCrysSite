import { useParams } from "react-router-dom";
import ResourcePage from "./ResourcePage";

// Comparison pages are resourcePages with nested slugs ("compare/<name>"),
// which the one-segment "/:slug" route can't match. Without this route the
// app rendered NotFound over the prerendered page for every visitor with JS.
const CompareResourcePage = () => {
  const { compareSlug } = useParams();
  return <ResourcePage slug={`compare/${compareSlug}`} />;
};

export default CompareResourcePage;
