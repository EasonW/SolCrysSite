#!/usr/bin/env python3
"""Three gates an AI agent must pass, checked on our own site (solcrys.com).

Gate 1, rules:   what robots.txt says to each named AI crawler or agent.
Gate 2, walls:   what the server returns when a request carries each agent's
                 name (HTTP status, redirects, body size, challenge markers).
Gate 3, sight:   what a reader that runs no JavaScript gets, against the page
                 a browser renders (text, headings, JSON-LD, numbers, and the
                 accessibility tree).

Run on solcrys.com (the defaults below):
    python3 check_agent_gates.py [out_dir] [--gates 1,2,3]
Run on your own site:
    python3 check_agent_gates.py out --pages https://example.com/ https://example.com/pricing \
        --facts "https://example.com/pricing=Starter|$49|Pro|$199"
Needs: Python 3.10+, requests, playwright (`pip install requests playwright`,
then `playwright install chromium`; or set CHROME_EXE to a Chromium binary).

Polite by design: run it on your own site only. One request at a time, 2 s
apart; with the defaults, about 60 requests in all. Requests come from our own IP, so a host that
verifies bots by IP range would treat the bot-named ones as unverified;
the check shows what each host does with the *name*, not with the vendor's
real network.
"""
from __future__ import annotations

import datetime as dt
import glob
import html
import json
import os
import re
import sys
import time
import urllib.robotparser
from html.parser import HTMLParser
from pathlib import Path

import requests

OUT = Path(sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else Path(__file__).parent / "raw")
SPACING_S = 2.0

ROBOTS_URLS = ["https://solcrys.com/robots.txt", "https://app.solcrys.com/robots.txt"]

# Pages for gate 2 (every agent name) and gate 3 (JS off vs JS on).
GATE2_URLS = [
    "https://solcrys.com/",
    "https://solcrys.com/about/",
    "https://solcrys.com/pricing/",
    "https://app.solcrys.com/pricing",
]
GATE3_URLS = [
    "https://solcrys.com/",
    "https://solcrys.com/about/",
    "https://solcrys.com/pricing/",
    "https://app.solcrys.com/pricing",
    "https://solcrys.com/animated-counters-ai-crawlers/",
]

# Robots.txt tokens, the vendor's own class for each, and the doc it comes from.
TOKENS = [
    ("GPTBot", "training", "https://developers.openai.com/api/docs/bots"),
    ("OAI-SearchBot", "search", "https://developers.openai.com/api/docs/bots"),
    ("ChatGPT-User", "user-triggered", "https://developers.openai.com/api/docs/bots"),
    ("ClaudeBot", "training", "https://support.claude.com/en/articles/8896518"),
    ("Claude-SearchBot", "search", "https://support.claude.com/en/articles/8896518"),
    ("Claude-User", "user-triggered", "https://support.claude.com/en/articles/8896518"),
    ("PerplexityBot", "search", "https://docs.perplexity.ai/guides/bots"),
    ("Perplexity-User", "user-triggered", "https://docs.perplexity.ai/guides/bots"),
    ("Google-Extended", "training/grounding control (token only, no own UA)",
     "https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers"),
    ("Googlebot", "search", "https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers"),
    ("Bingbot", "search", "https://blogs.bing.com/webmaster/april-2022/Announcing-user-agent-change-for-Bing-crawler-bingbot"),
    ("Applebot", "search (may also feed training)", "https://support.apple.com/en-us/119829"),
    ("Applebot-Extended", "training control (token only, does not crawl)", "https://support.apple.com/en-us/119829"),
]

# User-agent strings as each vendor publishes them (fetched 2026-11-05).
# Anthropic publishes the names but not full strings, so those three are a
# minimal "compatible; <name>" form we wrote ourselves.
CHROME = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
          "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
