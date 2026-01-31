import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "penguin",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "penguin", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "penguin", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "penguin", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "penguin", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "penguin", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "penguin", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it("rejects combining --dev with --profile (dev first)", () => {
    const res = parseCliProfileArgs(["node", "penguin", "--dev", "--profile", "work", "status"]);
    expect(res.ok).toBe(false);
  });

  it("rejects combining --dev with --profile (profile first)", () => {
    const res = parseCliProfileArgs(["node", "penguin", "--profile", "work", "--dev", "status"]);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join("/home/peter", ".penguin-dev");
    expect(env.PENGUIN_PROFILE).toBe("dev");
    expect(env.PENGUIN_STATE_DIR).toBe(expectedStateDir);
    expect(env.PENGUIN_CONFIG_PATH).toBe(path.join(expectedStateDir, "penguin.json"));
    expect(env.PENGUIN_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      PENGUIN_STATE_DIR: "/custom",
      PENGUIN_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.PENGUIN_STATE_DIR).toBe("/custom");
    expect(env.PENGUIN_GATEWAY_PORT).toBe("19099");
    expect(env.PENGUIN_CONFIG_PATH).toBe(path.join("/custom", "penguin.json"));
  });
});

describe("formatCliCommand", () => {
  it("returns command unchanged when no profile is set", () => {
    expect(formatCliCommand("penguin doctor --fix", {})).toBe("penguin doctor --fix");
  });

  it("returns command unchanged when profile is default", () => {
    expect(formatCliCommand("penguin doctor --fix", { PENGUIN_PROFILE: "default" })).toBe(
      "penguin doctor --fix",
    );
  });

  it("returns command unchanged when profile is Default (case-insensitive)", () => {
    expect(formatCliCommand("penguin doctor --fix", { PENGUIN_PROFILE: "Default" })).toBe(
      "penguin doctor --fix",
    );
  });

  it("returns command unchanged when profile is invalid", () => {
    expect(formatCliCommand("penguin doctor --fix", { PENGUIN_PROFILE: "bad profile" })).toBe(
      "penguin doctor --fix",
    );
  });

  it("returns command unchanged when --profile is already present", () => {
    expect(
      formatCliCommand("penguin --profile work doctor --fix", { PENGUIN_PROFILE: "work" }),
    ).toBe("penguin --profile work doctor --fix");
  });

  it("returns command unchanged when --dev is already present", () => {
    expect(formatCliCommand("penguin --dev doctor", { PENGUIN_PROFILE: "dev" })).toBe(
      "penguin --dev doctor",
    );
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("penguin doctor --fix", { PENGUIN_PROFILE: "work" })).toBe(
      "penguin --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("penguin doctor --fix", { PENGUIN_PROFILE: "  jbpenguin  " })).toBe(
      "penguin --profile jbpenguin doctor --fix",
    );
  });

  it("handles command with no args after penguin", () => {
    expect(formatCliCommand("penguin", { PENGUIN_PROFILE: "test" })).toBe(
      "penguin --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm penguin doctor", { PENGUIN_PROFILE: "work" })).toBe(
      "pnpm penguin --profile work doctor",
    );
  });
});
