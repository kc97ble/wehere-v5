import { SQSEvent, SQSRecord } from 'aws-lambda';
import { handler, processEvent, processSQSRecord } from '../src/app';
import { sendTelegramMessage } from '../src/telegram';

// Mock the telegram module
jest.mock('../src/telegram', () => ({
  sendTelegramMessage: jest.fn().mockResolvedValue(undefined)
}));

// Mock console methods
const mockConsoleInfo = jest.spyOn(console, 'info').mockImplementation();
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();

describe('App Lambda Function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('processEvent', () => {
    it('should handle noop events correctly', async () => {
      const event = { type: 'noop' };
      await processEvent(event);
      
      expect(mockConsoleInfo).toHaveBeenCalledWith('Received noop event, doing nothing');
      expect(sendTelegramMessage).not.toHaveBeenCalled();
    });

    it('should handle telegram events correctly', async () => {
      const event = {
        type: 'tg',
        bot_token: 'test_token',
        chat_id: '123456',
        message: 'Test message'
      };
      
      await processEvent(event);
      
      expect(mockConsoleInfo).toHaveBeenCalledWith('Processing Telegram event');
      expect(sendTelegramMessage).toHaveBeenCalledWith(event);
    });

    it('should handle unknown event types', async () => {
      const event = { type: 'unknown' as any };
      await processEvent(event);
      
      expect(mockConsoleWarn).toHaveBeenCalledWith('Unknown event type: unknown');
      expect(sendTelegramMessage).not.toHaveBeenCalled();
    });
  });

  describe('processSQSRecord', () => {
    it('should process a valid SQS record', async () => {
      const record: SQSRecord = {
        messageId: '1',
        receiptHandle: 'handle',
        body: JSON.stringify({ type: 'noop' }),
        attributes: {
          ApproximateReceiveCount: '1',
          SentTimestamp: '1',
          SenderId: '1',
          ApproximateFirstReceiveTimestamp: '1'
        },
        messageAttributes: {},
        md5OfBody: '',
        eventSource: '',
        eventSourceARN: '',
        awsRegion: ''
      };
      
      await processSQSRecord(record);
      
      expect(mockConsoleInfo).toHaveBeenCalledWith('Received noop event, doing nothing');
    });

    it('should handle invalid JSON in SQS record body', async () => {
      const record: SQSRecord = {
        messageId: '1',
        receiptHandle: 'handle',
        body: 'not-json',
        attributes: {
          ApproximateReceiveCount: '1',
          SentTimestamp: '1',
          SenderId: '1',
          ApproximateFirstReceiveTimestamp: '1'
        },
        messageAttributes: {},
        md5OfBody: '',
        eventSource: '',
        eventSourceARN: '',
        awsRegion: ''
      };
      
      await expect(processSQSRecord(record)).rejects.toThrow();
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });

  describe('handler', () => {
    it('should process all records in an SQS event', async () => {
      const sqsEvent: SQSEvent = {
        Records: [
          {
            messageId: '1',
            receiptHandle: 'handle1',
            body: JSON.stringify({ type: 'noop' }),
            attributes: {
              ApproximateReceiveCount: '1',
              SentTimestamp: '1',
              SenderId: '1',
              ApproximateFirstReceiveTimestamp: '1'
            },
            messageAttributes: {},
            md5OfBody: '',
            eventSource: '',
            eventSourceARN: '',
            awsRegion: ''
          },
          {
            messageId: '2',
            receiptHandle: 'handle2',
            body: JSON.stringify({ 
              type: 'tg', 
              bot_token: 'token', 
              chat_id: '123', 
              message: 'test' 
            }),
            attributes: {
              ApproximateReceiveCount: '1',
              SentTimestamp: '1',
              SenderId: '1',
              ApproximateFirstReceiveTimestamp: '1'
            },
            messageAttributes: {},
            md5OfBody: '',
            eventSource: '',
            eventSourceARN: '',
            awsRegion: ''
          }
        ]
      };
      
      const result = await handler(sqsEvent, {} as any);
      
      expect(result).toEqual({
        statusCode: 200,
        body: 'Processing complete'
      });
      expect(mockConsoleInfo).toHaveBeenCalledTimes(4); // Including the event log
      expect(sendTelegramMessage).toHaveBeenCalledTimes(1);
    });

    it('should handle events with no records', async () => {
      const sqsEvent: SQSEvent = {
        Records: []
      };
      
      const result = await handler(sqsEvent, {} as any);
      
      expect(result).toEqual({
        statusCode: 400,
        body: 'No SQS records found'
      });
      expect(mockConsoleError).toHaveBeenCalledWith('No SQS records found in event');
    });

    it('should report failed message IDs when processing fails', async () => {
      // Mock sendTelegramMessage to fail for the second record
      (sendTelegramMessage as jest.Mock).mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Failed to send message'));
      
      const sqsEvent: SQSEvent = {
        Records: [
          {
            messageId: '1',
            receiptHandle: 'handle1',
            body: JSON.stringify({ type: 'noop' }),
            attributes: {
              ApproximateReceiveCount: '1',
              SentTimestamp: '1',
              SenderId: '1',
              ApproximateFirstReceiveTimestamp: '1'
            },
            messageAttributes: {},
            md5OfBody: '',
            eventSource: '',
            eventSourceARN: '',
            awsRegion: ''
          },
          {
            messageId: '2',
            receiptHandle: 'handle2',
            body: JSON.stringify({ 
              type: 'tg', 
              bot_token: 'token', 
              chat_id: '123', 
              message: 'test' 
            }),
            attributes: {
              ApproximateReceiveCount: '1',
              SentTimestamp: '1',
              SenderId: '1',
              ApproximateFirstReceiveTimestamp: '1'
            },
            messageAttributes: {},
            md5OfBody: '',
            eventSource: '',
            eventSourceARN: '',
            awsRegion: ''
          }
        ]
      };
      
      const result = await handler(sqsEvent, {} as any);
      
      expect(result).toEqual({
        batchItemFailures: [{ itemIdentifier: '2' }]
      });
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('Failed to process record 2')
      );
    });
  });
});