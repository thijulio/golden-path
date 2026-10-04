# 0010 — Smart Library stack exceptions

- **Status:** accepted
- **Date:** 2026-10-04

## Context

Thiago Smart Library is a single-owner product. By tier rules it is light, and the light tier has
no approved database path. The project also needs a remote MCP server that ChatGPT and Claude
can authorize against, and server-rendered public pages with API routes in one Netlify deploy.

## Decision

Smart Library is a single-owner product in the light tier with three approved exceptions:
PostgreSQL on Neon with versioned SQL migrations and no ORM; Nuxt 4 (Vue) instead of the default
React frontend; Better Auth, self-hosted, as identity provider and MCP authorization server.
Reasons: the light tier has no database path; Nuxt provides SSR and a single Netlify deploy unit
for API and MCP; the MCP clients require an OAuth authorization server. The exceptions apply to
Smart Library only and do not change the radar.

## Consequences

- Smart Library follows ADR 0008 for database delivery and ADR 0009 for imports.
- Other light-tier projects still have no database path until a tier decision says otherwise.
- Revisit if a second project needs the same exceptions; that is the signal for a tier change.
