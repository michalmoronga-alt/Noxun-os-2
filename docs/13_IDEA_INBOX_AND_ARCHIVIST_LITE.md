# Idea Inbox / Recent Sparks / Archivist Lite — Direction Spec

## Purpose

MindForge needs a safe place for side ideas.

Michal often has useful ideas while working on another topic. These ideas should not derail the current build, but they should not disappear.

The goal is a parking lot for future value, not a full autonomous Archivist in V1.

## Core concepts

### Idea Inbox

A place for captured ideas that are not yet build tasks.

Examples:

- future feature,
- workflow observation,
- possible preference,
- question,
- cross-project thought,
- tech debt note,
- decision candidate,
- parked build idea.

### Recent Sparks

Small fresh ideas that were just captured and are not yet organized.

This concept comes from older Forge cigi direction and should be preserved as a lightweight capture pattern.

### Parking Lot

A calmer area for ideas that are intentionally not part of the current V1 build path.

## Suggested categories

- `future_feature`
- `workflow_observation`
- `preference_candidate`
- `question`
- `cross_project`
- `tech_debt`
- `decision_candidate`
- `parked_build`

## Agent Radar

Agent Radar is a light suggestion layer. It should not act autonomously.

Examples:

- “This task is too broad.”
- “This looks related to MF-0016.”
- “This is probably a brainstorm, not a build.”
- “This may be a permanent operating principle.”
- “This looks like a decision, not a note.”
- “A similar task had a failed smoke report.”

Every suggestion must be reviewable by Michal.

## Archivist Lite

Archivist Lite is the future low-complexity first step toward an Archivist.

It should start with simple SQL/fuzzy matching over existing records:

- titles,
- summaries,
- tags/categories,
- smoke report excerpts,
- decision records,
- notes.

Do not use vector DB in the first version.

## Operating Principles candidates

Some repeated user phrases or preferences should eventually become Operating Principles.

Examples:

- “First discuss the concept verbally, then build.”
- “AG/Codex prompts should be in English.”
- “Answer Michal in Slovak.”
- “Smoke prompts should be short.”
- “When evaluating, provide a 1–10 score.”
- “Split large features into smaller safe iterations.”

The system may later suggest:

```txt
I noticed this pattern. Save it as an Operating Principle?
```

Actions:

- approve,
- reject,
- remind later.

## Out of scope now

- autonomous memory rewriting,
- vector embeddings,
- graph view,
- whole chat import automation,
- full Master Agent,
- automatic changes without approval.

## Relationship to roadmap

Implement after:

1. Approval Preview 2.0,
2. Development Workspace / Cockpit.

Reason: Inbox and Archivist Lite need clear project/task status structure to be useful.
