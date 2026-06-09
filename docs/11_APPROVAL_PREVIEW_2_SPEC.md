# Approval Preview 2.0 + Context Receipt — Specification

## Purpose

Approval Preview 2.0 turns approval from a binary button into a decision panel.

Current problem: Telegram approval is too short. Michal does not always know what exactly he is approving.

The approval UI must help Michal answer:

- What do I want to achieve?
- What will change for the user?
- What must not change?
- Is the task small enough?
- What is the implementation risk?
- What context did the AI use?
- Should I approve, edit, split or park this task?

## Product intent

Create a trustworthy approval moment before exporting a task to AG/Codex.

The approval view should make task scope, risk and next action obvious.

## Required UI sections

### 1. Original input

Show the raw Telegram/web input that created the draft.

### 2. Decision summary

Show a compact, human-readable summary:

- goal,
- expected user-facing change,
- non-goals / what must not change,
- task type,
- suggested next step.

### 3. Scope

Show:

- in scope,
- out of scope,
- acceptance tests,
- risks.

### 4. Impact Estimate

A modest estimate, not fake precision.

Fields:

- frontend impact: yes/no/unknown,
- backend impact: yes/no/unknown,
- database impact: yes/no/unknown,
- documentation impact: yes/no/unknown,
- likely touched areas/files if known.

Do not pretend exact line counts.

### 5. Task Size Gate

Classify:

- small,
- medium,
- large.

Recommended behavior:

- small: can usually approve,
- medium: review carefully,
- large: split before implementation.

### 6. Risk Score

Show risk level:

- low,
- medium,
- high,

optionally with 1–10 numeric score.

The score must include a short reason.

### 7. Confidence Level

Show confidence:

- low,
- medium,
- high.

This should be based on available context, not presented as exact truth.

Reasons can include:

- Project Context Pack was used,
- relevant docs were loaded,
- recent task summaries were included,
- context was missing,
- task is vague or broad.

### 8. Context Receipt

Show what the AI used as context:

- active project,
- context pack used: yes/no,
- loaded files,
- missing files,
- recent task summaries included,
- approximate context size,
- clear note: the whole repository was not read.

This is also called Context Audit Trail.

### 9. Editable AG/Codex prompt

Show the final English AG/Codex prompt in an editable text area before export.

Michal must be able to adjust the prompt without recreating the draft from Telegram.

### 10. Recommendation

The system should recommend one of:

- approve,
- edit,
- split,
- park.

Recommendation must include a short reason.

## Required actions

Buttons/actions:

- Approve & Export
- Save prompt edits
- Reject
- Park
- Split suggestion (can be placeholder in V1 if full decomposer is not implemented)

## Telegram behavior

Telegram should not carry the full approval detail.

Telegram should send a short summary:

```txt
Draft created: MF-XXXX
Project: MindForge
Size: small / medium / large
Risk: low / medium / high
Recommendation: approve / edit / split / park
Open frontend for full review.
```

Inline approve can stay, but the preferred review path should be frontend.

## Data considerations

Store enough metadata to render the preview later:

- original input,
- generated summary,
- scope,
- out of scope,
- acceptance tests,
- risks,
- impact estimate,
- size gate,
- risk score,
- confidence level,
- recommendation,
- context receipt,
- editable prompt body.

Do not add unnecessary external services.

## Out of scope for this build

- full Development Workspace dashboard,
- full Archivist,
- vector DB,
- whole repo indexing,
- GitHub API,
- autonomous task splitting,
- graph view.

## Acceptance tests

- User can open a pending draft and see the original input.
- User can see scope, out of scope, acceptance tests and risks.
- User can see task size, risk and confidence level.
- User can see Context Receipt with loaded docs and recent task summaries.
- User can edit final AG/Codex prompt before export.
- Edited prompt is used in exported package.
- Telegram sends shorter decision summary and directs user to frontend for full review.
- Existing `/idea`, `/build`, `/note`, `/smoke`, `/follow` flows keep working.
- No GitHub API, vector DB or whole workspace indexing is introduced.
