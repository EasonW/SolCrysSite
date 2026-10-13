# Cross-model code review contract

## Goal

Find real correctness, rendering, compatibility, and regression risks in the requested diff. Prefer a short list of evidenced defects over speculative or stylistic commentary.

## Inputs

- Review exactly one target: a complete branch against its merge base, that branch plus its working-tree changes, uncommitted changes, or one commit. The final-candidate gate below determines which scope can satisfy completion or publication.
- Apply the closest `AGENTS.md` or `CLAUDE.md` instructions and established repository patterns.
- Compare against the supplied spec or ticket when one is provided.
- Treat supplied test results as evidence, not proof that the implementation is correct.
- The CLI review summarizes a deleted file as its Git header, path, and line count. Return `BLOCKED` and request `--include-deleted-bodies` when a verdict depends on an omitted body.

If the target or required context cannot be inspected, return `BLOCKED` instead of guessing.

For the tool-disabled CLI review, the supplied snapshot bundle is the only available context. Distinguish code that is absent from that bundle from code that is absent from the repository. If a material claim depends on a missing caller, content file, configuration, or test, identify the exact missing evidence and return `BLOCKED` when it prevents a reliable verdict; do not infer either a defect or a PASS from omission. Keep independent findings that are supported by the supplied evidence.

## Independence and safety

- Start with fresh context and do not inspect another reviewer's report, transcript, or conclusions.
- Remain read-only. Do not edit files, install dependencies, commit, push, or contact external systems.
- Do not invoke another model, agent, reviewer, or review skill.
- Review only the requested diff and directly relevant surrounding code.

## Final-candidate gate

Use one fresh, complete-diff review cycle for the final candidate, with both reviewers required by root `AGENTS.md`. This is the authoritative completion and pull request gate, including drafts and documentation-only pull requests.

- When committing is already authorized, verify the stable change, create a local candidate commit, then review the entire proposed diff with pinned base, merge-base, and final head commits and a clean final tree. No separate pre-commit review is required. Local fix commits remain within the same authorization; review their new final candidate before completion or publication.
- When committing is not authorized, review the complete branch plus staged, unstaged, and relevant untracked work against its pinned merge-base before task completion. Do not create a commit solely to obtain review. Later publishing requires review of the exact committed final candidate.
- Use a separate read-only reviewer process or agent that did not implement the change. Keep the author's conversation and the other reviewer's report out of its context.
- Both reviewers must return explicit `PASS` with no unresolved P0/P1 before task completion, any push, pull request publication or update, or handoff as ready. Missing, interrupted, or unavailable review blocks those actions; self-review, a green gate, and review-round limits do not waive it.
- Record reviewer identity, base, merge-base, head, date, verdict, and remaining non-blocking findings in the pull request body or an attributed review comment. Identify agent or CLI signoff accurately; it is not human approval.
- Reuse passing signoff only for the same exact reviewed inputs. Any change to head, base, merge-base, working-tree evidence, or supplied context invalidates it.
- Merge and deployment remain separately owner-authorized. This workflow does not establish GitHub branch-protection enforcement.

## Review lenses

- Standards: closest repository instructions and established conventions
- Spec: compliance with the supplied requirements and missing acceptance criteria
- Runtime correctness, error paths, and type safety under the JSON-inferred content types
- Rendering parity between the app and the prerender
- Published output: links, metadata, structured data, sitemap, feed, and search index
- Secrets, analytics consent, and lead-intake behavior
- Test gaps that could conceal a concrete regression
- Dead code or stale documentation created by the change

Do not report personal style preferences, pre-existing defects outside the diff, or risks without a concrete failure mode.

For affected paths, preserve these repository-specific checks:

- A change to page structure or hand-mirrored copy updates both the app renderer and `scripts/prerender.mjs`.
- A new content block type or inline syntax is handled in the app renderer, the prerender, and the search-index extraction in `scripts/generate-client-content.mjs`.
- A new published page sets `ogImage` and commits the matching PNG under `public/og/`.
- Internal links use paths that the build's link check can resolve; call-to-action links to the product use the app domain.
- Content dates are consistent: `published` or `datePublished` is not later than `updated`.

## Priority

- **P0 — Critical:** immediate severe impact such as credential exposure or a broken production site.
- **P1 — High:** likely visitor-facing or crawler-facing failure, wrong published content, or a broken build or deploy. P0/P1 block task completion, push, and publication.
- **P2 — Medium:** real but narrower defect. Fix when practical or defer with explicit owner rationale.
- **P3 — Low:** limited improvement or maintainability issue. Non-blocking.

## Required output

```markdown
# <Claude|Codex> review

Verdict: PASS | FAIL | BLOCKED
Target: <reviewed diff; pinned base/merge-base/head and worktree evidence when applicable>
Reviewer: <agent/CLI identity>
Date: <review date>
Spec: <path or none>
Tests: <reported evidence or not provided>

## Findings

[P1] Short title — path/to/file:line
- Evidence: concrete behavior or reproduction
- Impact: what fails and for whom
- Recommendation: smallest safe correction
- Confidence: high | medium | low
```

Order findings P0 through P3. Omit the Findings section when there are none. `PASS` means no unresolved P0/P1 findings; `FAIL` means at least one P0/P1 finding; `BLOCKED` means the requested scope could not be reviewed reliably.
