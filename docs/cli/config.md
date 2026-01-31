---
summary: "CLI reference for `penguin config` (get/set/unset config values)"
read_when:
  - You want to read or edit config non-interactively
---

# `penguin config`

Config helpers: get/set/unset values by path. Run without a subcommand to open
the configure wizard (same as `penguin configure`).

## Examples

```bash
penguin config get browser.executablePath
penguin config set browser.executablePath "/usr/bin/google-chrome"
penguin config set agents.defaults.heartbeat.every "2h"
penguin config set agents.list[0].tools.exec.node "node-id-or-name"
penguin config unset tools.web.search.apiKey
```

## Paths

Paths use dot or bracket notation:

```bash
penguin config get agents.defaults.workspace
penguin config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
penguin config get agents.list
penguin config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--json` to require JSON5 parsing.

```bash
penguin config set agents.defaults.heartbeat.every "0m"
penguin config set gateway.port 19001 --json
penguin config set channels.whatsapp.groups '["*"]' --json
```

Restart the gateway after edits.
