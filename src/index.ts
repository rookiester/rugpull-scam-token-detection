import { loadConfig } from './lib/config.js';
import { logger } from './lib/logger.js';
import { createSolanaClients } from './lib/solana.js';
import { runNewTokenWatcher } from './watchers/newTokenWatcher.js';
import { scoreTokenRisk } from './scoring/riskScoring.js';
import { sendDiscordAlert } from './services/discord.js';
import { sendTelegramAlert } from './services/telegram.js';
import { TokenEvent } from './types.js';

async function main(): Promise<void> {
  const config = loadConfig();
  const clients = await createSolanaClients({ rpcEndpoints: config.rpcEndpoints, wsEndpoint: config.wsEndpoint });

  logger.info({ endpoints: config.rpcEndpoints }, 'Rugpull detector starting');

  await runNewTokenWatcher({
    clients,
    programIds: config.programIds,
    onTokenDetected: async (evt: TokenEvent) => {
      try {
        const score = await scoreTokenRisk(clients, evt);
        logger.info({ mint: evt.mint, score }, 'Risk score computed');

        if (score.total >= config.riskAlertThreshold) {
          const title = `RugWatch Alert: ${evt.symbol ?? evt.mint}`;
          const msg = `Risk Score: ${score.total}\nMint: ${evt.mint}\nReason: ${score.reasons.join('; ')}`;
          await Promise.all([
            sendTelegramAlert(config, `"${title}"\n${msg}`),
            sendDiscordAlert(config, title, msg)
          ]);
        }
      } catch (err) {
        logger.error({ err, mint: evt.mint }, 'Failed processing token event');
      }
    }
  });
}

main().catch((err) => {
  logger.fatal({ err }, 'Fatal error in main');
  process.exit(1);
});


