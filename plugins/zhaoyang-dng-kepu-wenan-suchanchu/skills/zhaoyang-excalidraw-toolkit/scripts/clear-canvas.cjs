#!/usr/bin/env node
/* eslint-disable no-console */

const DEFAULT_URL = process.env.EXPRESS_SERVER_URL || "http://127.0.0.1:3000";

function usage() {
  console.error("Usage: node scripts/clear-canvas.cjs --force [--url <canvasUrl>]");
  process.exit(2);
}

function parseArgs(argv) {
  const out = { url: DEFAULT_URL, force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--url") out.url = argv[++i];
    else if (a === "--force" || a === "--yes") out.force = true;
    else usage();
  }
  return out;
}

async function confirmClear() {
  if (!process.stdin.isTTY) {
    throw new Error("Refusing to clear canvas without --force in a non-interactive shell.");
  }

  process.stderr.write('This will remove every element from the current canvas. Type "yes" to continue: ');
  const answer = await new Promise((resolve) => {
    process.stdin.setEncoding("utf8");
    process.stdin.once("data", (chunk) => resolve(chunk.trim()));
  });
  if (answer !== "yes") {
    console.error("Cancelled.");
    process.exit(1);
  }
}

async function main() {
  if (typeof fetch !== "function") {
    throw new Error("This script requires Node 18+ (global fetch).");
  }

  const { url, force } = parseArgs(process.argv.slice(2));
  if (!force) await confirmClear();
  const baseUrl = url.replace(/\/$/, "");

  const res = await fetch(`${baseUrl}/api/elements/clear`, {
    method: "DELETE",
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.success !== true) {
    throw new Error(`Failed to clear canvas: ${res.status} ${res.statusText} ${json?.error ? `- ${json.error}` : ""}`);
  }

  console.log(`Cleared canvas (${json.count} elements removed)`);
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
