import axios from 'axios';
import { AppConfig } from '../lib/config.js';
import { logger } from '../lib/logger.js';

export async function sendDiscordAlert(config: AppConfig, title: string, description: string): Promise<void> {
  if (!config.discordWebhookUrl) return;
  try {
    await axios.post(config.discordWebhookUrl, {
      embeds: [
        {
          title,
          description,
          color: 15158332
        }
      ]
    });
  } catch (err) {
    logger.error({ err }, 'Failed to send Discord alert');
  }
}


