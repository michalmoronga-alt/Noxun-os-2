# ADR-0008 — MindForge V1 as Development Cockpit

## Status

Accepted

## Context

MindForge already has a functional core Dev Loop:

```txt
input → AI draft → approval → export → AG/Codex → smoke report → follow-up
```

The main problem is no longer whether the idea is valid. The main problem is how to make the app feel like a place where Michal can orient quickly and decide safely.

Previous wording around “AI brain” or “second brain” is useful as long-term vision, but too broad for V1 implementation.

## Decision

Define MindForge V1 as a development cockpit:

> MindForge V1 is a personal development cockpit that captures an idea, turns it into an approvable step, keeps the project context, and shows Michal the next reasonable move.

## Implications

V1 priorities become:

1. Approval Preview 2.0 + Context Receipt.
2. Development Workspace / Cockpit.
3. Idea Inbox / Recent Sparks.
4. Agent Radar / Archivist Lite.
5. Decision Log / Operating Principles.

V1 explicitly does not prioritize:

- full autonomous AI brain,
- full vector memory,
- full Master Agent,
- GitHub API automation,
- whole `C:\APP DEV` indexing,
- voice before text workflow is stable.

## Rationale

A cockpit gives Michal fast orientation:

- what is waiting,
- what is risky,
- what needs approval,
- what needs smoke testing,
- what the next reasonable move is.

This supports controlled AI-assisted development without surrendering decisions to the agent.
