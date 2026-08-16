---
title: Core concepts
description: Projects, routes, viewports, profiles, flows, findings, evidence, and artifacts in a11yst.
---


a11yst models accessibility work as structured projects and auditable runs.

## Projects

A project describes where your application lives, which framework adapter to use, how routes are discovered, and which profiles and viewports apply.

## Routes

Routes are the pages or URLs audited in a run. They can be listed explicitly or discovered from supported frameworks and HTML entry files.

See [Route discovery and planning](route-discovery-and-planning.md) for explicit routes, discovery modes, framework adapters, fallback, audit planning, and `a11yst routes --explain`.

## Viewports

Viewports define width and height for browser audits. Use them to catch responsive layout and visibility issues.

## Profiles

Profiles apply additional a11yst-owned checks beyond baseline page scans—for example keyboard interaction or large-text conditions.

## Flows

Flows describe multi-step interactions with checkpoints. They help audit states that only appear after user action.

## Interactive states

Checkpoints capture DOM state after actions such as opening a dialog or expanding a menu.

## Findings

Findings describe accessibility issues with severity, message, and optional remediation guidance.

## Evidence

Evidence may include selectors, snapshots, or other artifacts that support a finding.

## Artifacts

Audit runs write structured JSON, reports, and evidence under your configured output directory for review and CI consumption.
