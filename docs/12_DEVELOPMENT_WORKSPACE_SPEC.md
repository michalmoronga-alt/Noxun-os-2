# Development Workspace / Cockpit — Direction Spec

## Purpose

The Development Workspace turns the `Vývoj` section from a linear MF-number list into a project cockpit.

The goal is not to build a full AI brain yet. The goal is fast orientation and controlled decision-making.

Target outcome:

> Michal opens Vývoj and within 10 seconds knows which project is active, what is waiting, what is risky, what needs approval, what needs smoke testing, and what the next reasonable move is.

## Core layout concept

The `Vývoj` section should eventually have three main zones:

### 1. Dnes riešiť

A focused area with urgent/open items:

- waiting for approval,
- in development,
- smoke pending,
- failed/problem,
- blocked.

### 2. Projektový strom

A structured project map rather than only a flat task list.

Initial MindForge tree can include:

- Core workflow,
- UX,
- Context Pack,
- Agent workflow,
- Future / parked.

### 3. Detail vybranej veci

When a task, idea, project area or note is selected, show:

- what it is,
- why it exists,
- current status,
- related ideas,
- related smoke reports,
- context used,
- next recommended action.

## Project dashboard

Each project should eventually show:

- name,
- project identity (color/icon later),
- root path,
- docs path,
- active context files,
- status summary,
- open tasks,
- waiting approvals,
- smoke pending,
- completed tasks,
- parked/future ideas,
- decisions.

## Current Reality Map

A project-level summary:

- what works,
- what is in progress,
- what is broken,
- what is waiting for decision,
- what is planned,
- what is explicitly out of scope now.

## Next Best Move

The dashboard should eventually show one clear recommendation:

```txt
Najrozumnejší ďalší krok je: ...
```

Examples:

- Review and approve MF-0023 because it blocks export.
- Smoke test MF-0020 because implementation was completed.
- Park this idea because it belongs to Archivist Lite, not V1.

This can start as simple rule-based logic before any AI recommendation.

## Status colors

Recommended UI status language:

- yellow — waiting for decision,
- blue — in development,
- green — tested / verified,
- red — problem / failed,
- grey — parked,
- purple / turquoise — idea / brainstorm.

## Status-first workflow

MindForge should gradually move from text-first to status-first workflow.

A task should clearly expose:

- current state,
- proposed transition,
- next action,
- blocker if any.

Example:

```txt
Status: waiting_for_approval
Recommendation: edit before approval
Reason: task touches frontend and database, but DB change was not requested
Next step: narrow scope or split task
```

## Out of scope for first cockpit iteration

- full multi-project workspace,
- whole `C:\APP DEV` index,
- graph view,
- autonomous recommendations,
- vector memory,
- full Master Agent.

## Relationship to Approval Preview 2.0

Approval Preview 2.0 must be implemented first.

Development Workspace then builds on better task metadata:

- task size,
- risk,
- confidence,
- context receipt,
- recommendation,
- next step.
