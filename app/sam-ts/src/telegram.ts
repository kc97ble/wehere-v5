import fetch from 'node-fetch';
import { TelegramEvent } from './types';

export async function sendTelegramMessage(event: TelegramEvent): Promise<void> {
  const { bot_token, chat_id, message } = event;
  
  if (!bot_token || !chat_id || !message) {
    console.error('Missing required fields for Telegram message');
    throw new Error('Missing required fields for Telegram message');
  }
  
  const url = `https://api.telegram.org/bot${bot_token}/sendMessage`;
  const payload = {
    chat_id,
    text: message,
    parse_mode: 'HTML'
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to send Telegram message: ${response.status} ${errorText}`);
    }
    
    console.info(`Successfully sent Telegram message to ${chat_id}`);
  } catch (error) {
    console.error(`Failed to send Telegram message: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}