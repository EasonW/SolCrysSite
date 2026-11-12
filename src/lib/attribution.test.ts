import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  captureAttribution,
  installAttributionLinks,
  readAttribution,
  referrerSource,
  withAttribution,
} from "./attribution";
import { submitLeadIntake } from "./lead-intake";

const KEY = "solcrys_utm";

function land(search: string, referrer: string) {
  window.history.pushState(null, "", `/blog/x${search}`);
  Object.defineProperty(document, "referrer", { value: referrer, configurable: true });
  captureAttribution();
}

beforeEach(() => {
  window.sessionStorage.clear();
});

afterEach(() => {
  window.history.pushState(null, "", "/");
  Object.defineProperty(document, "referrer", { value: "", configurable: true });
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("captureAttribution", () => {
  it("stores UTMs from the landing URL", () => {
    land("?utm_source=linkedin.com&utm_medium=social&utm_campaign=launch", "https://www.linkedin.com/");
    expect(readAttribution()).toEqual({
      utm_source: "linkedin.com",
      utm_medium: "social",
      utm_campaign: "launch",
      utm_term: null,
      utm_content: null,
    });
  });

  it("stores an outside referrer's host as a referral, never its path", () => {
    land("", "https://www.chatgpt.com/c/abc?q=private");
    expect(readAttribution()).toMatchObject({ utm_source: "chatgpt.com", utm_medium: "referral" });
    expect(window.sessionStorage.getItem(KEY)).not.toContain("private");
  });

  it("a later outside arrival replaces what is stored", () => {
    land("?utm_source=event", "");
    land("", "https://google.com/");
    expect(readAttribution()?.utm_source).toBe("google.com");
  });

  it.each(["https://solcrys.com/guides/x", "https://app.solcrys.com/pricing", "", "not a url"])(
    "keeps what is stored on arrival from %p",
    (referrer) => {
      land("?utm_source=luma", "");
      land("", referrer);
      expect(readAttribution()?.utm_source).toBe("luma");
    },
  );
});

describe("referrerSource", () => {
  it.each([
    ["https://www.linkedin.com/feed/", "linkedin.com"],
    ["https://L.Facebook.com/l.php?u=x", "l.facebook.com"],
    ["https://evilsolcrys.com/", "evilsolcrys.com"],
    ["https://solcrys.com.example.org/", "solcrys.com.example.org"],
    ["https://app.solcrys.com/", null],
    ["https://test-solcrys-aeo.up.railway.app/x", null],
    ["", null],
  ])("%p → %p", (referrer, expected) => {
    expect(referrerSource(referrer, "test-solcrys-aeo.up.railway.app")).toBe(expected);
  });
});

describe("withAttribution", () => {
  it("adds the stored UTMs to app links that have none", () => {
    land("?utm_source=luma", "");
    expect(withAttribution("https://app.solcrys.com/audit?domain=a.com&autostart=1")).toBe(
      "https://app.solcrys.com/audit?domain=a.com&autostart=1&utm_source=luma",
    );
  });

  it("leaves app links that already carry UTMs alone", () => {
    land("?utm_source=luma", "");
    const url = "https://app.solcrys.com/audit?utm_campaign=newsletter";
    expect(withAttribution(url)).toBe(url);
  });

  it("leaves other links alone, and app links when nothing is stored", () => {
    land("?utm_source=luma", "");
    expect(withAttribution("https://example.com/")).toBe("https://example.com/");
    expect(withAttribution("/pricing")).toBe("/pricing");
    window.sessionStorage.clear();
    expect(withAttribution("https://app.solcrys.com/audit")).toBe("https://app.solcrys.com/audit");
  });
});

describe("installAttributionLinks", () => {
  it("tags an app link before document-level click handlers read it", () => {
    land("?utm_source=youtube.com&utm_medium=video", "");
    installAttributionLinks();
    const anchor = document.createElement("a");
    anchor.href = "https://app.solcrys.com/audit";
    anchor.innerHTML = "<span>Start Free</span>";
    document.body.appendChild(anchor);

    let seen = "";
    const onDocument = (event: Event) => {
      seen = (event.target as Element).closest("a")!.href;
      event.preventDefault(); // jsdom can't navigate
    };
    document.addEventListener("click", onDocument, true);
    anchor.querySelector("span")!.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    document.removeEventListener("click", onDocument, true);
    anchor.remove();

    expect(seen).toBe("https://app.solcrys.com/audit?utm_source=youtube.com&utm_medium=video");
  });
});

describe("lead-intake source_context", () => {
  it("sends the stored source and no full referrer", async () => {
    vi.stubEnv("VITE_LEAD_INTAKE_URL", "https://app.example/api/lead-intake");
    land("", "https://www.chatgpt.com/c/abc?q=private");
    window.history.pushState(null, "", "/contact");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, data: { inquiry_id: "x" } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await submitLeadIntake({
      form_type: "founder_chat",
      source: "marketing:founder_chat@test",
      full_name: "A",
      work_email: "a@example.com",
      company_name: "Co",
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.source_context).toEqual({
      utm_source: "chatgpt.com",
      utm_medium: "referral",
      page_url: "http://localhost:3000/contact",
    });
    vi.unstubAllGlobals();
  });
});