UAS = [
    ("Browser (Chrome 131)", CHROME),
    ("GPTBot", "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.4; +https://openai.com/gptbot"),
    ("OAI-SearchBot", CHROME + "; compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot"),
    ("ChatGPT-User", "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot"),
    ("ClaudeBot*", "Mozilla/5.0 (compatible; ClaudeBot/1.0)"),
    ("Claude-SearchBot*", "Mozilla/5.0 (compatible; Claude-SearchBot/1.0)"),
    ("Claude-User*", "Mozilla/5.0 (compatible; Claude-User/1.0)"),
    ("PerplexityBot", "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)"),
    ("Perplexity-User", "Mozilla/5.0 (compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)"),
    ("Googlebot", "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/131.0.0.0 Safari/537.36"),
    ("Bingbot", "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/131.0.0.0 Safari/537.36"),
    ("Applebot", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)"),
    ("Unnamed script", "python-requests/" + requests.__version__),
]

CHALLENGE_MARKERS = [
    "cf-chl", "challenge-platform", "Just a moment", "Attention Required",
    "captcha", "px-captcha", "datadome", "Access Denied", "Pardon Our Interruption",
]
BOT_HEADERS = ["cf-mitigated", "cf-ray", "x-datadome", "x-amzn-waf-action", "x-akamai", "server", "x-powered-by", "via"]

# Facts we expect a reader to get from each page.
KEY_FACTS = {
    "https://app.solcrys.com/pricing": ["Starter", "Pro", "Agency", "Agency Pro", "$99", "$399", "$1,499", "$4,999", "$2,000"],
    "https://solcrys.com/pricing/": ["Starter", "Pro", "Agency", "Agency Pro", "$99", "$399", "$1,499", "$4,999", "$2,000"],
    # Founder credentials as the rendered About page states them.
    "https://solcrys.com/about/": ["AppSheet", "Signals podcast", "since MSRA", "PhD in Machine Learning",
                                   "18+ years", "14+ years", "15+ years"],
}

NUM_RE = re.compile(r"(?<![\w.])(?:[$€£])?\d[\d,]*(?:\.\d+)?(?:\s?(?:%|x|×|k|K|M|B|\+))?(?![\w])")


def stamp() -> str:
    return dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


class TextOf(HTMLParser):
    """Text a reader without JavaScript gets: everything outside script/style/template."""

    SKIP = {"script", "style", "template", "svg"}

    def __init__(self):
        super().__init__()
        self.depth = 0
        self.parts: list[str] = []
        self.headings: list[tuple[str, str]] = []
        self._h: str | None = None
        self._hbuf: list[str] = []

    def handle_starttag(self, tag, attrs):
        if tag in self.SKIP:
            self.depth += 1
        if tag in ("h1", "h2", "h3"):
            self._h, self._hbuf = tag, []

    def handle_endtag(self, tag):
        if tag in self.SKIP and self.depth:
            self.depth -= 1
        if tag == self._h:
            self.headings.append((tag, " ".join("".join(self._hbuf).split())))
            self._h = None

    def handle_data(self, data):
        if not self.depth:
            self.parts.append(data)
            if self._h:
                self._hbuf.append(data)

    def text(self) -> str:
        return " ".join(" ".join(self.parts).split())


def jsonld_types(raw: str) -> list[str]:
    types: list[str] = []
    for block in re.findall(r'<script[^>]+application/ld\+json[^>]*>(.*?)</script>', raw, re.S | re.I):
        try:
            data = json.loads(html.unescape(block))
        except Exception:
            types.append("(unparseable)")
            continue
        stack = data if isinstance(data, list) else [data]
        while stack:
            node = stack.pop()
            if isinstance(node, dict):
                t = node.get("@type")
                if t:
                    types.extend(t if isinstance(t, list) else [t])
                stack.extend(v for v in node.values() if isinstance(v, (dict, list)))
            elif isinstance(node, list):
                stack.extend(node)
    return types


