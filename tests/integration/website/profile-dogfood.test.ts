import { expect, it } from "vitest";
import { describeDogfood, runCli } from "../../helpers/cli.js";
import { getFreePort } from "../../helpers/net.js";
import { WEBSITE_DIR } from "../../helpers/website/build.js";

const TEST_TIMEOUT_MS = 1_200_000;

async function auditDocsProfile(profile: string, port: number) {
  return runCli(
    [
      "audit",
      "--json",
      "--output",
      `.a11yst/results/dogfood-docs-${profile}`,
      "--project",
      "website-docs-profiles",
      "--profile",
      profile,
    ],
    {
      cwd: WEBSITE_DIR,
      env: { WEBSITE_PORT: String(port) },
    },
  );
}

describeDogfood("website docs profile dogfood", () => {
  it(
    "audits representative docs routes with reduced-motion profile",
    async () => {
      const port = await getFreePort();
      const audit = await auditDocsProfile("reduced-motion", port);
      expect(audit.code).toBe(0);
      const payload = JSON.parse(audit.stdout) as {
        summary?: { findingCount?: number };
      };
      expect(payload.summary?.findingCount ?? 0).toBe(0);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "completes keyboard profile on representative docs routes",
    async () => {
      const port = await getFreePort();
      const audit = await auditDocsProfile("keyboard", port);
      expect(audit.code).toBe(0);
    },
    TEST_TIMEOUT_MS,
  );
});
