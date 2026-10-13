# Repository agent contract

This is the shared authority for Codex, Claude Code, and other coding agents working in this repository. Keep durable rules here; keep task details in the issue or prompt.

## Repository map

- `src/`: Vite and React single-page app. `src/content/*.json` is the content source of truth: resource pages, newsroom, pricing, user guides, and courses.
- `scripts/prerender.mjs`: writes the static HTML, sitemap, feed, and `llms.txt` that crawlers read. It mirrors the app by hand.
- `scripts/generate-client-content.mjs`: generates `src/content/homeContent.json` and `src/content/searchPages.json`. It runs before every build and typecheck; do not edit the generated files by hand.
- `scripts/check-links.mjs`: last step of `npm run build`; fails on any internal link that does not resolve.
- `scripts/og/render.mjs`: renders the per-page OG cards committed under `public/og/`.
- `.github/workflows/deploy.yml`: every push to `main` builds the site and deploys it to production.

## Working principles

- Read the relevant code and the closest instructions before editing.
- Make the smallest change that satisfies the requested outcome; preserve unrelated dirty work.
- Prefer existing modules and patterns. Do not introduce a parallel abstraction without showing why the current seam is inadequate.
- Treat tests, logs, and builds as evidence. Never claim a command passed unless it ran successfully in the current tree.
- Never commit secrets, `.env.local`, `node_modules/`, or `dist/`.

## Rendering parity

A page renders twice: in the app (`src/pages/`, `src/components/`) for visitors, and in `scripts/prerender.mjs` for crawlers. The two must say the same thing.

- Change both renderers together when page structure or hand-mirrored copy changes.
- A new content block type or inline syntax needs the app renderer, the prerender, and the search-index extraction in `scripts/generate-client-content.mjs`.
- Commit the regenerated `src/content/homeContent.json` and `src/content/searchPages.json` with the content change that produced them.
- Every published page carries its own OG card. Set `ogImage` on the entry, run `node scripts/og/render.mjs --only=<slug> --force`, and commit the PNG. A page without the field falls back to the generic card silently.

## Git safety and pull requests

- Never push directly to `main`. A push to `main` is a production deploy.
- Never run `npm run deploy` or push to the `gh-pages` branch. Production is reached only by merging a reviewed pull request.
- Every change reaches `main` through a pull request, including content-only and documentation-only changes.
- Start each task on a branch or worktree created from freshly fetched `origin/main`.
- Before committing, verify the branch with `git branch --show-current` and inspect `git status --short` plus the staged diff.
- Stage only intentional paths. Never use `git add -A`, `git checkout .`, or a bare `git stash` in a tree with work you do not own.
- A squash-merged branch is closed. Follow-up work starts from fresh `origin/main`.
- Force-push only with explicit owner direction and `--force-with-lease`, and never to `main`.
- Check `which gh && gh auth status` before using `gh` to create a pull request.

## Verification

`npm run check` is the single local gate: typecheck, lint, tests, build, prerender, and the internal-link check.

- Run targeted checks while implementing; run the gate once after the diff is stable and before a candidate commit or the required final review.
- Do not repeat a successful gate when neither the diff nor the relevant environment changed.
- For a new or changed content page, a reader other than the author also reads the rendered `dist/<path>/index.html` from top to bottom. Searching the output for expected strings does not catch truncated sentences, unrendered markdown, or blocks in the wrong order.

## Review gate

Every pull request passes two independent reviewers, Codex and Claude, whatever its size. Use the single final-candidate gate in `docs/agents/code-review.md`.

- Both reviewers inspect the same complete proposed diff with pinned base, merge-base, and final head. Run them concurrently without sharing findings.
- Both must return `PASS` with no unresolved P0/P1 before task completion, any push, pull request publication or update (including drafts and documentation-only pull requests), or handoff as ready.
- A missing, interrupted, or unavailable review blocks those actions. Self-review and a green gate do not waive it.
- Record each reviewer's identity, base, merge-base, head, date, and verdict in the pull request body.
- Any change to a reviewed input invalidates signoff; review the new final candidate.
- Each logical change gets at most three review rounds. After round three, record remaining P1/P2 findings as owner-review TODOs. The cap does not waive the gate: with a P0/P1 still unresolved, stop and hand the branch to the owner as not ready.

When the owner has already authorized committing, a verified local candidate commit may precede the gate. Fixes may be committed locally within that authorization; then review the new final candidate.

### Running the reviewers

The review runner is `scripts/cross-model-review.mjs` in the SolCrys product repository. It reviews whichever repository it is run from. It resolves the merge-base from `--base` and reads the contract from that merge-base, so a branch cannot relax the rules it is reviewed under. Set `SOLCRYS_PRODUCT_REPO` to your local checkout of the product repository, then run both from inside this repository:

```bash
git fetch origin
review_base="$(git rev-parse origin/main)"
node "$SOLCRYS_PRODUCT_REPO/scripts/cross-model-review.mjs" codex --base "$review_base"
node "$SOLCRYS_PRODUCT_REPO/scripts/cross-model-review.mjs" claude --base "$review_base"
```

If the runner, a CLI, or authentication is unavailable, report the review as `BLOCKED` with the exact failure. Do not substitute the authoring model and call it a cross-model review.

## Merge and deployment

- Merging to `main` is the production deploy; there is no separate deploy step to approve. Merge only on the owner's explicit authorization of that merge and its deploy, after the owner has had the chance to preview the change.
- Authorization of one merge never carries to the next.
- After a merge, confirm that the deploy workflow succeeded and that the changed page is live.
