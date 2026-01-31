---
summary: "CLI reference for `penguin browser` (profiles, tabs, actions, extension relay)"
read_when:
  - You use `penguin browser` and want examples for common tasks
  - You want to control a browser running on another machine via a node host
  - You want to use the Chrome extension relay (attach/detach via toolbar button)
---

# `penguin browser`

Manage Penguin’s browser control server and run browser actions (tabs, snapshots, screenshots, navigation, clicks, typing).

Related:

- Browser tool + API: [Browser tool](/tools/browser)
- Chrome extension relay: [Chrome extension](/tools/chrome-extension)

## Common flags

- `--url <gatewayWsUrl>`: Gateway WebSocket URL (defaults to config).
- `--token <token>`: Gateway token (if required).
- `--timeout <ms>`: request timeout (ms).
- `--browser-profile <name>`: choose a browser profile (default from config).
- `--json`: machine-readable output (where supported).

## Quick start (local)

```bash
penguin browser --browser-profile chrome tabs
penguin browser --browser-profile penguin start
penguin browser --browser-profile penguin open https://example.com
penguin browser --browser-profile penguin snapshot
```

## Profiles

Profiles are named browser routing configs. In practice:

- `penguin`: launches/attaches to a dedicated Penguin-managed Chrome instance (isolated user data dir).
- `chrome`: controls your existing Chrome tab(s) via the Chrome extension relay.

```bash
penguin browser profiles
penguin browser create-profile --name work --color "#FF5A36"
penguin browser delete-profile --name work
```

Use a specific profile:

```bash
penguin browser --browser-profile work tabs
```

## Tabs

```bash
penguin browser tabs
penguin browser open https://docs.penguin.ai
penguin browser focus <targetId>
penguin browser close <targetId>
```

## Snapshot / screenshot / actions

Snapshot:

```bash
penguin browser snapshot
```

Screenshot:

```bash
penguin browser screenshot
```

Navigate/click/type (ref-based UI automation):

```bash
penguin browser navigate https://example.com
penguin browser click <ref>
penguin browser type <ref> "hello"
```

## Chrome extension relay (attach via toolbar button)

This mode lets the agent control an existing Chrome tab that you attach manually (it does not auto-attach).

Install the unpacked extension to a stable path:

```bash
penguin browser extension install
penguin browser extension path
```

Then Chrome → `chrome://extensions` → enable “Developer mode” → “Load unpacked” → select the printed folder.

Full guide: [Chrome extension](/tools/chrome-extension)

## Remote browser control (node host proxy)

If the Gateway runs on a different machine than the browser, run a **node host** on the machine that has Chrome/Brave/Edge/Chromium. The Gateway will proxy browser actions to that node (no separate browser control server required).

Use `gateway.nodes.browser.mode` to control auto-routing and `gateway.nodes.browser.node` to pin a specific node if multiple are connected.

Security + remote setup: [Browser tool](/tools/browser), [Remote access](/gateway/remote), [Tailscale](/gateway/tailscale), [Security](/gateway/security)
