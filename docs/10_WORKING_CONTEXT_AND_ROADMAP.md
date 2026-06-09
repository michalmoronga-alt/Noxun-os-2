# MindForge V1 / V1.2 — Working Context and Roadmap

## 1. What MindForge is

MindForge is a local-first development cockpit for Michal.

Its job is to capture ideas, turn them into clear development steps, preserve project context, and help Michal decide the next reasonable move without losing control to the AI agent.

Current product definition:

> MindForge V1 is a personal development cockpit that captures an idea, turns it into an approvable step, keeps the project context, and shows Michal the next reasonable move.

This is intentionally narrower than the long-term vision of a full AI second brain. V1 must first become a useful development workplace.

## 2. Why we are building it

Michal works with fast AI coding tools such as AG/Codex. The speed is useful, but it creates several problems:

- ideas arrive faster than they can be organized,
- context gets lost between ChatGPT, Telegram, AG/Codex, docs and code,
- AI agents can overscope tasks,
- approving a short Telegram summary can feel like approving blindly,
- a growing list of MF task numbers becomes hard to navigate,
- side ideas are valuable but often get lost because they are outside the current topic.

MindForge is meant to reduce this friction.

The app should not replace Michal's judgement. It should prepare better decisions.

## 3. Current working loop

Current Dev Loop:

```txt
Telegram input
→ AI draft
→ approval
→ Markdown package export
→ AG/Codex implementation
→ smoke report
→ follow-up if needed
```

This loop already works in a basic form.

Current Telegram modes:

- `/idea`, `/i` — brainstorm / idea, not exported as build
- `/build`, `/b` — prepare build task and approval draft
- `/smoke`, `/s` — attach smoke report to existing task
- `/follow`, `/f` — create follow-up task
- `/note`, `/n` — save note without build/export

Legacy formats still work:

- `Brain Dev:`
- `Brain Smoke:`
- `Brain Follow-up:`

## 4. Current state of the app

Implemented / working:

- FastAPI backend
- React/Vite frontend
- SQLite storage
- Telegram text input
- Gemini AI provider working
- fallback handling for provider failures
- approval/export loop
- Markdown dev task packages in `docs/dev-tasks/`
- smoke report flow linked to existing task IDs
- Slovak frontend labels
- Windows launcher scripts
- basic Projects layer
- default active project: `MindForge`
- Project Context Pack service
- whitelisted docs reader for project context
- active project API endpoints:
  - `GET /api/projects/active`
  - `GET /api/projects/active/context`
- frontend indicator: `Aktívny projekt: MindForge`
- Settings panel with project metadata

Recently proven value:

The Project Context Pack improved generated draft quality. A simple frontend request such as a static development status page no longer turned into an unnecessary database/admin CRUD feature.

## 5. Key decisions already made

### 5.1 V1 is local-first

Reason: local-first keeps iteration fast, avoids cloud/auth complexity, and fits Michal's current workflow.

### 5.2 No GitHub API in V1

Reason: GitHub API automation is attractive, but it would add a lot of state and permission complexity before the basic cockpit is usable.

### 5.3 Telegram is quick input, frontend is the control panel

Reason: Telegram is excellent for capturing thoughts quickly. It is not good for reviewing complex development decisions. Approval and review must happen in the frontend.

### 5.4 Human approval remains the gate

Reason: MindForge is not meant to let AI autonomously change the project. AI suggests; Michal approves.

### 5.5 Project Context Pack before full repo indexing

Reason: a small whitelist of relevant docs is safer than giving the AI the whole repository or the whole `C:\APP DEV` folder. Context should be controlled, auditable and limited.

### 5.6 Do not build full Archivist yet

Reason: Archivist is important, but a full memory system with vector DB, embeddings and autonomous suggestions would distract from V1. First we build practical cockpit features.

### 5.7 Voice is postponed

Reason: text workflow must be stable first.

### 5.8 V1 product direction changed from “AI brain” to “development cockpit”

Reason: the app already has a Dev Loop. The urgent problem is orientation and decision-making, not broad second-brain automation.

## 6. Current main pain points

### 6.1 Blind approval

Telegram currently sends a short summary. Michal cannot confidently see:

- what exactly he is approving,
- what will change,
- what must not change,
- how large/risky the task is,
- what context the AI used,
- whether the AG/Codex prompt is safe and precise.

This is the current number one problem.

### 6.2 Linear MF-number list

A list of `MF-0016`, `MF-0017`, `MF-0018` quickly becomes hard to navigate. Michal needs to see projects, categories, statuses and next steps.

### 6.3 Side ideas get lost

Michal often has good side ideas during active work. They should not derail the current task, but they should not disappear.

### 6.4 Context is not yet visible enough

The backend can generate a Project Context Pack, but approval UI must show what context was actually used for a particular draft.

## 7. Consolidated feedback from other agents

Gemini, Grok, Claude and Codex broadly agreed on the same direction:

1. Approval Preview is the highest priority.
2. MindForge should become a development cockpit, not just a task list.
3. Side ideas need an Idea Inbox / Parking Lot / Recent Sparks area.
4. Archivist should start as a light suggestion system, not as a full memory engine.
5. Context should be visible and auditable.
6. Task size and implementation risk should be checked before export.

