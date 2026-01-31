import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import {
  resolveDefaultConfigCandidates,
  resolveConfigPath,
  resolveOAuthDir,
  resolveOAuthPath,
  resolveStateDir,
} from "./paths.js";

describe("oauth paths", () => {
  it("prefers PENGUIN_OAUTH_DIR over PENGUIN_STATE_DIR", () => {
    const env = {
      PENGUIN_OAUTH_DIR: "/custom/oauth",
      PENGUIN_STATE_DIR: "/custom/state",
    } as NodeJS.ProcessEnv;

    expect(resolveOAuthDir(env, "/custom/state")).toBe(path.resolve("/custom/oauth"));
    expect(resolveOAuthPath(env, "/custom/state")).toBe(
      path.join(path.resolve("/custom/oauth"), "oauth.json"),
    );
  });

  it("derives oauth path from PENGUIN_STATE_DIR when unset", () => {
    const env = {
      PENGUIN_STATE_DIR: "/custom/state",
    } as NodeJS.ProcessEnv;

    expect(resolveOAuthDir(env, "/custom/state")).toBe(path.join("/custom/state", "credentials"));
    expect(resolveOAuthPath(env, "/custom/state")).toBe(
      path.join("/custom/state", "credentials", "oauth.json"),
    );
  });
});

describe("state + config path candidates", () => {
  it("uses PENGUIN_STATE_DIR when set", () => {
    const env = {
      PENGUIN_STATE_DIR: "/new/state",
    } as NodeJS.ProcessEnv;

    expect(resolveStateDir(env, () => "/home/test")).toBe(path.resolve("/new/state"));
  });

  it("orders default config candidates in a stable order", () => {
    const home = "/home/test";
    const candidates = resolveDefaultConfigCandidates({} as NodeJS.ProcessEnv, () => home);
    const expected = [
      path.join(home, ".penguin", "penguin.json"),
      path.join(home, ".penguin", "penguin.json"),
      path.join(home, ".penguin", "penguin.json"),
      path.join(home, ".penguin", "moldbot.json"),
      path.join(home, ".penguin", "penguin.json"),
      path.join(home, ".penguin", "penguin.json"),
      path.join(home, ".penguin", "penguin.json"),
      path.join(home, ".penguin", "moldbot.json"),
      path.join(home, ".penguin", "penguin.json"),
      path.join(home, ".penguin", "penguin.json"),
      path.join(home, ".penguin", "penguin.json"),
      path.join(home, ".penguin", "moldbot.json"),
      path.join(home, ".moldbot", "penguin.json"),
      path.join(home, ".moldbot", "penguin.json"),
      path.join(home, ".moldbot", "penguin.json"),
      path.join(home, ".moldbot", "moldbot.json"),
    ];
    expect(candidates).toEqual(expected);
  });

  it("prefers ~/.penguin when it exists and legacy dir is missing", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "penguin-state-"));
    try {
      const newDir = path.join(root, ".penguin");
      await fs.mkdir(newDir, { recursive: true });
      const resolved = resolveStateDir({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(newDir);
    } finally {
      await fs.rm(root, { recursive: true, force: true });
    }
  });

  it("CONFIG_PATH prefers existing config when present", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "penguin-config-"));
    const previousHome = process.env.HOME;
    const previousUserProfile = process.env.USERPROFILE;
    const previousHomeDrive = process.env.HOMEDRIVE;
    const previousHomePath = process.env.HOMEPATH;
    const previousPenguinConfig = process.env.PENGUIN_CONFIG_PATH;
    const previousPenguinState = process.env.PENGUIN_STATE_DIR;
    try {
      const legacyDir = path.join(root, ".penguin");
      await fs.mkdir(legacyDir, { recursive: true });
      const legacyPath = path.join(legacyDir, "penguin.json");
      await fs.writeFile(legacyPath, "{}", "utf-8");

      process.env.HOME = root;
      if (process.platform === "win32") {
        process.env.USERPROFILE = root;
        const parsed = path.win32.parse(root);
        process.env.HOMEDRIVE = parsed.root.replace(/\\$/, "");
        process.env.HOMEPATH = root.slice(parsed.root.length - 1);
      }
      delete process.env.PENGUIN_CONFIG_PATH;
      delete process.env.PENGUIN_STATE_DIR;

      vi.resetModules();
      const { CONFIG_PATH } = await import("./paths.js");
      expect(CONFIG_PATH).toBe(legacyPath);
    } finally {
      if (previousHome === undefined) {
        delete process.env.HOME;
      } else {
        process.env.HOME = previousHome;
      }
      if (previousUserProfile === undefined) {
        delete process.env.USERPROFILE;
      } else {
        process.env.USERPROFILE = previousUserProfile;
      }
      if (previousHomeDrive === undefined) {
        delete process.env.HOMEDRIVE;
      } else {
        process.env.HOMEDRIVE = previousHomeDrive;
      }
      if (previousHomePath === undefined) {
        delete process.env.HOMEPATH;
      } else {
        process.env.HOMEPATH = previousHomePath;
      }
      if (previousPenguinConfig === undefined) {
        delete process.env.PENGUIN_CONFIG_PATH;
      } else {
        process.env.PENGUIN_CONFIG_PATH = previousPenguinConfig;
      }
      if (previousPenguinConfig === undefined) {
        delete process.env.PENGUIN_CONFIG_PATH;
      } else {
        process.env.PENGUIN_CONFIG_PATH = previousPenguinConfig;
      }
      if (previousPenguinState === undefined) {
        delete process.env.PENGUIN_STATE_DIR;
      } else {
        process.env.PENGUIN_STATE_DIR = previousPenguinState;
      }
      if (previousPenguinState === undefined) {
        delete process.env.PENGUIN_STATE_DIR;
      } else {
        process.env.PENGUIN_STATE_DIR = previousPenguinState;
      }
      await fs.rm(root, { recursive: true, force: true });
      vi.resetModules();
    }
  });

  it("respects state dir overrides when config is missing", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "penguin-config-override-"));
    try {
      const legacyDir = path.join(root, ".penguin");
      await fs.mkdir(legacyDir, { recursive: true });
      const legacyConfig = path.join(legacyDir, "penguin.json");
      await fs.writeFile(legacyConfig, "{}", "utf-8");

      const overrideDir = path.join(root, "override");
      const env = { PENGUIN_STATE_DIR: overrideDir } as NodeJS.ProcessEnv;
      const resolved = resolveConfigPath(env, overrideDir, () => root);
      expect(resolved).toBe(path.join(overrideDir, "penguin.json"));
    } finally {
      await fs.rm(root, { recursive: true, force: true });
    }
  });
});
