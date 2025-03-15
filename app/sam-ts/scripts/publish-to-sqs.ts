import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

/**
 * Publish a message to an SQS queue
 */
async function publishToSQS(queueUrl: string, messageType: 'noop' | 'tg', options?: { 
  botToken?: string;
  chatId?: string;
  message?: string;
}) {
  // Create SQS service object
  const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

  // Create message body based on type
  let messageBody: any;
  
  if (messageType === 'noop') {
    messageBody = { type: 'noop' };
  } else if (messageType === 'tg') {
    // Check required parameters for Telegram messages
    if (!options?.botToken || !options?.chatId || !options?.message) {
      throw new Error('For telegram messages, botToken, chatId, and message are required');
    }

    messageBody = {
      type: 'tg',
      bot_token: options.botToken,
      chat_id: options.chatId,
      message: options.message
    };
  }

  // Send message to SQS queue
  const params = {
    MessageBody: JSON.stringify(messageBody),
    QueueUrl: queueUrl,
    MessageDeduplicationId: uuidv4(), // Only needed for FIFO queues
    MessageGroupId: 'messageGroup1'    // Only needed for FIFO queues
  };

  try {
    const data = await sqs.sendMessage(params).promise();
    console.log(`Message sent! MessageId: ${data.MessageId}`);
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Run the script if executed directly
if (require.main === module) {
  // Parse command line arguments
  const args = process.argv.slice(2);
  
  // Show usage if no arguments provided
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  ts-node publish-to-sqs.ts --queue-url <queue-url> --type noop');
    console.log('  ts-node publish-to-sqs.ts --queue-url <queue-url> --type tg --bot-token <token> --chat-id <id> --message <msg>');
    process.exit(1);
  }

  // Parse arguments
  const parsedArgs: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    parsedArgs[key] = value;
  }

  const { 'queue-url': queueUrl, type, 'bot-token': botToken, 'chat-id': chatId, message } = parsedArgs;

  if (!queueUrl) {
    console.error('Error: --queue-url is required');
    process.exit(1);
  }

  if (type !== 'noop' && type !== 'tg') {
    console.error('Error: --type must be either "noop" or "tg"');
    process.exit(1);
  }

  // Publish the message
  publishToSQS(queueUrl, type as 'noop' | 'tg', {
    botToken,
    chatId,
    message
  })
    .then(() => console.log('Message published successfully'))
    .catch(err => {
      console.error('Failed to publish message:', err);
      process.exit(1);
    });
}