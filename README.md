## RugWatch — Solana Rugpull & Scam Detection Bot

Detects risky new token launches on Solana (e.g., Pump.fun/Raydium/Meteora) using on-chain checks, liquidity heuristics, and risk scoring. Sends alerts to Telegram and Discord.

### Features

- **New token watcher**: Subscribes to Solana logs to detect fresh mints/pools
- **Authority checks**: Mint/freeze authority status, decimals, supply
- **Liquidity checks (extensible)**: Hook points for per-DEX LP health
- **Risk scoring**: Weighted rules producing 0–100 score with reasons
- **Alerts**: Telegram and Discord notifications when risk exceeds threshold
- **TypeScript + Node 18+**

### Quickstart

1) Install

```bash
npm i
```

2) Configure environment

Create `.env` (or fill `env.example` and rename):

```env
RPC_ENDPOINTS=https://api.mainnet-beta.solana.com
WS_ENDPOINT=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
DISCORD_WEBHOOK_URL=
RISK_SCORE_ALERT_THRESHOLD=70
PROGRAM_IDS=
SIM_BUY_SOL=0.01
```

3) Develop

```bash
npm run dev
```

4) Build & run

```bash
npm run build
npm start
```

### Architecture

- `src/index.ts`: App entrypoint. Loads config, creates Solana client, runs watcher, scores risk, sends alerts.
- `src/lib/config.ts`: Reads environment variables and provides typed config.
- `src/lib/solana.ts`: Connection factory to Solana RPC/WebSocket.
- `src/lib/logger.ts`: Pino logger.
- `src/watchers/newTokenWatcher.ts`: Subscribes to program logs and emits `TokenEvent`.
- `src/checks/tokenChecks.ts`: SPL token authority/supply checks.
- `src/checks/liquidityChecks.ts`: Extension points for per-DEX liquidity analysis.
- `src/scoring/riskScoring.ts`: Aggregate risk calculation.
- `src/services/telegram.ts`, `src/services/discord.ts`: Alert integrations.
- `src/simulation/honeypotSimulator.ts`: Placeholder for buy/sell simulation.

### Extending per DEX

- Pump.fun: parse logs for mint address; read bonding curve and pool state accounts
- Raydium: track AMM pool creation; read LP token mint and lock/owner
- Meteora: DLMM pool state for initial liquidity

Add concrete readers in `checks/liquidityChecks.ts` and feed into `riskScoring`.

### Risk Scoring (default weights)

- Mint authority active: +30
- Freeze authority active: +20
- Low initial liquidity (<5 SOL): +15
- LP not locked: +20
- Uncommon decimals: +5

Scores cap at 100. Tune weights per your strategy.

### Honeypot Simulation

Implement buy/sell attempts via route builders for the target DEX and `simulateTransaction`. If sell fails or taxes are extreme, add to risk.

### Production Notes

- Use multiple RPCs (Helius/Triton/Ankr) for reliability.
- Consider a small database to track processed mints and deployer reputation.
- Backoff/retry on network errors.

## Contact

- Telegram: t.me/@lorine93s