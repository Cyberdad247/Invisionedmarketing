# Project Plan: Optimized Execution for [Project Name]

**Overall Vision:** To build modular frameworks adaptable for any AI context, ensuring scalability and adaptability, following a structured, production-quality workflow. (Based on Mythosmith goals)

**Core Principles (Golden Rules):**
- Use markdown files (README.md, PLANNING.md, TASK.md).
- Keep files under 500 lines; split into modules when needed.
- Start fresh conversations often (avoid long threads).
- Don't overload the model (one task per message).
- Test early, test often (unit tests for every new function).
- Be specific in requests; provide context and examples.
- Write docs and comments as you go.
- Implement environment variables yourself.

**AI Behavior Rules:**
- Never assume missing context; ask questions if uncertain.
- Never hallucinate libraries or functions; use known, verified packages.
- Always confirm file paths and module names exist.
- Never delete or overwrite existing code unless instructed or part of a TASK.md task.

---

## Phases of Execution

This plan is broken down into four main phases to ensure logical progression and stability.

### Phase 1: System Stability and Foundational Code Quality
**Goal:** Establish a stable build environment and standardize core code elements for consistency and maintainability.

### Phase 2: Core Backend Processing Layer
**Goal:** Implement robust systems for handling background tasks, scheduling, and foundational logging essential for asynchronous operations.

### Phase 3: Agent Infrastructure and Testing
**Goal:** Build out the necessary components for agent memory and establish comprehensive testing practices to ensure reliability.

### Phase 4: Frontend Structure and Consistency
**Goal:** Refactor and modularize the frontend for better readability, maintainability, reusability, and accessibility, implementing global state management.

---

**Technology Stack Notes:**
- Backend: Likely Python (given SuperAGI context and your preference) with frameworks like Flask or FastAPI (as per notes).
- Database: PostgreSQL (noted as a strong open-source choice).
- Background Tasks: Redis/Celery or similar.
- Agent Memory: Vector Database.
- Frontend: Existing stack (Next.js inferred from config files).

**Constraints:**
- Adhere to the Golden Rules and AI Behavior Rules at all times.
- Prioritize code clarity and testability.
- Document decisions and complex logic (`# Reason:` comments).

**(Note: Specific tasks for each phase are tracked in TASK.md)**