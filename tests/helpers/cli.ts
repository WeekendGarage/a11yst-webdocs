import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { describe } from "vitest";

export interface CliResult {
  code: number | null;
  stdout: string;
  stderr: string;
}

export function getA11ystBin(): string | undefined {
  const value = process.env.A11YST_BIN?.trim();
  return value ? value : undefined;
}

export function isDogfoodEnabled(): boolean {
  return Boolean(getA11ystBin());
}

/** Sequential dogfood suite when a local CLI is provided; skipped otherwise. */
export const describeDogfood = isDogfoodEnabled() ? describe.sequential : describe.skip;

function resolveBin(bin: string): string {
  if (bin.includes("/") || bin.includes("\\")) {
    return resolve(bin);
  }
  return bin;
}

function spawnInvocation(bin: string, args: string[]): { command: string; argv: string[] } {
  const resolved = resolveBin(bin);
  if (
    resolved.endsWith(".js") ||
    resolved.endsWith(".mjs") ||
    resolved.endsWith(".cjs") ||
    resolved.endsWith(".ts")
  ) {
    return { command: process.execPath, argv: [resolved, ...args] };
  }
  return { command: resolved, argv: args };
}

/**
 * Run a local a11yst CLI. Requires `A11YST_BIN` (executable or JS entry).
 * This website repo does not ship `@a11yst/cli`.
 */
export async function runCli(
  args: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv } = {},
): Promise<CliResult> {
  const bin = getA11ystBin();
  if (!bin) {
    throw new Error("A11YST_BIN is not set. Dogfood tests require a local a11yst CLI.");
  }

  const { command, argv } = spawnInvocation(bin, args);

  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, argv, {
      cwd: options.cwd,
      env: {
        ...process.env,
        NO_COLOR: "1",
        ...options.env,
      },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", reject);
    child.on("close", (code) => {
      resolvePromise({ code, stdout, stderr });
    });
  });
}
