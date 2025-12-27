# Repository Guidelines

## Project Structure & Module Organization

- `src/` contains application code; key areas include `src/components/` (UI), `src/contexts/`, `src/hooks/`, `src/themes/`, `src/utils/`, and `src/config/`.
- `src/assets/` holds static assets used by the app.
- `public/` is for static files served by Vite.
- `scripts/` contains utility scripts like `healthcheck.js`.
- `architect.md`, `plan.md`, and `tasks.md` capture requirements and roadmap details.

## Build, Test, and Development Commands

- `npm install` installs dependencies.
- `npm run dev` starts the Vite dev server.
- `npm run build` produces the production build.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint on the codebase.
- `npm run healthcheck` executes `scripts/healthcheck.js` (optionally pass a port).

## Coding Style & Naming Conventions

- Use 2-space indentation, single quotes, and no semicolons (match `src/*.jsx`).
- React components use PascalCase filenames (example: `Header.jsx`).
- Hooks follow the `useX` pattern in `src/hooks/`.
- Tailwind utility classes live in JSX; shared theme tokens live in `src/themes/`.
- Keep configuration modules in `src/config/` (example: `nodeTypes.js`).

## Testing Guidelines

- There is no automated test framework yet. Validate changes in the browser and run `npm run healthcheck`.
- `test-nodes.html` can be opened directly for quick node data experiments.
- If you add tests, prefer `*.test.jsx` or `*.spec.jsx` under `src/` and document the runner.

## Implementation Workflow (Required)

- When asked to "implement phase X step Y", first open the matching template: `implementation-phase0X-stepYY.md`.
- If the template does not exist, stop and inform the user; do not proceed.
- Follow the template exactly: read referenced sections of `architect.md` and the matching section in `plan.md`, implement as specified, and complete the verification checklist.
- Update `tasks.md` as each sub-task is completed.
- Use `C:\Development\Code\system-design-visualizer` only as a read-only reference; never modify it.

## Commit & Pull Request Guidelines

- Commit messages follow a lightweight conventional style: `feat: ...`, `fix: ...`, `chore: ...` (see git history).
- Keep commits focused on a single phase or feature; reference `plan.md` or `tasks.md` when relevant.
- PRs should include a concise summary, linked issues/tasks, screenshots for UI changes, and manual test notes (example: `npm run dev` + `npm run healthcheck`).
