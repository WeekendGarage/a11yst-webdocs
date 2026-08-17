import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import { access, readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getFreePort } from "../net.js";

export function getRepoRoot(): string {
  return resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
}

export const WEBSITE_DIR = getRepoRoot();
export const WEBSITE_DIST = join(WEBSITE_DIR, "site");

export const REQUIRED_WEBSITE_ROUTES = [
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
] as const;

export const WEBSITE_SMOKE_PATHS = [
  "/",
  "/getting-started/",
  "/core-concepts/",
  "/regression-testing/policies/",
  "/reports/",
  "/ci/",
  "/frameworks/react/",
  "/source-intelligence/source-mapping/",
  "/reference/cli/",
  "/reference/configuration/",
  "/reference/exit-codes/",
  "/troubleshooting/",
  "/community/",
] as const;

export type WebsiteRouteFamily =
  | "HOME"
  | "GETTING_STARTED"
  | "CORE_CONCEPTS"
  | "REGRESSION"
  | "REPORTS"
  | "SOURCE_INTELLIGENCE"
  | "FRAMEWORKS"
  | "CI"
  | "REFERENCE"
  | "COMMUNITY"
  | "TROUBLESHOOTING";

export const PROFILE_DOGFOOD_ROUTES = [
  "/getting-started/",
  "/core-concepts/",
  "/reports/",
  "/frameworks/react/",
  "/ci/",
  "/reference/configuration/",
  "/community/",
] as const;

export function classifyWebsiteRoute(route: string): WebsiteRouteFamily {
  if (route === "/") return "HOME";
  if (route.startsWith("/getting-started/")) return "GETTING_STARTED";
  if (route.startsWith("/core-concepts/")) return "CORE_CONCEPTS";
  if (route.startsWith("/regression-testing/")) return "REGRESSION";
  if (route.startsWith("/reports/")) return "REPORTS";
  if (route.startsWith("/source-intelligence/")) return "SOURCE_INTELLIGENCE";
  if (route.startsWith("/frameworks/")) return "FRAMEWORKS";
  if (route.startsWith("/ci/")) return "CI";
  if (route.startsWith("/reference/")) return "REFERENCE";
  if (route.startsWith("/community/")) return "COMMUNITY";
  if (route.startsWith("/troubleshooting/")) return "TROUBLESHOOTING";
  throw new Error(`Unknown website route family for ${route}`);
}

export async function countRoutesByFamily(): Promise<Record<WebsiteRouteFamily, number>> {
  const files = await listBuiltHtmlFiles();
  const routes = files.map(routePathFromHtmlFile);
  const counts: Record<WebsiteRouteFamily, number> = {
    HOME: 0,
    GETTING_STARTED: 0,
    CORE_CONCEPTS: 0,
    REGRESSION: 0,
    REPORTS: 0,
    SOURCE_INTELLIGENCE: 0,
    FRAMEWORKS: 0,
    CI: 0,
    REFERENCE: 0,
    COMMUNITY: 0,
    TROUBLESHOOTING: 0,
  };
  for (const route of routes) {
    counts[classifyWebsiteRoute(route)] += 1;
  }
  return counts;
}

export const RESPONSIVE_WIDTHS = [320, 375, 768, 1024, 1280, 1440, 1920] as const;

export const KEY_SEO_PAGES = [
  "/",
  "/getting-started/",
  "/core-concepts/",
  "/regression-testing/",
  "/reports/",
  "/frameworks/",
  "/ci/",
  "/source-intelligence/",
  "/reference/",
  "/community/",
] as const;

export const PERFORMANCE_BUDGETS = {
  customHomeJsBytes: 32_000,
  customHomeCssBytes: 48_000,
  customA11yFixesJsBytes: 2_500,
  searchIndexBytes: 120_000,
  homeHtmlBytes: 48_000,
  largestDocsHtmlBytes: 56_000,
} as const;

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(1000) });
      if (response.status >= 100 && response.status < 600) {
        return;
      }
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}

export async function ensureWebsiteBuilt(): Promise<void> {
  try {
    await access(join(WEBSITE_DIST, "index.html"));
  } catch {
    execFileSync("pnpm", ["build"], {
      cwd: WEBSITE_DIR,
      stdio: "inherit",
      env: process.env,
    });
  }
}

export async function listBuiltHtmlFiles(): Promise<string[]> {
  const files: string[] = [];
  async function walk(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.name === "index.html") {
        files.push(fullPath);
      }
    }
  }
  await walk(WEBSITE_DIST);
  return files.sort();
}

export function routePathFromHtmlFile(htmlFile: string): string {
  const relative = htmlFile.slice(WEBSITE_DIST.length).replace(/\\/g, "/");
  if (relative === "/index.html") {
    return "/";
  }
  return relative.replace(/\/index\.html$/, "/");
}

export async function collectInternalLinks(htmlFile: string): Promise<string[]> {
  const html = await readFile(htmlFile, "utf8");
  const hrefs = [...html.matchAll(/\shref="([^"]+)"/g)].map((match) => match[1] ?? "");
  return hrefs.filter(
    (href) =>
      href.startsWith("/") &&
      !href.startsWith("//") &&
      !href.includes("#") &&
      !href.endsWith(".css") &&
      !href.endsWith(".svg") &&
      !href.endsWith(".png") &&
      !href.endsWith(".js") &&
      !href.endsWith(".json") &&
      !href.endsWith(".woff2"),
  );
}

export async function resolveBuiltRoute(pathname: string): Promise<string | undefined> {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const candidates = [
    join(WEBSITE_DIST, normalized, "index.html"),
    join(WEBSITE_DIST, normalized.slice(1), "index.html"),
    join(WEBSITE_DIST, pathname.replace(/^\//, ""), "index.html"),
  ];
  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) {
        return candidate;
      }
    } catch {
      // continue
    }
  }
  return undefined;
}

export interface WebsitePreviewServer {
  port: number;
  url: string;
}

export async function startWebsitePreview(
  timeoutMs = 60_000,
): Promise<{ server: WebsitePreviewServer; stop: () => Promise<void> }> {
  await ensureWebsiteBuilt();
  const port = await getFreePort();
  const url = `http://127.0.0.1:${port}`;
  const mkdocs = join(WEBSITE_DIR, ".venv", "bin", "mkdocs");

  execFileSync("node", ["scripts/ensure-venv.mjs"], {
    cwd: WEBSITE_DIR,
    stdio: "inherit",
    env: process.env,
  });

  const child: ChildProcess = spawn(
    mkdocs,
    ["serve", "--dev-addr", `127.0.0.1:${port}`],
    {
      cwd: WEBSITE_DIR,
      env: { ...process.env, WEBSITE_PORT: String(port) },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  try {
    await waitForServer(url, timeoutMs);
  } catch (error) {
    child.kill("SIGTERM");
    throw error;
  }

  return {
    server: { port, url },
    stop: async () => {
      await new Promise<void>((resolve) => {
        child.once("exit", () => resolve());
        child.kill("SIGTERM");
        setTimeout(() => child.kill("SIGKILL"), 5000);
      });
    },
  };
}
