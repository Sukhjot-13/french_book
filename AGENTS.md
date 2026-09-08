## AI Behavior & Architecture Guidelines

- **Greeting:** ALWAYS start every session, answer, or work block by addressing the user by name: **Sukhjot**.
- **Architecture Documentation (docs/architecture.md):** Project doc files (architecture, suggestions, to-do) live in the project's `docs/` folder, NOT at the project root — see "Project doc files location" below.
  - Every file in the codebase must be listed in `docs/architecture.md`.
  - For each file, document:
    1. Its **main function/purpose**.
    2. A comprehensive list of **all functions** it contains and their roles.
- **Continuous Updates:** Whenever any change is made to any part of the codebase, immediately update `docs/architecture.md` with those changes. This ensures we never have to search the whole codebase in the future.
- **Double-Check Verification:** After working on any file or part of the project, double-check its functionality against `docs/architecture.md`. If the file or function is missing from the architecture file, add it; if it has changed, update it immediately.
- **Auto-Verify After Each Change:** After completing any modification to the codebase, immediately verify the work by doing a fresh scan to catch anything missed — check for remaining instances of the old pattern, look at the diff from all angles, grep for anti-patterns, and confirm no files were left partially updated. Do not proceed to the next task or declare done until this scan confirms completeness.

## Suggestions File (docs/suggestions.md)

- Whenever you have an idea for an improvement, new feature, vulnerability finding, or any suggestion about the project, write it into `docs/suggestions.md` in the project's `docs/` folder.
- Organize under section headings: `## 🟢 Improvements`, `## 🟡 New Features`, `## 🔴 Vulnerabilities`, or add a new section if none of those fit.
- Date-stamp each entry and keep existing entries — don't delete old ones unless they've been implemented.

## Architecture File (docs/architecture.md) Rules

- When creating or editing `docs/architecture.md`, always include a **separate Environment Variables section** listing every env var used by the site, what it's for, and where it's referenced.
- Keep other structural changes to `docs/architecture.md` in line with the existing pattern (file path → purpose → list of functions).

## Project doc files location

- **`docs/architecture.md`** — always-current file/function inventory + env vars (update on every change).
- **`docs/suggestions.md`** — improvement / feature / vulnerability log.
- **`docs/to-do.md`** — task list / session handoff (when one exists).
- These live in the project's `docs/` folder — never at the project root (user's preference, 2026-08-13).

## Auto-Orient at Session Start

- **At the very start of every session** (before any response or task), silently:
  1. Check if `docs/architecture.md` exists in the project's `docs/` folder.
  2. If yes, read it to understand the project structure.
  3. If no, scan the project structure and create `docs/architecture.md` first.
- No need to tell the user this is happening — just orient yourself silently and be ready to work.
- When the user eventually asks a question or gives a task, you're already oriented.

## Testing Guidelines

- **Test Every Functionality:** Whenever possible, every feature/functionality must have corresponding tests. Don't leave new logic untested.
- **Proper Structure:** Organize tests in a dedicated folder structure (e.g., `tests/` mirroring `src/`, or colocated per project convention) whenever necessary — keep test files clearly named after what they test (e.g., `auth.test.js` for `auth.js`).
- **Single Test Runner:** Maintain **one single entry-point** to run ALL tests (e.g., `tests/run-all.test.js`, an aggregate suite script, or a standard `npm test` / `pytest` command) so the entire test suite can be executed in one go — this makes it easy for AI and humans to verify everything at once.
- **Keep Tests in Sync:** Whenever any file, function, or behavior is changed, update its corresponding tests too. Never leave outdated/failing tests behind — stale tests are treated as broken code.
- **Run After Changes:** After completing any modification, run the full test suite via the single runner to confirm nothing is broken before declaring the task done.

## Commit Workflow

- **During active development (in progress):** Commit changes to the **local repository only** — do not push to remote. Use descriptive but incremental commit messages.
- **When work is confirmed working:** Once I confirm (either explicitly or by expressing satisfaction with the result), push the commits to the **remote repository**. Do not wait for an explicit "push" or "commit" instruction — if the work is clearly done and I've acknowledged it's good, go ahead and push.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
