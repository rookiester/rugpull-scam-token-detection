import dotenv from 'dotenv';

dotenv.config();

export type AppConfig = {
  rpcEndpoints: string[];
  wsEndpoint?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  discordWebhookUrl?: string;
  riskAlertThreshold: number;
  programIds: string[];
  simBuySol: number;
};

export function loadConfig(): AppConfig {
  const rpcEndpointsRaw = process.env.RPC_ENDPOINTS ?? '';
  const rpcEndpoints = rpcEndpointsRaw.split(',').map((s) => s.trim()).filter(Boolean);
  if (rpcEndpoints.length === 0) {
    throw new Error('RPC_ENDPOINTS is required');
  }
  const programIds = (process.env.PROGRAM_IDS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const riskAlertThreshold = Number(process.env.RISK_SCORE_ALERT_THRESHOLD ?? '70');
  const simBuySol = Number(process.env.SIM_BUY_SOL ?? '0.01');

  return {
    rpcEndpoints,
    wsEndpoint: process.env.WS_ENDPOINT || undefined,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || undefined,
    telegramChatId: process.env.TELEGRAM_CHAT_ID || undefined,
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL || undefined,
    riskAlertThreshold,
    programIds,
    simBuySol
  };
}


