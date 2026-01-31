---
summary: "CLI reference for `penguin reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
---

# `penguin reset`

Reset local config/state (keeps the CLI installed).

```bash
penguin reset
penguin reset --dry-run
penguin reset --scope config+creds+sessions --yes --non-interactive
```
