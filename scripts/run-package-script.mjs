import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

const packageOrder = ["packages/shared", "apps/api", "apps/mobile"];

function readPackageJson(packagePath) {
  const fullPath = path.join(rootDir, packagePath, "package.json");
  return JSON.parse(readFileSync(fullPath, "utf8"));
}

function pathWithBins(packagePath) {
  const delimiter = process.platform === "win32" ? ";" : ":";
  const bins = [
    path.join(rootDir, packagePath, "node_modules", ".bin"),
    path.join(rootDir, "node_modules", ".bin")
  ];

  return [...bins, process.env.PATH ?? ""].join(delimiter);
}

function runOne(packagePath, scriptName) {
  const packageJson = readPackageJson(packagePath);
  const script = packageJson.scripts?.[scriptName];

  if (!script) {
    return;
  }

  const cwd = path.join(rootDir, packagePath);
  const localBin = path.join(cwd, "node_modules", ".bin");
  if (!existsSync(localBin)) {
    console.warn(`Missing node_modules for ${packageJson.name}. Run corepack pnpm install first.`);
  }

  console.log(`\n> ${packageJson.name} ${scriptName}`);
  const result = spawnSync(script, {
    cwd,
    env: {
      ...process.env,
      PATH: pathWithBins(packagePath)
    },
    shell: true,
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (args.length === 2) {
  runOne(args[0], args[1]);
} else if (args.length === 1) {
  for (const packagePath of packageOrder) {
    runOne(packagePath, args[0]);
  }
} else {
  console.error("Usage: node scripts/run-package-script.mjs [script] OR [packagePath] [script]");
  process.exit(1);
}

