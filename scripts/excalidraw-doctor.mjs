#!/usr/bin/env node

import fs from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const canvasUrl = process.env.EXPRESS_SERVER_URL || "http://127.0.0.1:3000";
const pluginDir = path.join(root, "plugins", "zhaoyang-dng-kepu-wenan-suchanchu");
const mcpPath = path.join(pluginDir, ".mcp.json");
const cachedRuntimePackage = path.join(process.cwd(), ".zhaoyang-canvas", "runtime", "node_modules", "mcp-excalidraw-server", "package.json");

function ok(message) {
  console.log(`ok - ${message}`);
}

function warn(message) {
  console.warn(`warn - ${message}`);
}

function checkCommand(command, args = ["--version"]) {
  try {
    const quotedArgs = args.map((arg) => JSON.stringify(arg)).join(" ");
    const output = execSync(`${command} ${quotedArgs}`, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return output.trim().split(/\r?\n/)[0];
  } catch {
    return null;
  }
}

const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor >= 18) {
  ok(`Node ${process.version}`);
} else {
  warn(`Node ${process.version}; Node 18+ is recommended for canvas helper scripts.`);
}

const npmVersion = checkCommand("npm");
if (npmVersion) ok(npmVersion);
else warn("npm was not found on PATH.");

const dockerVersion = checkCommand("docker");
if (dockerVersion) {
  ok(dockerVersion);
  const dockerInfo = checkCommand("docker", ["info"]);
  if (dockerInfo) ok("Docker daemon is reachable.");
  else warn("Docker is installed but the daemon is not reachable. Docker is optional for this package.");
} else {
  warn("Docker was not found on PATH. Docker is optional; the default MCP path uses npm/npx.");
}

try {
  const mcpPackage = require.resolve("mcp-excalidraw-server/package.json");
  ok(`mcp-excalidraw-server package: ${mcpPackage}`);
} catch {
  if (fs.existsSync(cachedRuntimePackage)) {
    ok(`mcp-excalidraw-server cached runtime: ${cachedRuntimePackage}`);
  } else {
    warn("mcp-excalidraw-server runtime is not cached yet. zhaoyang-canvas start will install it on first use.");
  }
}

if (fs.existsSync(mcpPath)) {
  const mcpJson = JSON.parse(fs.readFileSync(mcpPath, "utf8"));
  if (mcpJson.mcpServers?.excalidraw) {
    ok("plugin .mcp.json contains an excalidraw server.");
    if (mcpJson.mcpServers.excalidraw.command === "docker") {
      warn("plugin .mcp.json uses Docker. The recommended default is npx mcp-excalidraw-server.");
    }
  }
  else warn("plugin .mcp.json exists but does not contain mcpServers.excalidraw.");
} else {
  warn("plugin .mcp.json is missing.");
}

if (typeof fetch !== "function") {
  warn("global fetch is unavailable; skip canvas health check.");
  process.exit(0);
}

try {
  const response = await fetch(`${canvasUrl.replace(/\/$/, "")}/health`, { signal: AbortSignal.timeout(3000) });
  const text = await response.text();
  if (response.ok) {
    ok(`canvas health ${canvasUrl}: ${text.trim() || response.status}`);
  } else {
    warn(`canvas health ${canvasUrl}: HTTP ${response.status} ${response.statusText}`);
  }
} catch {
  warn(`canvas server is not reachable at ${canvasUrl}. Start it before using live Excalidraw workflows.`);
}
