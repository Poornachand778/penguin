import { describe, expect, it } from "vitest";

import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it("detects help/version flags", () => {
    expect(hasHelpOrVersion(["node", "penguin", "--help"])).toBe(true);
    expect(hasHelpOrVersion(["node", "penguin", "-V"])).toBe(true);
    expect(hasHelpOrVersion(["node", "penguin", "status"])).toBe(false);
  });

  it("extracts command path ignoring flags and terminator", () => {
    expect(getCommandPath(["node", "penguin", "status", "--json"], 2)).toEqual(["status"]);
    expect(getCommandPath(["node", "penguin", "agents", "list"], 2)).toEqual(["agents", "list"]);
    expect(getCommandPath(["node", "penguin", "status", "--", "ignored"], 2)).toEqual(["status"]);
  });

  it("returns primary command", () => {
    expect(getPrimaryCommand(["node", "penguin", "agents", "list"])).toBe("agents");
    expect(getPrimaryCommand(["node", "penguin"])).toBeNull();
  });

  it("parses boolean flags and ignores terminator", () => {
    expect(hasFlag(["node", "penguin", "status", "--json"], "--json")).toBe(true);
    expect(hasFlag(["node", "penguin", "--", "--json"], "--json")).toBe(false);
  });

  it("extracts flag values with equals and missing values", () => {
    expect(getFlagValue(["node", "penguin", "status", "--timeout", "5000"], "--timeout")).toBe(
      "5000",
    );
    expect(getFlagValue(["node", "penguin", "status", "--timeout=2500"], "--timeout")).toBe(
      "2500",
    );
    expect(getFlagValue(["node", "penguin", "status", "--timeout"], "--timeout")).toBeNull();
    expect(getFlagValue(["node", "penguin", "status", "--timeout", "--json"], "--timeout")).toBe(
      null,
    );
    expect(getFlagValue(["node", "penguin", "--", "--timeout=99"], "--timeout")).toBeUndefined();
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "penguin", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "penguin", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "penguin", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it("parses positive integer flag values", () => {
    expect(getPositiveIntFlagValue(["node", "penguin", "status"], "--timeout")).toBeUndefined();
    expect(
      getPositiveIntFlagValue(["node", "penguin", "status", "--timeout"], "--timeout"),
    ).toBeNull();
    expect(
      getPositiveIntFlagValue(["node", "penguin", "status", "--timeout", "5000"], "--timeout"),
    ).toBe(5000);
    expect(
      getPositiveIntFlagValue(["node", "penguin", "status", "--timeout", "nope"], "--timeout"),
    ).toBeUndefined();
  });

  it("builds parse argv from raw args", () => {
    const nodeArgv = buildParseArgv({
      programName: "penguin",
      rawArgs: ["node", "penguin", "status"],
    });
    expect(nodeArgv).toEqual(["node", "penguin", "status"]);

    const versionedNodeArgv = buildParseArgv({
      programName: "penguin",
      rawArgs: ["node-22", "penguin", "status"],
    });
    expect(versionedNodeArgv).toEqual(["node-22", "penguin", "status"]);

    const versionedNodeWindowsArgv = buildParseArgv({
      programName: "penguin",
      rawArgs: ["node-22.2.0.exe", "penguin", "status"],
    });
    expect(versionedNodeWindowsArgv).toEqual(["node-22.2.0.exe", "penguin", "status"]);

    const versionedNodePatchlessArgv = buildParseArgv({
      programName: "penguin",
      rawArgs: ["node-22.2", "penguin", "status"],
    });
    expect(versionedNodePatchlessArgv).toEqual(["node-22.2", "penguin", "status"]);

    const versionedNodeWindowsPatchlessArgv = buildParseArgv({
      programName: "penguin",
      rawArgs: ["node-22.2.exe", "penguin", "status"],
    });
    expect(versionedNodeWindowsPatchlessArgv).toEqual(["node-22.2.exe", "penguin", "status"]);

    const versionedNodeWithPathArgv = buildParseArgv({
      programName: "penguin",
      rawArgs: ["/usr/bin/node-22.2.0", "penguin", "status"],
    });
    expect(versionedNodeWithPathArgv).toEqual(["/usr/bin/node-22.2.0", "penguin", "status"]);

    const nodejsArgv = buildParseArgv({
      programName: "penguin",
      rawArgs: ["nodejs", "penguin", "status"],
    });
    expect(nodejsArgv).toEqual(["nodejs", "penguin", "status"]);

    const nonVersionedNodeArgv = buildParseArgv({
      programName: "penguin",
      rawArgs: ["node-dev", "penguin", "status"],
    });
    expect(nonVersionedNodeArgv).toEqual(["node", "penguin", "node-dev", "penguin", "status"]);

    const directArgv = buildParseArgv({
      programName: "penguin",
      rawArgs: ["penguin", "status"],
    });
    expect(directArgv).toEqual(["node", "penguin", "status"]);

    const bunArgv = buildParseArgv({
      programName: "penguin",
      rawArgs: ["bun", "src/entry.ts", "status"],
    });
    expect(bunArgv).toEqual(["bun", "src/entry.ts", "status"]);
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "penguin",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "penguin", "status"]);
  });

  it("decides when to migrate state", () => {
    expect(shouldMigrateState(["node", "penguin", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "penguin", "health"])).toBe(false);
    expect(shouldMigrateState(["node", "penguin", "sessions"])).toBe(false);
    expect(shouldMigrateState(["node", "penguin", "memory", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "penguin", "agent", "--message", "hi"])).toBe(false);
    expect(shouldMigrateState(["node", "penguin", "agents", "list"])).toBe(true);
    expect(shouldMigrateState(["node", "penguin", "message", "send"])).toBe(true);
  });

  it("reuses command path for migrate state decisions", () => {
    expect(shouldMigrateStateFromPath(["status"])).toBe(false);
    expect(shouldMigrateStateFromPath(["agents", "list"])).toBe(true);
  });
});
