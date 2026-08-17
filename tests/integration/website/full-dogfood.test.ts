import { expect, it } from "vitest";
import { describeDogfood, runCli } from "../../helpers/cli.js";
import { getFreePort } from "../../helpers/net.js";
import {
  REQUIRED_WEBSITE_ROUTES,
  WEBSITE_DIR,
} from "../../helpers/website/build.js";

const TEST_TIMEOUT_MS = 900_000;

describeDogfood("website full a11yst dogfood", () => {
  it(
    "audits all public routes with default profile and zero avoidable barriers",
    async () => {
      const port = await getFreePort();
      const env = { WEBSITE_PORT: String(port) };

      const routes = await runCli(["routes", "--explain", "--json", "--project", "website"], {
        cwd: WEBSITE_DIR,
        env,
      });
      expect(routes.code).toBe(0);
      const routesPayload = JSON.parse(routes.stdout) as {
        projects?: Array<{
          routes?: Array<{ path: string; origin?: string; source?: string }>;
        }>;
      };
      const configured = routesPayload.projects?.[0]?.routes ?? [];
      expect(configured).toHaveLength(REQUIRED_WEBSITE_ROUTES.length);
      expect(configured.every((route) => route.origin === "explicit")).toBe(true);

      const audit = await runCli(
        [
          "audit",
          "--json",
          "--output",
          ".a11yst/results/dogfood-full",
          "--project",
          "website",
        ],
        { cwd: WEBSITE_DIR, env },
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
