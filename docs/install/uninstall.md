---
summary: "Uninstall Penguin completely (CLI, service, state, workspace)"
read_when:
  - You want to remove Penguin from a machine
  - The gateway service is still running after uninstall
---

# Uninstall

Two paths:

- **Easy path** if `penguin` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
penguin uninstall
```

Non-interactive (automation / npx):

```bash
penguin uninstall --all --yes --non-interactive
npx -y penguin uninstall --all --yes --non-interactive
```

Manual steps (same result):

1. Stop the gateway service:

```bash
penguin gateway stop
```

2. Uninstall the gateway service (launchd/systemd/schtasks):

```bash
penguin gateway uninstall
```

3. Delete state + config:

```bash
rm -rf "${PENGUIN_STATE_DIR:-$HOME/.penguin}"
```

If you set `PENGUIN_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4. Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/.penguin/workspace
```

5. Remove the CLI install (pick the one you used):

```bash
npm rm -g penguin
pnpm remove -g penguin
bun remove -g penguin
```

6. If you installed the macOS app:

```bash
rm -rf /Applications/Penguin.app
```

Notes:

- If you used profiles (`--profile` / `PENGUIN_PROFILE`), repeat step 3 for each state dir (defaults are `~/.penguin-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `penguin` is missing.

### macOS (launchd)

Default label is `bot.molt.gateway` (or `bot.molt.<profile>`; legacy `com.penguin.*` may still exist):

```bash
launchctl bootout gui/$UID/bot.molt.gateway
rm -f ~/Library/LaunchAgents/bot.molt.gateway.plist
```

If you used a profile, replace the label and plist name with `bot.molt.<profile>`. Remove any legacy `com.penguin.*` plists if present.

### Linux (systemd user unit)

Default unit name is `penguin-gateway.service` (or `penguin-gateway-<profile>.service`):

```bash
systemctl --user disable --now penguin-gateway.service
rm -f ~/.config/systemd/user/penguin-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `Penguin Gateway` (or `Penguin Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "Penguin Gateway"
Remove-Item -Force "$env:USERPROFILE\.penguin\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.penguin-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://penguin.bot/install.sh` or `install.ps1`, the CLI was installed with `npm install -g penguin@latest`.
Remove it with `npm rm -g penguin` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `penguin ...` / `bun run penguin ...`):

1. Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2. Delete the repo directory.
3. Remove state + workspace as shown above.
