#!/usr/bin/env node
/**
 * Website release gate — deterministic, non-interactive checks.
 *
 * Usage:
 *   node scripts/website-gate.mjs          # clean site/, build twice, unit tests
 *   node scripts/website-gate.mjs --full     # fast gate + browser/dogfood integration
 */
import { rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = join(repoRoot, "site");
const full = process.argv.includes("--full");

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    env: process.env,
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function removeSite() {
  rmSync(siteDir, { recursive: true, force: true });
}

function step(label, fn) {
  console.log(`\n==> ${label}`);
  fn();
}

step("remove stale site/", () => {
  removeSite();
});

step("website strict build", () => {
  run("pnpm", ["build"]);
});

step("remove site/ and rebuild", () => {
  removeSite();
  run("pnpm", ["build"]);
});

step("website static unit tests", () => {
  run("pnpm", ["test"]);
});

if (full) {
  step("website integration tests (browser, dogfood, smoke)", () => {
    run("pnpm", ["test:browser"]);
  });
}

console.log("\n==> website gate passed");
