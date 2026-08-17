import { expect, it } from "vitest";
import { describeDogfood, runCli } from "../../helpers/cli.js";
import { getFreePort } from "../../helpers/net.js";
import { WEBSITE_DIR } from "../../helpers/website/build.js";

const TEST_TIMEOUT_MS = 600_000;

describeDogfood("website a11yst dogfood", () => {
  it(
    "detects html, explains routes, and completes an audit against the preview server",
    async () => {
      const port = await getFreePort();
      const env = { WEBSITE_PORT: String(port) };

      const detect = await runCli(["detect", "--json"], {
        cwd: WEBSITE_DIR,
        env,
      });
      expect(detect.code).toBe(0);
      const detectPayload = JSON.parse(detect.stdout) as {
        project?: { framework?: { framework?: string } };
      };
      expect(detectPayload.project?.framework?.framework).toBe("html");

      const routes = await runCli(["routes", "--explain", "--json"], {
        cwd: WEBSITE_DIR,
        env,
      });
      expect(routes.code).toBe(0);
      const routesPayload = JSON.parse(routes.stdout) as {
        projects?: Array<{
          routes?: Array<{ path: string }>;
        }>;
      };
      const routesProject = routesPayload.projects?.[0];
      expect(routesProject?.routes?.length ?? 0).toBeGreaterThanOrEqual(10);

      const audit = await runCli(
        ["audit", "--json", "--output", ".a11yst/results/dogfood", "--project", "website"],
        {
          cwd: WEBSITE_DIR,
          env,
        },
      );
      expect(audit.code).toBe(0);
      const auditPayload = JSON.parse(audit.stdout) as {
        summary?: { findingCount?: number };
      };
      expect(auditPayload.summary?.findingCount ?? 0).toBe(0);
    },
    TEST_TIMEOUT_MS,
  );
});
