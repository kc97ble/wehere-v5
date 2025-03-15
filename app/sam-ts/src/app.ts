import { SQSEvent, SQSRecord, Context, SQSBatchResponse } from 'aws-lambda';
import { Event, BaseEvent, isTelegramEvent, isNoopEvent } from './types';
import { sendTelegramMessage } from './telegram';

/**
 * Process an event based on its type
 */
export async function processEvent(event: BaseEvent): Promise<void> {
  if (isNoopEvent(event)) {
    console.info('Received noop event, doing nothing');
    return;
  }
  
  if (isTelegramEvent(event)) {
    console.info('Processing Telegram event');
    await sendTelegramMessage(event);
    return;
  }
  
  console.warn(`Unknown event type: ${(event as BaseEvent).type}`);
}

/**
 * Process an SQS record containing an event
 */
export async function processSQSRecord(record: SQSRecord): Promise<void> {
  try {
    const body = JSON.parse(record.body) as Event;
    await processEvent(body);
  } catch (error) {
    console.error(`Error processing SQS record: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * Lambda handler for processing SQS events
 */
export async function handler(event: SQSEvent, context: Context): Promise<any> {
  console.info(`Received event: ${JSON.stringify(event)}`);
  
  if (!event.Records || event.Records.length === 0) {
    console.error('No SQS records found in event');
    return {
      statusCode: 400,
      body: 'No SQS records found'
    };
  }
  
  const failedRecords: string[] = [];
  
  await Promise.all(event.Records.map(async (record) => {
    try {
      await processSQSRecord(record);
    } catch (error) {
      console.error(`Failed to process record ${record.messageId}: ${error instanceof Error ? error.message : String(error)}`);
      failedRecords.push(record.messageId);
    }
  }));
  
  // Return batch response for SQS with failed message IDs if any
  if (failedRecords.length > 0) {
    return {
      batchItemFailures: failedRecords.map((id) => ({ itemIdentifier: id }))
    } as SQSBatchResponse;
  }
  
  return {
    statusCode: 200,
    body: 'Processing complete'
  };
}