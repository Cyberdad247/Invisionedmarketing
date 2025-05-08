# Project Tasks

This document tracks the specific tasks to be completed, aligning with the phases outlined in PLANNING.md.

---

## Phase 1: System Stability and Foundational Code Quality

- [x] Task 1.1: Resolve version conflicts and incompatible packages (package.json, pnpm-lock.yaml).
- [x] Task 1.2: Replace serverRuntimeConfig with experimental.serverActions in next.config.mjs.
- [ ] Task 1.3: Remove ignoreBuildErrors and ignoreDuringBuilds from next.config.mjs and address underlying build issues.
- [ ] Task 1.4: Adjust the regions setting in vercel.json to be less restrictive if needed.
- [ ] Task 1.5: Use an environment variable for NEXT_PUBLIC_APP_URL in vercel.json.
- [ ] Task 1.6: Implement strict TypeScript usage across the codebase.
- [ ] Task 1.7: Replace all 'magic strings' with enums, unions, or literal types.
- [ ] Task 1.8: Centralize theme (colors, fonts) in tailwind.config.js.
- [ ] Task 1.9: Refactor components to use custom Tailwind theme classes.

## Phase 2: Core Backend Processing Layer

- [ ] Task 2.1: Integrate Redis/Celery (or similar) for background tasks.
- [ ] Task 2.2: Implement Cron Scheduling Logic handler functions (/app/api/cron/workflow-scheduler/route.ts).
- [ ] Task 2.3: Develop logic to query database for scheduled workflows.
- [ ] Task 2.4: Develop logic to enqueue scheduled workflows into the background task system.
- [ ] Task 2.5: Integrate foundational logging within the workflow execution process.
- [ ] Task 2.6: Integrate foundational logging within the background task workers.

## Phase 3: Agent Infrastructure and Testing

- [ ] Task 3.1: Integrate a vector database for agent memory storage and retrieval.
- [ ] Task 3.2: Refine the existing test setup.
- [ ] Task 3.3: Implement unit tests for new backend logic (Task 2.1-2.6).
- [ ] Task 3.4: Ensure tests cover expected behavior, edge cases, and failures.
- [ ] Task 3.5: Implement an agent testing interface component/tool.

## Phase 4: Frontend Structure and Consistency

- [ ] Task 4.1: Split large components into smaller, focused files.
- [ ] Task 4.2: Refactor repeated UI patterns into reusable components.
- [ ] Task 4.3: Leverage centralized theme and standardized types in refactoring.
- [ ] Task 4.4: Improve accessibility (color contrast, aria labels) in refactored components.
- [ ] Task 4.5: Analyze application's data flow for shared state.
- [ ] Task 4.6: Implement Global State Management solution.

---

**(Mark tasks with [x] when completed)**
