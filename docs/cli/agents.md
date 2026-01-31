---
summary: "CLI reference for `penguin agents` (list/add/delete/set identity)"
read_when:
  - You want multiple isolated agents (workspaces + routing + auth)
---

# `penguin agents`

Manage isolated agents (workspaces + auth + routing).

Related:

- Multi-agent routing: [Multi-Agent Routing](/concepts/multi-agent)
- Agent workspace: [Agent workspace](/concepts/agent-workspace)

## Examples

```bash
penguin agents list
penguin agents add work --workspace ~/.penguin/workspace-work
penguin agents set-identity --workspace ~/.penguin/workspace --from-identity
penguin agents set-identity --agent main --avatar avatars/penguin.png
penguin agents delete work
```

## Identity files

Each agent workspace can include an `IDENTITY.md` at the workspace root:

- Example path: `~/.penguin/workspace/IDENTITY.md`
- `set-identity --from-identity` reads from the workspace root (or an explicit `--identity-file`)

Avatar paths resolve relative to the workspace root.

## Set identity

`set-identity` writes fields into `agents.list[].identity`:

- `name`
- `theme`
- `emoji`
- `avatar` (workspace-relative path, http(s) URL, or data URI)

Load from `IDENTITY.md`:

```bash
penguin agents set-identity --workspace ~/.penguin/workspace --from-identity
```

Override fields explicitly:

```bash
penguin agents set-identity --agent main --name "Penguin" --emoji "🐧" --avatar avatars/penguin.png
```

Config sample:

```json5
{
  agents: {
    list: [
      {
        id: "main",
        identity: {
          name: "Penguin",
          theme: "helpful assistant",
          emoji: "🐧",
          avatar: "avatars/penguin.png",
        },
      },
    ],
  },
}
```
