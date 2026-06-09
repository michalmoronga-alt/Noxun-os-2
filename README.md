# MindForge

MindForge is a local-first development cockpit for turning ideas into reviewed, approved, and testable development steps.

Current product definition:

> MindForge V1 is a personal development cockpit that captures an idea, turns it into an approvable step, keeps the project context, and shows Michal the next reasonable move.

MindForge is not being built as a full autonomous AI brain in V1. The V1 focus is practical: reduce context loss, reduce approval friction, and make the development loop easier to control.

## Current V1 workflow

```txt
Telegram input
→ AI draft
→ Approval Preview
→ Markdown dev package export
→ AG/Codex implementation
→ Smoke report
→ Follow-up when needed
```

## Current stack

- Frontend: React / Vite
- Backend: FastAPI
- Database: SQLite
- Input: Telegram bot
- AI provider: configurable, currently Gemini works
- Export format: Markdown packages in `docs/dev-tasks/`
- Runtime mode: local-first on Michal's PC

## Current V1 principles

- Keep V1 local-first.
- Do not add GitHub API in V1.
- Do not index the whole `C:\APP DEV` folder yet.
- Do not add vector DB or full Archivist yet.
- Keep Telegram as quick input and frontend as the control panel.
- Use project context packs before asking AI to create build drafts.
- Human approval remains the gate before implementation.
- AG/Codex prompts are written in English; UI and Michal-facing communication are in Slovak.

## Current priority

The next main product step is:

```txt
Approval Preview 2.0 + Context Receipt
```

Reason: Michal currently receives only a short Telegram summary and cannot confidently see what exactly he is approving. Approval needs to become a decision panel, not just a binary approve/reject button.

## Documentation map

- `docs/10_WORKING_CONTEXT_AND_ROADMAP.md` — consolidated working context, decisions, roadmap, and future ideas.
- `docs/11_APPROVAL_PREVIEW_2_SPEC.md` — next build specification for Approval Preview 2.0.
- `docs/12_DEVELOPMENT_WORKSPACE_SPEC.md` — future Development Workspace / cockpit direction.
- `docs/13_IDEA_INBOX_AND_ARCHIVIST_LITE.md` — parking lot, recent sparks, Agent Radar, and Lite Archivist direction.
- `docs/decisions/ADR-0008-mindforge-v1-development-cockpit.md` — product direction decision.

## What not to build yet

Do not spend V1 effort on:

- full autonomous Master Agent,
- full Archivist with vector memory,
- GitHub API automation,
- cloud sync/auth,
- whole `C:\APP DEV` workspace indexing,
- voice messages before text workflow is stable,
- graph view / Obsidian-style bidirectional system.

These remain valid future directions, but only after the development cockpit is usable.
