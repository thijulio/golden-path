# Isolated database delivery

Accepted workflow, 2026-10-02; [ADR 0008](../decisions/0008-isolated-database-delivery.md).
These patterns were exercised in a local SQL foundation; they grant no database/cloud authority
and choose no ORM/provider/tier. Each project keeps its exact operational evidence and versions.

## Target before mutation

Use a synthetic disposable database with loopback binding, exact database/container allowlists,
a marker containing purpose and an instance UUID, and tmpfs storage. Explicit operation credentials
never fall back to diagnostic/runtime URLs. Reject pooled hosts and connection query overrides.
Unknown flags fail before mutation. Require approved empty-target purpose to bootstrap; verify
marker and recorded identity before subsequent cleanup. Validate container labels, image, mounts
and bindings before lifecycle operations. Do not claim a local hostname alone proves disposability.

Empty-target verification must inventory namespace objects across catalogs, including routines,
types/domains and sequences, rather than checking only tables or `pg_class`. Before marker creation
allow no user objects; before first migration allow only the approved environment marker and its
dependent objects. Test rejection both before initialization and after marking but before migration.

Preserve unrelated containers and occupied ports; a bounded alternate loopback port belongs in
project instructions and the handoff. Never use broad Docker prune or destructive schema resets.
Close role pools before dropping only the recorded database. Avoid forced backend termination as
routine cleanup: a pool end may precede socket shutdown, causing an unhandled error. Wait boundedly
for sessions to close and surface a cleanup failure rather than killing unrelated work.

## Migrations and transaction boundaries

Pin immutable SQL bytes and record SHA-256 names/checksums in database history. Validate ordered,
unique sequence prefixes, history gaps, unknown applied names and byte drift before pending SQL.
Hold the session migration lock on one checked-out direct connection. Commit each SQL file and its
history together; rollback failure leaves prior committed migrations intact. Status performs no DDL.
Never migrate on HTTP startup, build or deploy. Do not use destructive down migrations for recovery.

Normal writers and importer transactions share an explicit lock order; imports may use an exclusive
transaction gate, normal writers its shared variant. Then lock parent IDs in numeric order and children.
Versions increment only for changed owning rows. Caller request identity and normalized payload digests
make retries return the original result; a conflicting payload fails. Do not retry an unknown commit
outcome with a new request ID. Keep exact decimal/bigint values as strings across JavaScript boundaries.

## SQL ownership and permission evidence

Separate NOLOGIN groups from provisioned logins; inspect existing role attributes and memberships
before adoption. Runtime roles cannot inherit owner. Revoke PUBLIC database CREATE/TEMPORARY privileges as well as schema CREATE; verify temporary-object denial from the runtime login. Set default privileges for the actual creating
role, revoke PUBLIC routine execution, and grant named tables/functions/sequences only.
SECURITY DEFINER routines need owner-only ownership, fixed `pg_catalog, pg_temp` search paths,
schema-qualified references, fixed writable key allowlists and server-derived actor identity.
A deferred constraint trigger may run after a definer routine returns; its privilege context must
be tested from the actual runtime login at COMMIT. No broad editor table grants as a workaround.

Use explicit NULL branches in conditional CHECKs. Unconstrained numeric plus range/scale/finite
checks rejects extra precision; `numeric(p,s)` can round before CHECK. Foreign keys need concrete
referencing-side indexes. Privacy includes default grants on future functions and new columns.
A database-specific JSON hash domain needs one shared SQL hash helper for mutation and verification;
do not assume its text encoding equals a JavaScript serializer. Full URL parsing belongs at the
trusted server adapter; SQL scheme checks are defense in depth, with no network fetching.

## Required executable evidence and handoff

Use real PostgreSQL and distinct role connections for transaction/constraint/privilege/optimistic
concurrency tests. Exercise repeat migration, changed checksum, invalid SQL rollback, concurrent
runners, connection loss, forbidden base-table reads/writes, role escalation, malicious payload keys,
default function execution and independent aggregate versions. Missing server/marker fails the suite;
no passing-by-skip. Keep fixtures synthetic; no private snapshots or credentials in logs/artifacts.

Record exact server versions and immutable image digests, migration names/checksums, role matrix,
commands/results, bundle-boundary evidence, cleanup and remaining gates. A CI matrix is configuration
until it has run; local execution on the same majors is separate evidence. SQL and permissions need
independent review: an author inspection cannot accept its own change. Keep implemented-local,
reviewed, merged, deployed, imported and cutover states distinct.
