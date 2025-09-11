import { PublicKey } from '@solana/web3.js';
import { logger } from '../lib/logger.js';
import { SolanaClients, TokenEvent } from '../types.js';

type Params = {
  clients: SolanaClients;
  programIds: string[];
  onTokenDetected: (evt: TokenEvent) => Promise<void>;
};

// Minimal viable watcher using logsSubscribe (can be extended per DEX)
export async function runNewTokenWatcher({ clients, programIds, onTokenDetected }: Params): Promise<void> {
  const { connection } = clients;

  const filters = programIds
    .map((id) => ({ mentions: [new PublicKey(id).toBase58()] }))
    .filter(Boolean);

  if (filters.length === 0) {
    logger.warn('No PROGRAM_IDS configured. The watcher will not receive events.');
  }

  const sub = await connection.onLogs('all', async (logs, ctx) => {
    try {
      const programId = logs.programId?.toBase58();
      const mint = extractPossibleMintFromLogs(logs.logs);
      if (!mint) return;

      const evt: TokenEvent = {
        mint,
        programId,
        slot: ctx.slot
      };
      await onTokenDetected(evt);
    } catch (err) {
      logger.error({ err }, 'Error handling log event');
    }
  }, 'confirmed');

  logger.info({ sub }, 'Logs watcher subscribed');
}

function extractPossibleMintFromLogs(lines: string[]): string | undefined {
  for (const line of lines) {
    const m = line.match(/mint\s*[:=]\s*([1-9A-HJ-NP-Za-km-z]{32,44})/);
    if (m?.[1]) return m[1];
  }
  return undefined;
}


