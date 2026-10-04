import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { adrs } from "../apps/site/src/app/data/adrs.ts";
test("database safety proposal metadata matches the documentation-site mirror", async () => {
  const text = await readFile(
    new URL("../decisions/0008-isolated-database-delivery.md", import.meta.url),
    "utf8",
  );
  const title = text.split("\n")[0].replace(/^# 0008 — /, "");
  const status = text.match(/\*\*Status:\*\* (.+)/)?.[1];
  const date = text.match(/\*\*Date:\*\* (.+)/)?.[1];
  assert.deepEqual(
    adrs.find((x) => x.id === "0008") &&
      (({ title, status, date }) => ({ title, status, date }))(
        adrs.find((x) => x.id === "0008"),
      ),
    { title, status, date },
  );
  assert.equal(status, "accepted");
});
test("reusable workflow keeps required target, migration and privilege evidence", async () => {
  const text = await readFile(
    new URL("../workflows/isolated-database-delivery.md", import.meta.url),
    "utf8",
  );
  for (const required of [
    "instance UUID",
    "SHA-256",
    "SECURITY DEFINER",
    "independent review",
    "connection loss",
    "tmpfs",
  ])
    assert.ok(text.includes(required), required);
});
