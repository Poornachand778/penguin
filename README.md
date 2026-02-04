# Penguin 🐧

Your personal AI assistant. Any OS. Any Platform. The penguin way.

## What is Penguin?

Penguin is an autonomous AI personal assistant that runs locally on your hardware and connects to your favorite messaging platforms (WhatsApp, Telegram, Slack, Discord, iMessage, and more). It can execute real-world tasks on your machine, maintain persistent memory across conversations, and proactively help you with your digital life.

## Features

- **Multi-platform messaging** - WhatsApp, Telegram, Slack, Discord, iMessage, Signal, Google Chat, Microsoft Teams, and more
- **Local-first** - Runs on your machine, you control your data
- **Persistent memory** - Remembers context across sessions using markdown files
- **Tool execution** - Shell commands, browser automation, file operations
- **Extensible** - Plugin system for custom integrations
- **Voice support** - Speak and listen on macOS/iOS/Android
- **Live Canvas** - Agent-driven visual workspace
- **Secure by design** - Pairing-based access control, loopback-only gateway

## Quick Start

**Requirements:** Node.js >= 22

```bash
# Install globally from npm
npm install -g penguin-ai

# Or install directly from GitHub
npm install -g github:Poornachand778/penguin

# Run onboarding wizard (recommended)
penguin onboard

# Or configure manually
penguin configure

# Start the gateway
penguin gateway
```

## Configuration

Configuration is stored at `~/.penguin/penguin.json`. Key settings:

- `gateway.bind` - Network binding (loopback, lan, tailnet)
- `gateway.auth` - Authentication mode (token, password)
- `channels.*` - Messaging platform configuration
- `agents.defaults` - Default agent settings

## Commands

```bash
penguin gateway          # Start the gateway server
penguin onboard          # Run onboarding wizard
penguin configure        # Run configuration wizard
penguin security audit   # Run security audit
penguin doctor           # Diagnose issues
penguin channels status  # Check channel connections
penguin message send     # Send a message
penguin agent            # Run agent directly
```

## Security

Run `penguin security audit --deep` to check your configuration for security issues.

Key security practices:
- Keep gateway bound to loopback (127.0.0.1)
- Use pairing mode for DM policies (`dmPolicy: "pairing"`)
- Restrict allowFrom to your numbers only
- Protect credentials directory (`chmod 700 ~/.penguin/credentials`)
- Never expose the gateway to the public internet

## Architecture

```
┌─────────────────────────────────────────────┐
│           Gateway (WebSocket)               │
│              127.0.0.1:18789                │
├─────────────────────────────────────────────┤
│  Channels    │    Agent    │    Tools       │
│  - WhatsApp  │  - Claude   │  - Bash        │
│  - Telegram  │  - OpenAI   │  - Browser     │
│  - Slack     │  - Gemini   │  - Files       │
│  - Discord   │  - Local    │  - Memory      │
│  - iMessage  │             │  - Canvas      │
└─────────────────────────────────────────────┘
```

## Workspace Files

Penguin uses markdown files for persistent memory:

- `SOUL.md` - Agent identity and personality
- `IDENTITY.md` - Name and basic info
- `MEMORY.md` - Long-term curated memories
- `memory/*.md` - Daily logs
- `TOOLS.md` - Environment-specific notes

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint
```

## License

This project is provided as-is for personal use.
