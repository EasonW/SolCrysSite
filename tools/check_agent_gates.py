#!/usr/bin/env python3
r"""Three gates an AI agent must pass, checked on your own site.

Gate 1, rules:   what robots.txt says to each named AI crawler or agent.
Gate 2, walls:   what the server returns when a request carries each agent's
                 name (HTTP status, redirects, body size, challenge markers).
Gate 3, sight:   what a reader that runs no JavaScript gets, against the page
                 a browser renders (text, headings, JSON-LD, numbers, and the
                 accessibility tree).

Usage:
    python3 check_agent_gates.py out --pages https://example.com/ https://example.com/pricing \
        --facts 'https://example.com/pricing=Starter|$49|Pro|$199' [--gates 1,2,3]
Needs: Python 3.10+, requests, playwright (`pip install requests playwright`,
then `playwright install chromium`; or set CHROME_EXE to a Chromium binary).

Polite by design: run it on your own site only. One page request at a time, 2 s
apart (a browser load also fetches that page's scripts and images); 4 pages make
about 60 page requests in all. Requests come from your own IP, so a host that
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
import urllib.parse
from html.parser import HTMLParser
from pathlib import Path

try:
    import requests
except ImportError:
    sys.exit("Needs requests and playwright: pip install requests playwright")

OUT = Path(sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else Path(__file__).parent / "raw")
SPACING_S = 2.0

# Set from --pages in main(): robots.txt from each page's host, and the pages
# for gate 2 (every agent name) and gate 3 (JS off vs JS on).
ROBOTS_URLS: list[str] = []
GATE2_URLS: list[str] = []
GATE3_URLS: list[str] = []

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

# Facts a reader must get from each page, set from --facts in main().
KEY_FACTS: dict[str, list[str]] = {}

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
UNRESERVED = set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~")
PRINTABLE_ASCII = "".join(chr(c) for c in range(33, 127))
# Apple: if robots.txt doesn't mention Applebot but does mention Googlebot,
# Applebot follows the Googlebot rules.
FALLBACK = {"applebot": "googlebot"}


def norm_path(path: str) -> str:
    """RFC 9309: compare rule and URL paths in one form. Decode escaped unreserved
    characters, upper-case other escapes, and percent-encode non-ASCII."""
    def fix(m: re.Match) -> str:
        ch = chr(int(m.group(1), 16))
        return ch if ch in UNRESERVED else "%" + m.group(1).upper()
    return urllib.parse.quote(re.sub(r"%([0-9A-Fa-f]{2})", fix, path), safe=PRINTABLE_ASCII)


def rule_matches(pattern: str, target: str) -> bool:
    """RFC 9309 path match: `*` matches any characters, a trailing `$` anchors the end."""
    anchored = pattern.endswith("$")
    rx = re.escape(pattern[:-1] if anchored else pattern).replace(r"\*", ".*")
    return re.match(rx + ("$" if anchored else ""), target) is not None


def robots_allows(rules: list[str], url: str) -> bool:
    """RFC 9309: the longest matching Allow/Disallow path wins, and Allow wins a tie."""
    parts = urllib.parse.urlsplit(url)
    target = norm_path((parts.path or "/") + ("?" + parts.query if parts.query else ""))
    best = (-1, True)  # no matching rule: allowed
    for ln in rules:
        key, _, val = ln.partition(":")
        key, val = key.strip().lower(), norm_path(val.strip())
        if key in ("allow", "disallow") and val and rule_matches(val, target):
            best = max(best, (len(val), key == "allow"))
    return best[1]


def gate1(log: dict) -> None:
    out = []
    for url in ROBOTS_URLS:
        try:
            r = requests.get(url, headers={"User-Agent": CHROME}, timeout=20)
        except Exception as e:  # network error is a result too
            out.append({"url": url, "error": repr(e), "at": stamp()})
            time.sleep(SPACING_S)
            continue
        time.sleep(SPACING_S)
        (OUT / f"robots_{slug(url)}.txt").write_text(r.text)
        # RFC 9309: a 4xx robots.txt means no rules; a 5xx means assume all is disallowed.
        text = r.text if r.status_code < 400 else ""
        if r.status_code >= 500:
            text = "User-agent: *\nDisallow: /\n"
        # The group each token falls into: its own group, or "*". Consecutive
        # User-agent lines share the rules that follow them.
        named: dict[str, list[str]] = {}
        agents: list[str] = []
        in_rules = False
        for raw in text.splitlines():
            ln = raw.split("#", 1)[0].strip()
            key, _, val = ln.partition(":")
            key = key.strip().lower()
            if key == "user-agent":
                if in_rules:
                    agents, in_rules = [], False
                agents.append(val.strip().lower())
                named.setdefault(agents[-1], [])
            elif key in ("allow", "disallow", "crawl-delay") and agents:
                in_rules = True
                for a in agents:
                    named[a].append(ln)
        host = urllib.parse.urlsplit(url).netloc
        rows = []
        for tok, cls, doc in TOKENS:
            key, fb = tok.lower(), FALLBACK.get(tok.lower())
            if key in named:
                group, lines = "own group", named[key]
            elif fb in named:
                group, lines = f"follows {fb} (documented fallback)", named[fb]
            elif "*" in named:
                group, lines = "falls to *", named["*"]
            else:
                group, lines = "no rule", []
            rows.append({
                "token": tok, "class": cls, "doc": doc,
                "group": group,
                "lines": lines,
                # Whether robots.txt lets this token fetch each page you passed on this host.
                "allowed": {u: robots_allows(lines, u) for u in GATE2_URLS
                            if urllib.parse.urlsplit(u).netloc == host},
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
            try:
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
            except Exception as e:  # a page that fails is a result too; keep the run going
                rows.append({"url": url, "error": repr(e), "at": stamp()})
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


def norm(url: str) -> str:
    """A bare host gets its "/" path, so https://example.com and https://example.com/ match."""
    parts = urllib.parse.urlsplit(url)
    if parts.scheme not in ("http", "https") or not parts.netloc:
        sys.exit(f"Not a full http(s) URL: {url!r}. Pass URLs like https://example.com/")
    return url if parts.path else url + "/"


def main() -> None:
    global ROBOTS_URLS, GATE2_URLS, GATE3_URLS
    # --pages: the pages to check; robots.txt comes from each page's host.
    pages = [norm(u) for u in arg_list("--pages")]
    if not pages:
        sys.exit(__doc__)
    GATE2_URLS = GATE3_URLS = pages
    ROBOTS_URLS = sorted({u.split("/", 3)[0] + "//" + u.split("/", 3)[2] + "/robots.txt" for u in pages})
    # --facts "URL=fact1|fact2": strings a reader must get from that page.
    for spec in arg_list("--facts"):
        url, _, facts = spec.partition("=")
        KEY_FACTS[norm(url)] = [f for f in facts.split("|") if f]
    # --gates 1,3 reruns only those gates and keeps the others' saved results.
    gates = {"1", "2", "3"}
    if "--gates" in sys.argv:
        gates = {g for v in arg_list("--gates") for g in v.split(",") if g}
        if not gates or not gates <= {"1", "2", "3"}:
            sys.exit(__doc__)
    if "3" in gates:
        try:  # gate 3 needs Playwright; stop before any request rather than after gates 1 and 2
            import playwright.sync_api  # noqa: F401
        except ImportError:
            sys.exit("Gate 3 needs playwright: pip install playwright, then playwright install chromium")
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
