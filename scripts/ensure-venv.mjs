import { access } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const websiteDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const venvDir = join(websiteDir, ".venv");
const venvPython = join(venvDir, "bin", "python");
const venvPip = join(venvDir, "bin", "pip");
const requirements = join(websiteDir, "requirements.txt");

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(venvPython))) {
  execFileSync("python3", ["-m", "venv", venvDir], {
    cwd: websiteDir,
    stdio: "inherit",
  });
}

execFileSync(venvPip, ["install", "-r", requirements], {
  cwd: websiteDir,
  stdio: "inherit",
});
