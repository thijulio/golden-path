# Lossless incremental import

Accepted workflow, 2026-10-02; [ADR 0009](../decisions/0009-lossless-incremental-import.md).
Demonstrated through synthetic local PostgreSQL tests; no source/provider or production authority.

## Extraction and provenance

Keep original bytes, exact SHA-256, typed cell values, formulas/cache, workbook date system,
formats, headers, blanks and row coordinates. Row coordinates locate evidence within one
snapshot; stable source IDs identify entities. Map exact unique header names, accepting reordering.
Unknown input remains evidence and receives a disposition; no inferred database columns.

Extraction has no database or network dependency. Use bounded source/row/column/cell sizes,
regular files and private new output directories. Never overwrite a different snapshot or chmod
existing user files. Verify source and row hashes and strict manifest shape before staging.
Capture explicit source freshness and an attestor; extraction time/file mtime is not freshness.
Synthetic fixtures belong in Git; real input and detailed reports stay private and outside Git.

Use a versioned deterministic JSON serializer for source/config/merge hashes. Preserve raw Unicode,
prose, exact decimals, bigint strings and array order. Normalize only lookup keys; aliases need a
reviewed version. Use a separate SQL JSON hash domain for database provenance and expected-hash
resolutions. Mutation and verification must invoke the same SQL helper.

## Replay and three-way reconciliation

Record the last accepted source value per entity and field/group, independently of current
canonical data. Compare baseline, incoming and current: unchanged source preserves native edits;
source-only changes apply; converged values adopt a baseline without version churn; two-sided
changes conflict. Blank/absent/invalid input preserves canonical values and baseline.

Group completion bounds/precision/raw cells, community ratings/count/source/date, series/volume,
ordered authors and genre sets atomically. Do not replace accepted assessments without an explicit
reviewed decision; accepted replacement resets review. Clearing requires a strict resolution with
source digest, entity/group, current SQL hash/version, reviewer/time and a permitted action.
Validate expectations again under lock; a stale review blocks application.

Run identity includes source key/hash, transform, scope and reviewed configuration digest. A later
scope must not collide with core replay. Exact replay returns the original stored outcome without
re-evaluating newer native edits; a changed resolution is a new run, never a rewritten old result.
Older sources and equal-time different bytes fail closed. Absence does not imply archive/deletion.

## Audit and transaction safety

Dry-run uses a read-only repeatable-read transaction and writes only a new private report.
Commit raw staging first. Canonical apply recomputes under an exclusive writer gate, locks parents
in numeric order, and commits canonical values, owning-row versions, accepted baselines, SQL
provenance, applied outcome and source head together. Grant only necessary join-row replacement;
parent deletion, DDL, TRUNCATE, owner escalation and public reads remain denied.

Rollback keeps staged evidence; record failure in a separate transaction and surface audit-write
failure. Retry only known serialization/deadlock failures with bounded attempts. Never invent a
new identity after an unknown commit outcome. Recheck the recorded run before classification.

Verification covers source identity, accounted rows, required authors, relationships, provenance,
baseline-to-applied-run consistency and denied public grants. Canonical digests exclude sequence
counters because PostgreSQL sequences can advance on rollback.

## Evidence and handoff

Require two clean disposable database runs of replay, concurrent replay, additions, title changes,
native conflicts, explicit clears, stale source/review, rollback, disappearance, collisions,
atomic groups, scoped identity and snapshot tampering. Include accepted-assessment and read-only
regressions, distinct runtime grants, full quality and built UI/routing checks.

Record exact commit/worktree identities, server/image versions, commands/results, cleanup and
remaining gates. Author inspection prepares the merge-policy package; independent review accepts
it. Preserve separate implemented-local, reviewed, merged, published and cutover states.

## Reviewed source observations

A reviewed keep-database or clear decision must acknowledge the valid incoming source value
in its baseline, while preserving or clearing the canonical destination separately. Storing the
retained native value as the source baseline lets a later unchanged export undo the review.
Test both decisions through a later different-byte snapshot with unchanged field content.
Blank/invalid input does not advance an ordinary keep-database baseline.

Require snapshot-hash-bound reviewed policy for source-specific sentinel vocabularies and
cached formula values. Record exact cell locators, reviewer and time in configuration/audit;
unknown labels remain quarantined until reviewed. Never infer a source vocabulary from an
unavailable private workbook. Preserve the original date serial with the date-system flag;
reject the fictional 1900 leap day and quarantine missing serial evidence.