Useful concepts selected:

- Approval Preview 2.0
- Context Receipt / Context Audit Trail
- Impact Estimate
- Risk Score / Task Size Gate
- Confidence Level
- Pre-flight Checklist
- Development Workspace / cockpit
- Current Reality Map
- Next Best Move
- Agent Radar
- Idea Inbox / Recent Sparks
- Decision Log
- Operating Principles
- Lite Archivist without vector DB

Ideas explicitly postponed:

- full vector memory,
- full Master Agent,
- full `C:\APP DEV` indexing,
- GitHub API write automation,
- graph view,
- Obsidian export,
- autonomous agent execution,
- gamification,
- mood/energy system,
- voice-to-structured workflow.

## 8. Roadmap

### BUILD 1 — Approval Preview 2.0 + Context Receipt

Goal: make approval a real decision moment.

Should include:

- original Telegram/raw input,
- generated AI draft,
- what Michal wants to achieve,
- what changes for the user,
- what must not change,
- scope,
- out of scope,
- technical plan,
- acceptance tests,
- risks,
- editable AG/Codex prompt,
- task size: small / medium / large,
- risk score,
- confidence level,
- recommendation: approve / edit / split / park,
- reason for recommendation,
- exact next step,
- Context Receipt:
  - project context used,
  - docs loaded,
  - missing docs,
  - recent tasks included,
  - note that the whole repo was not read,
- Telegram should send only short summary and direct Michal to frontend for full review.

### BUILD 2 — Development Workspace / Cockpit

Goal: turn the Vývoj section into a project cockpit.

Should include:

- active project dashboard,
- “Dnes riešiť” area,
- project tree,
- selected item detail,
- tasks grouped by status,
- color-coded status system,
- Current Reality Map,
- Next Best Move.

Suggested zones:

```txt
1. Dnes riešiť
   - čaká na schválenie
   - vo vývoji
   - treba otestovať
   - zlyhalo

2. Projektový strom
   - Core workflow
   - UX
   - Context Pack
   - Agent workflow
   - Future / zaparkované

3. Detail vybranej veci
   - čo to je
   - prečo to vzniklo
   - posledný stav
   - súvisiace nápady
   - smoke reporty
   - ďalšia odporúčaná akcia
```

### BUILD 3 — Idea Inbox / Recent Sparks

Goal: prevent side ideas from disappearing while keeping current work focused.

Categories:

- future_feature,
- workflow_observation,
- preference_candidate,
- question,
- cross_project,
- tech_debt,
- decision_candidate,
- parked_build.

### BUILD 4 — Agent Radar / Archivist Lite

Goal: add light suggestions without autonomous decisions.

Examples:

- “This task is too broad.”
- “This looks related to MF-0016.”
- “This is probably a brainstorm, not a build.”
- “This should become a decision or preference.”
- “A similar task had a failed smoke report.”

Implementation should start with simple SQL/fuzzy matching, not vector DB.

### BUILD 5 — Decision Log / Operating Principles

Goal: separate permanent project truths and Michal's workflow rules from ordinary notes.

Decision examples:

- V1 does not use GitHub API.
- Telegram is input, frontend is control panel.
- Project Context Pack uses whitelisted docs.
- Voice is postponed.

Operating Principles examples:

- First discuss concepts verbally, then build.
- Keep AG/Codex prompts in English.
- Answer Michal in Slovak.
- Keep smoke prompts short.
- Give 1–10 score when evaluating.
- Split large features into safe iterations.

### BUILD 6 — Briefing

Goal: quick orientation when opening MindForge or via Telegram.

Examples:

- `/briefing`
- daily or on-demand summary:
  - what is waiting for approval,
  - what is in development,
  - what needs smoke test,
  - what failed,
  - recommended next step.

## 9. Current UI direction

MindForge should feel like a cockpit, not like a note dump.

The user should be able to open Vývoj and know within 10 seconds:

- which project is active,
- what is waiting,
- what is risky,
- what needs approval,
- what needs smoke testing,
- what is the next reasonable move.

Recommended status colors:

- yellow — waiting for decision,
- blue — in development,
- green — tested / verified,
- red — problem / failed,
- grey — parked,
- purple / turquoise — idea / brainstorm.

## 10. Side ideas and future parking lot

Side ideas collected during planning:

- import data from old ChatGPT conversations,
- detect repeated Michal phrases and suggest them as Operating Principles,
- allow future multi-project workspace under `C:\APP DEV`,
- add `decision` record type,
- show context used per draft,
- create `.mf-pending-task` / `.mf-history` bridge later,
- store AG/Codex session output as task artifact,
- add Task Decomposer button,
- use git status or recently modified files as future context hints,
- add Obsidian-style graph/export only much later,
- add voice-to-structured later.

## 11. What not to do now

Do not start with:

- whole workspace index,
- vector DB,
- autonomous Master Agent,
- cloud sync,
- GitHub API automation,
- voice,
- graph views,
- full Archivist.

Reason: these are attractive, but they would slow the practical V1 cockpit.

## 12. Next decision

Next approved direction:

```txt
BUILD — Approval Preview 2.0 + Context Receipt
```

This should be implemented before Development Workspace, Idea Inbox or Archivist Lite.