def slug(url: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", url.lower().split("//", 1)[1]).strip("_")


# ---------------------------------------------------------------- gate 1
def gate1(log: dict) -> None:
    out = []
    for url in ROBOTS_URLS:
        r = requests.get(url, headers={"User-Agent": CHROME}, timeout=20)
        time.sleep(SPACING_S)
        (OUT / f"robots_{slug(url)}.txt").write_text(r.text)
        rp = urllib.robotparser.RobotFileParser()
        rp.parse(r.text.splitlines())
        # The group each token falls into: its own group, or "*".
        groups = re.split(r"\n(?=User-agent:)", r.text, flags=re.I)
        named = {}
        for g in groups:
            m = re.match(r"User-agent:\s*(\S+)", g.strip(), re.I)
            if m:
                named[m.group(1).lower()] = [ln for ln in g.strip().splitlines() if not ln.startswith("#") and ln.strip()]
        site = url.rsplit("/", 1)[0]
        rows = []
        for tok, cls, doc in TOKENS:
            lines = named.get(tok.lower())
            rows.append({
                "token": tok, "class": cls, "doc": doc,
                "group": "own group" if lines else ("falls to *" if "*" in named else "no rule"),
                "lines": lines or named.get("*", []),
                "home_allowed": rp.can_fetch(tok, site + "/"),
                "pricing_allowed": rp.can_fetch(tok, site + "/pricing"),
            })
        out.append({"url": url, "status": r.status_code, "bytes": len(r.content),
                    "content_type": r.headers.get("content-type"), "tokens": rows})
    log["gate1"] = out


# ---------------------------------------------------------------- gate 2
def gate2(log: dict) -> None:
    rows = []
    for url in GATE2_URLS:
        for name, ua in UAS:
            t0 = time.time()
            try:
                r = requests.get(url, headers={"User-Agent": ua, "Accept": "text/html,*/*"},
                                 timeout=30, allow_redirects=True)
                body = r.text
                meta = re.search(r'<meta[^>]+http-equiv=["\']refresh["\'][^>]+content=["\']([^"\']+)', body, re.I)
                rows.append({
                    "url": url, "agent": name, "ua": ua,
                    "status": r.status_code,
                    "chain": [h.status_code for h in r.history] + [r.status_code],
                    "final_url": r.url,
                    "bytes": len(r.content),
                    "meta_refresh": meta.group(1) if meta else None,
                    "challenge_markers": [m for m in CHALLENGE_MARKERS if m.lower() in body.lower()],
                    "headers": {h: r.headers.get(h) for h in BOT_HEADERS if r.headers.get(h)},
                    "ms": round((time.time() - t0) * 1000),
                    "at": stamp(),
                })
            except Exception as e:  # network error is a result too
                rows.append({"url": url, "agent": name, "ua": ua, "error": repr(e), "at": stamp()})
            time.sleep(SPACING_S)
    log["gate2"] = rows


# ---------------------------------------------------------------- gate 3
LEAF_NUMBERS_JS = r"""
() => {
  const re = /^\s*[$€£]?\d[\d,]*(\.\d+)?\s?(%|x|×|k|K|M|B|\+)?\s*$/;
  const path = (el) => {
    const parts = [];
    while (el && el.nodeType === 1 && el.tagName !== 'BODY') {
      let i = 1, s = el;
      while ((s = s.previousElementSibling)) if (s.tagName === el.tagName) i++;
      parts.unshift(el.tagName.toLowerCase() + ':nth-of-type(' + i + ')');
      el = el.parentElement;
    }
    return 'body > ' + parts.join(' > ');
  };
  const out = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (el.children.length) continue;
    const t = (el.textContent || '').trim();
    if (re.test(t)) out.push({path: path(el), text: t});
  }
  return out;
}
"""

COUNTER_SELECTOR = ('[data-to-value],[data-number-value],[data-kubio-component="counter"],'
                    '[data-count],[data-countup],[data-target].counter,.countup,.count-up')
ZERO_RE = re.compile(r"[$€£]?0+(\.0+)?\s?(%|x|×|k|K|M|B|\+)?")


def chrome_exe() -> str | None:
    if os.environ.get("CHROME_EXE"):
        return os.environ["CHROME_EXE"]
    found = glob.glob(os.path.expanduser(
        "~/Library/Caches/ms-playwright/chromium_headless_shell-*/*/chrome-headless-shell"))
    return sorted(found)[-1] if found else None


def heading_list(page) -> list[str]:
    return page.eval_on_selector_all(
        "h1,h2,h3", "els => els.map(e => e.tagName.toLowerCase() + ': ' + e.textContent.trim().replace(/\\s+/g,' '))")


def gate3(log: dict) -> None:
    from playwright.sync_api import sync_playwright

    rows = []
    with sync_playwright() as p:
        exe = chrome_exe()
        browser = p.chromium.launch(**({"executable_path": exe} if exe else {}))
        off = browser.new_context(java_script_enabled=False, user_agent=CHROME)
        on = browser.new_context(java_script_enabled=True, user_agent=CHROME)
        log["browser"] = {"chromium": browser.version, "executable": exe}
        for url in GATE3_URLS:
            name = slug(url)
            # Raw HTML, exactly as served.
            raw = requests.get(url, headers={"User-Agent": CHROME}, timeout=30).text
            time.sleep(SPACING_S)
            (OUT / f"{name}.raw.html").write_text(raw)
            parsed = TextOf()
            parsed.feed(raw)
            raw_text = parsed.text()

            # JS on: the page a browser shows.
            pon = on.new_page()
            resp_on = pon.goto(url, wait_until="networkidle", timeout=60000)
            pon.wait_for_timeout(2500)  # let count-ups and late renders settle
            pon.mouse.wheel(0, 20000)  # scroll so scroll-triggered numbers fire
            pon.wait_for_timeout(2500)
            on_url = pon.url
            on_text = " ".join(pon.inner_text("body").split())
            on_heads = heading_list(pon)
            on_aria = pon.locator("body").aria_snapshot()
            on_leaves = pon.evaluate(LEAF_NUMBERS_JS)
            on_ld = jsonld_types(pon.content())
            time.sleep(SPACING_S)

            # JS off: the same browser, scripts disabled. Meta refresh still fires,
            # so record where it lands.
            poff = off.new_page()
            resp_off = poff.goto(url, wait_until="load", timeout=60000)
            poff.wait_for_timeout(1500)
            off_url = poff.url
            off_text = " ".join(poff.inner_text("body").split())
            off_heads = heading_list(poff)
            off_aria = poff.locator("body").aria_snapshot()
            off_leaves = poff.evaluate(LEAF_NUMBERS_JS)
            counters_off = poff.locator(COUNTER_SELECTOR).count()
            time.sleep(SPACING_S)

            (OUT / f"{name}.aria.js-on.yaml").write_text(on_aria)
            (OUT / f"{name}.aria.js-off.yaml").write_text(off_aria)
            (OUT / f"{name}.text.js-on.txt").write_text(on_text)
            (OUT / f"{name}.text.js-off.txt").write_text(off_text)

            # Numbers shown as an element's own text, JS on against JS off. Compared
            # as multisets: the static HTML and the rendered DOM need not share a
            # structure, so element paths can't be matched one to one.
            from collections import Counter
            c_on = Counter(l["text"] for l in on_leaves)
            c_off = Counter(l["text"] for l in off_leaves)
            zeros_off_only = {t: n - c_on.get(t, 0) for t, n in c_off.items()
                              if ZERO_RE.fullmatch(t) and n > c_on.get(t, 0)}
            numbers_on_only = dict(c_on - c_off)
            on_nums = set(NUM_RE.findall(on_text))
            raw_nums = set(NUM_RE.findall(raw_text))
            facts = KEY_FACTS.get(url, [])
            rows.append({
                "url": url,
                "status_js_on": resp_on.status if resp_on else None,
                "final_url_js_on": on_url,
                "status_js_off": resp_off.status if resp_off else None,
                "final_url_js_off": off_url,
                "raw_bytes": len(raw.encode()),
                "words": {"raw_html": len(raw_text.split()), "js_off_visible": len(off_text.split()),
                          "js_on_visible": len(on_text.split())},
                "headings": {"raw_html": len(parsed.headings), "js_off": len(off_heads), "js_on": len(on_heads),
                             "js_on_not_in_raw": [h for h in on_heads if h.split(": ", 1)[1] not in raw_text]},
                "jsonld_types": {"raw_html": jsonld_types(raw), "js_on_dom": on_ld},
                "aria_lines": {"js_off": len(off_aria.splitlines()), "js_on": len(on_aria.splitlines())},
                "aria_roles": {
                    side: {r: len(re.findall(rf"^\s*- {r}\b", a, re.M)) for r in ("heading", "link", "button", "table", "listitem")}
                    for side, a in (("js_off", off_aria), ("js_on", on_aria))},
                "numbers": {"js_on_unique": len(on_nums), "in_raw_html": len(on_nums & raw_nums),
                            "js_on_not_in_raw": sorted(on_nums - raw_nums)},
                "number_elements": {"js_on": sum(c_on.values()), "js_off": sum(c_off.values()),
                                    "zero_only_without_js": zeros_off_only,
                                    "shown_only_with_js": numbers_on_only},
                "counter_elements_js_off": counters_off,
                "h1_in_tree": {"js_off": len(re.findall(r"heading .*\[level=1\]", off_aria)),
                               "js_on": len(re.findall(r"heading .*\[level=1\]", on_aria))},
                "sr_only_blocks_in_raw": len(re.findall(r'class="[^"]*\bsr-only\b', raw)),
                "key_facts": {f: {"raw_html": f in raw_text, "js_on": f in on_text} for f in facts},
                "at": stamp(),
            })
            pon.close()
            poff.close()
        browser.close()
    log["gate3"] = rows


def arg_list(flag: str) -> list[str]:
    """Values after `flag`, up to the next --option."""
    if flag not in sys.argv:
        return []
    vals = []
    for v in sys.argv[sys.argv.index(flag) + 1:]:
        if v.startswith("--"):
            break
        vals.append(v)
    return vals


def main() -> None:
    global ROBOTS_URLS, GATE2_URLS, GATE3_URLS, KEY_FACTS
    # --pages replaces the solcrys.com defaults; robots.txt comes from each page's host.
    pages = arg_list("--pages")
    if pages:
        GATE2_URLS = GATE3_URLS = pages
        ROBOTS_URLS = sorted({u.split("/", 3)[0] + "//" + u.split("/", 3)[2] + "/robots.txt" for u in pages})
        KEY_FACTS = {}
    # --facts "URL=fact1|fact2": strings a reader must get from that page.
    for spec in arg_list("--facts"):
        url, _, facts = spec.partition("=")
        KEY_FACTS[url] = [f for f in facts.split("|") if f]
    # --gates 1,3 reruns only those gates and keeps the others' saved results.
    gates = {"1", "2", "3"}
    if "--gates" in sys.argv:
        gates = set(sys.argv[sys.argv.index("--gates") + 1].split(","))
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / "results.json"
    log = json.loads(path.read_text()) if path.exists() and gates != {"1", "2", "3"} else {}
    log.setdefault("runs", []).append({"gates": sorted(gates), "started": stamp()})
    log["spacing_s"] = SPACING_S
    if "1" in gates:
        gate1(log)
    if "2" in gates:
        gate2(log)
    if "3" in gates:
        gate3(log)
    log["runs"][-1]["finished"] = stamp()
    (OUT / "results.json").write_text(json.dumps(log, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {OUT / 'results.json'}")


if __name__ == "__main__":
    main()
