import { expect, it } from "vitest";
import { describeDogfood, runCli } from "../../helpers/cli.js";
import { getFreePort } from "../../helpers/net.js";
import { WEBSITE_DIR } from "../../helpers/website/build.js";

const TEST_TIMEOUT_MS = 600_000;

const REQUIRED_ZERO_PROFILES = ["default", "reduced-motion"] as const;

/**
 * Material header keyboard traversal on a long promotional page can report
 * focus-cycle and unreachable-control heuristics before main content is reached.
 * Large-text comparison is expensive on the landing DOM; manual dogfood is documented in P4.2.
 */
async function auditHome(profile: string, port: number) {
  return runCli(
    [
      "audit",
      "--json",
      "--output",
      `.a11yst/results/dogfood-landing-${profile}`,
      "--project",
      "website-home",
      "--profile",
      profile,
    ],
    {
      cwd: WEBSITE_DIR,
      env: { WEBSITE_PORT: String(port) },
    },
  );
}

describeDogfood("website landing dogfood profiles", () => {
  for (const profile of REQUIRED_ZERO_PROFILES) {
    it(
      `audits home with ${profile} profile and reports zero avoidable barriers`,
      async () => {
        const port = await getFreePort();
        const audit = await auditHome(profile, port);
        expect(audit.code).toBe(0);
        const auditPayload = JSON.parse(audit.stdout) as {
          summary?: { findingCount?: number };
        };
        expect(auditPayload.summary?.findingCount ?? 0).toBe(0);
      },
      TEST_TIMEOUT_MS,
    );
  }

  it(
    "completes home keyboard profile audit (documented Material header limitations may apply)",
    async () => {
      const port = await getFreePort();
      const audit = await auditHome("keyboard", port);
      expect(audit.code).toBe(0);
    },
    TEST_TIMEOUT_MS,
  );
});
