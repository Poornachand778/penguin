---
summary: "CLI reference for `penguin logs` (tail gateway logs via RPC)"
read_when:
  - You need to tail Gateway logs remotely (without SSH)
  - You want JSON log lines for tooling
---

# `penguin logs`

Tail Gateway file logs over RPC (works in remote mode).

Related:

- Logging overview: [Logging](/logging)

## Examples

```bash
penguin logs
penguin logs --follow
penguin logs --json
penguin logs --limit 500
```
