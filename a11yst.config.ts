// Loaded by a local a11yst CLI via A11YST_BIN. The CLI inlines defineConfig;
// this repository does not depend on @a11yst/config or @a11yst/cli.
import { defineConfig } from "@a11yst/config";

const port = process.env.WEBSITE_PORT ?? "8000";
const origin = `http://127.0.0.1:${port}`;

const publicRoutes = [
  "/",
  "/getting-started/",
  "/core-concepts/",
  "/core-concepts/route-discovery-and-planning/",
  "/regression-testing/",
  "/regression-testing/baselines/",
  "/regression-testing/classifications/",
  "/regression-testing/updating-baseline/",
  "/regression-testing/policies/",
  "/regression-testing/ci-workflow/",
  "/reports/",
  "/source-intelligence/",
  "/source-intelligence/source-mapping/",
  "/source-intelligence/recommendations/",
  "/source-intelligence/limitations/",
  "/frameworks/",
  "/frameworks/html/",
  "/frameworks/react/",
  "/frameworks/next/",
  "/frameworks/vue/",
  "/frameworks/nuxt/",
  "/frameworks/angular/",
  "/ci/",
  "/reference/",
  "/reference/cli/",
  "/reference/configuration/",
  "/reference/environment-variables/",
  "/reference/exit-codes/",
  "/reference/result-model/",
  "/troubleshooting/",
  "/community/",
  "/community/contributing/",
  "/community/license/",
];

const profileDogfoodRoutes = [
  "/getting-started/",
  "/core-concepts/",
  "/reports/",
  "/frameworks/react/",
  "/ci/",
  "/reference/configuration/",
  "/community/",
];

const devServer = {
  command: "node scripts/ensure-venv.mjs && node scripts/serve.mjs",
  url: origin,
  reuseExisting: true,
  startupTimeout: 60_000,
};

const desktopViewport = {
  name: "desktop",
  width: 1440,
  height: 900,
};

const readiness = {
  waitUntil: "load",
  settleFrames: 10,
};

export default defineConfig({
  projects: [
    {
      name: "website",
      rootDir: ".",
      platform: "web",
      framework: "html",
      baseUrl: origin,
      devServer,
      routes: publicRoutes,
      routeDiscovery: {
        mode: "off",
      },
      profiles: ["default"],
      readiness,
      viewports: [desktopViewport],
    },
    {
      name: "website-home",
      rootDir: ".",
      platform: "web",
      framework: "html",
      baseUrl: origin,
      devServer,
      routes: ["/"],
      routeDiscovery: {
        mode: "off",
      },
      profiles: ["default", "keyboard", "large-text", "reduced-motion"],
      profileOptions: [
        { id: "default" },
        { id: "keyboard", maxTabStops: 200, detectFocusTraps: true, captureFocusEvidence: true },
        { id: "large-text", textScale: 2, detectHorizontalOverflow: true, compareWithDefault: true, overlapTolerancePx: 8 },
        { id: "reduced-motion", emulatePreference: true, inspectAnimations: true, minimumSignificantDurationMs: 300, compareWithDefault: true },
      ],
      readiness,
      viewports: [desktopViewport],
    },
    {
      name: "website-docs-profiles",
      rootDir: ".",
      platform: "web",
      framework: "html",
      baseUrl: origin,
      devServer,
      routes: profileDogfoodRoutes,
      routeDiscovery: {
        mode: "off",
      },
      profiles: ["keyboard", "large-text", "reduced-motion"],
      profileOptions: [
        { id: "keyboard", maxTabStops: 200, detectFocusTraps: true, captureFocusEvidence: true },
        { id: "large-text", textScale: 2, detectHorizontalOverflow: true, compareWithDefault: true, overlapTolerancePx: 8 },
        { id: "reduced-motion", emulatePreference: true, inspectAnimations: true, minimumSignificantDurationMs: 300, compareWithDefault: true },
      ],
      readiness,
      viewports: [desktopViewport],
    },
  ],
});
