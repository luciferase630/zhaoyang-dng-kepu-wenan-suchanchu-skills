#!/usr/bin/env node
/* eslint-disable no-console */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonicalSkillsDir = path.join(root, "plugins", "zhaoyang-dng-kepu-wenan-suchanchu", "skills");
const home = os.homedir();

const targets = {
  claude: path.join(home, ".claude", "skills"),
  kimi: path.join(home, ".kimi", "skills"),
  generic: path.join(home, ".config", "agents", "skills"),
  codex: path.join(process.env.CODEX_HOME || path.join(home, ".codex"), "skills"),
};

function usage() {
  console.error(
    [
      "Usage:",
      "  zhaoyang-install-skills [claude|kimi|generic|codex|all] [--force]",
      "",
      "Examples:",
      "  zhaoyang-install-skills claude",
      "  zhaoyang-install-skills kimi --force",
      "  zhaoyang-install-skills all --force",
    ].join("\n"),
  );
  process.exit(2);
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const target = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(source, target);
    else if (entry.isFile()) fs.copyFileSync(source, target);
  }
}

const argv = process.argv.slice(2);
const targetName = argv.find((arg) => !arg.startsWith("-")) || "all";
const force = argv.includes("--force");
if (![...Object.keys(targets), "all"].includes(targetName)) usage();

const selected = targetName === "all" ? Object.entries(targets) : [[targetName, targets[targetName]]];
const skillNames = fs.readdirSync(canonicalSkillsDir).filter((name) => {
  return fs.statSync(path.join(canonicalSkillsDir, name)).isDirectory();
});

for (const [name, targetRoot] of selected) {
  fs.mkdirSync(targetRoot, { recursive: true });
  for (const skillName of skillNames) {
    const source = path.join(canonicalSkillsDir, skillName);
    const target = path.join(targetRoot, skillName);
    if (fs.existsSync(target)) {
      if (!force) {
        console.log(`skip - ${name}: ${skillName} already exists (${target})`);
        continue;
      }
      fs.rmSync(target, { recursive: true, force: true });
    }
    copyDir(source, target);
    console.log(`installed - ${name}: ${skillName} -> ${target}`);
  }
}

console.log("Restart the target coding agent to pick up new skills.");
