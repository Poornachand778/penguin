import path from "node:path";

import { describe, expect, it } from "vitest";

import { resolveGatewayStateDir } from "./paths.js";

describe("resolveGatewayStateDir", () => {
  it("uses the default state dir when no overrides are set", () => {
    const env = { HOME: "/Users/test" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".penguin"));
  });

  it("appends the profile suffix when set", () => {
    const env = { HOME: "/Users/test", PENGUIN_PROFILE: "rescue" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".penguin-rescue"));
  });

  it("treats default profiles as the base state dir", () => {
    const env = { HOME: "/Users/test", PENGUIN_PROFILE: "Default" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".penguin"));
  });

  it("uses PENGUIN_STATE_DIR when provided", () => {
    const env = { HOME: "/Users/test", PENGUIN_STATE_DIR: "/var/lib/penguin" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/var/lib/penguin"));
  });

  it("expands ~ in PENGUIN_STATE_DIR", () => {
    const env = { HOME: "/Users/test", PENGUIN_STATE_DIR: "~/penguin-state" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/Users/test/penguin-state"));
  });

  it("preserves Windows absolute paths without HOME", () => {
    const env = { PENGUIN_STATE_DIR: "C:\\State\\penguin" };
    expect(resolveGatewayStateDir(env)).toBe("C:\\State\\penguin");
  });
});
