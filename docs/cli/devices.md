---
summary: "CLI reference for `penguin devices` (device pairing + token rotation/revocation)"
read_when:
  - You are approving device pairing requests
  - You need to rotate or revoke device tokens
---

# `penguin devices`

Manage device pairing requests and device-scoped tokens.

## Commands

### `penguin devices list`

List pending pairing requests and paired devices.

```
penguin devices list
penguin devices list --json
```

### `penguin devices approve <requestId>`

Approve a pending device pairing request.

```
penguin devices approve <requestId>
```

### `penguin devices reject <requestId>`

Reject a pending device pairing request.

```
penguin devices reject <requestId>
```

### `penguin devices rotate --device <id> --role <role> [--scope <scope...>]`

Rotate a device token for a specific role (optionally updating scopes).

```
penguin devices rotate --device <deviceId> --role operator --scope operator.read --scope operator.write
```

### `penguin devices revoke --device <id> --role <role>`

Revoke a device token for a specific role.

```
penguin devices revoke --device <deviceId> --role node
```

## Common options

- `--url <url>`: Gateway WebSocket URL (defaults to `gateway.remote.url` when configured).
- `--token <token>`: Gateway token (if required).
- `--password <password>`: Gateway password (password auth).
- `--timeout <ms>`: RPC timeout.
- `--json`: JSON output (recommended for scripting).

## Notes

- Token rotation returns a new token (sensitive). Treat it like a secret.
- These commands require `operator.pairing` (or `operator.admin`) scope.
