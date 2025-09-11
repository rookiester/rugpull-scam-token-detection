import axios from 'axios';
import { AppConfig } from '../lib/config.js';
import { logger } from '../lib/logger.js';

export async function sendTelegramAlert(config: AppConfig, text: string): Promise<void> {
  if (!config.telegramBotToken || !config.telegramChatId) return;
  const url = `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`;
  try {
    await axios.post(url, { chat_id: config.telegramChatId, text, parse_mode: 'Markdown' });
  } catch (err) {
    logger.error({ err }, 'Failed to send Telegram alert');
  }
}


