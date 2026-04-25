#!/usr/bin/env node
/* eslint-disable no-console */

import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const stateDir = path.join(process.cwd(), ".zhaoyang-canvas");
const runtimeDir = path.join(stateDir, "runtime");
const pidFile = path.join(stateDir, "canvas.pid");
const logFile = path.join(stateDir, "canvas.log");
const runtimePackage = "mcp-excalidraw-server";
const runtimeVersion = "1.0.6";
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function usage() {
  console.error(
    [
      "Usage:",
      "  zhaoyang-canvas start [--detached] [--host <host>] [--port <port>]",
      "  zhaoyang-canvas stop",
      "  zhaoyang-canvas status [--url <canvasUrl>]",
      "  zhaoyang-canvas docker",
      "",
      "Default canvas URL: http://127.0.0.1:3000",
    ].join("\n"),
  );
  process.exit(2);
}

function parseArgs(argv) {
  const out = {
    command: argv[0] || "status",
    detached: false,
    host: process.env.HOST || "127.0.0.1",
    port: process.env.PORT || "3000",
    url: process.env.EXPRESS_SERVER_URL || "http://127.0.0.1:3000",
  };

  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--detached") out.detached = true;
    else if (arg === "--host") out.host = argv[++i];
    else if (arg === "--port") out.port = argv[++i];
    else if (arg === "--url") out.url = argv[++i];
    else usage();
  }

  return out;
}

function resolveCanvasServer() {
  try {
    const packageJson = require.resolve("mcp-excalidraw-server/package.json");
    const packageRoot = path.dirname(packageJson);
    const serverPath = path.join(packageRoot, "dist", "server.js");
    if (!fs.existsSync(serverPath)) {
      throw new Error(`missing ${serverPath}`);
    }
    return serverPath;
  } catch {
    return resolveCachedCanvasServer();
  }
}

function resolveCachedCanvasServer() {
  const packageJson = path.join(runtimeDir, "node_modules", runtimePackage, "package.json");
  const serverPath = path.join(runtimeDir, "node_modules", runtimePackage, "dist", "server.js");
  if (fs.existsSync(packageJson) && fs.existsSync(serverPath)) {
    return serverPath;
  }

  fs.mkdirSync(runtimeDir, { recursive: true });
  console.log(`Installing ${runtimePackage}@${runtimeVersion} into ${runtimeDir}`);
  const install = spawnSync(
    npmCommand,
    ["install", `${runtimePackage}@${runtimeVersion}`, "--prefix", runtimeDir, "--omit=dev", "--no-audit", "--no-fund"],
    { stdio: "inherit", shell: process.platform === "win32" },
  );
  if (install.error) throw install.error;
  if (install.status !== 0) {
    throw new Error(`npm install failed with exit code ${install.status}`);
  }

  if (!fs.existsSync(serverPath)) {
    throw new Error(`Installed ${runtimePackage}, but ${serverPath} was not found.`);
  }
  return serverPath;
}

function startCanvas({ detached, host, port }) {
  const serverPath = resolveCanvasServer();
  const env = {
    ...process.env,
    HOST: host,
    PORT: String(port),
    EXPRESS_SERVER_URL: `http://${host}:${port}`,
    ENABLE_CANVAS_SYNC: "true",
  };

  if (!detached) {
    console.log(`Starting Excalidraw canvas at http://${host}:${port}`);
    console.log("Press Ctrl+C to stop.");
    const child = spawn(process.execPath, [serverPath], { stdio: "inherit", env });
    child.on("exit", (code, signal) => {
      if (signal) process.kill(process.pid, signal);
      process.exit(code ?? 0);
    });
    return;
  }

  fs.mkdirSync(stateDir, { recursive: true });
  const out = fs.openSync(logFile, "a");
  const child = spawn(process.execPath, [serverPath], {
    detached: true,
    stdio: ["ignore", out, out],
    env,
  });
  fs.writeFileSync(pidFile, `${child.pid}\n`, "utf8");
  child.unref();
  console.log(`Started Excalidraw canvas at http://${host}:${port}`);
  console.log(`PID: ${child.pid}`);
  console.log(`Log: ${logFile}`);
}

function stopCanvas() {
  if (!fs.existsSync(pidFile)) {
    console.log("No detached canvas PID file found.");
    return;
  }

  const pid = Number(fs.readFileSync(pidFile, "utf8").trim());
  if (!Number.isInteger(pid) || pid <= 0) {
    fs.rmSync(pidFile, { force: true });
    throw new Error("Canvas PID file was invalid and has been removed.");
  }

  try {
    process.kill(pid);
    console.log(`Stopped detached canvas process ${pid}.`);
  } catch (error) {
    console.warn(`Could not stop process ${pid}: ${error.message}`);
  } finally {
    fs.rmSync(pidFile, { force: true });
  }
}

async function statusCanvas(url) {
  if (typeof fetch !== "function") {
    throw new Error("Node 18+ is required for status checks.");
  }

  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/health`, { signal: AbortSignal.timeout(3000) });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}: ${text}`);
    }
    console.log(`ok - canvas health ${url}: ${text.trim() || response.status}`);
  } catch (error) {
    console.error(`warn - canvas server is not reachable at ${url}.`);
    console.error(error.message);
    process.exitCode = 1;
  }
}

function dockerCanvas() {
  const rm = spawnSync("docker", ["rm", "-f", "mcp-excalidraw-canvas"], { stdio: "ignore" });
  if (rm.error && rm.error.code === "ENOENT") {
    throw new Error("Docker was not found on PATH.");
  }

  const run = spawnSync(
    "docker",
    [
      "run",
      "-d",
      "-p",
      "3000:3000",
      "--name",
      "mcp-excalidraw-canvas",
      "ghcr.io/yctimlin/mcp_excalidraw-canvas:latest",
    ],
    { stdio: "inherit" },
  );

  if (run.error) throw run.error;
  process.exitCode = run.status ?? 0;
}

const args = parseArgs(process.argv.slice(2));

try {
  if (args.command === "start") startCanvas(args);
  else if (args.command === "stop") stopCanvas();
  else if (args.command === "status") await statusCanvas(args.url);
  else if (args.command === "docker") dockerCanvas();
  else usage();
} catch (error) {
  console.error(error?.stack || String(error));
  process.exit(1);
}
