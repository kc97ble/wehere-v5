import * as AWS from 'aws-sdk';

/**
 * Test the SQS to Lambda integration using the local Lambda endpoint
 */
async function testSqsLambdaIntegration() {
  console.log('Testing SQS to Lambda integration locally...');

  // Create a lambda client pointing to the local endpoint
  const lambda = new AWS.Lambda({
    region: 'us-east-1',
    endpoint: 'http://127.0.0.1:3001',
    credentials: new AWS.Credentials({
      accessKeyId: 'dummy',
      secretAccessKey: 'dummy',
    }),
  });

  // Create test events
  
  // Test Telegram message event
  const tgEvent = {
    Records: [
      {
        messageId: '19dd0b57-b21e-4ac1-bd88-01bbb068cb78',
        receiptHandle: 'MessageReceiptHandle',
        body: JSON.stringify({
          type: 'tg', 
          bot_token: 'YOUR_BOT_TOKEN', 
          chat_id: '123456789', 
          message: 'Hello from TypeScript SQS test script!'
        }),
        attributes: {
          ApproximateReceiveCount: '1',
          SentTimestamp: Date.now().toString(),
          SenderId: '123456789012',
          ApproximateFirstReceiveTimestamp: Date.now().toString()
        },
        messageAttributes: {},
        md5OfBody: '7b270e59b47ff90a553787216d55d91d',
        eventSource: 'aws:sqs',
        eventSourceARN: 'arn:aws:sqs:us-west-2:123456789012:MyQueue',
        awsRegion: 'us-west-2'
      }
    ]
  };

  // Test noop event
  const noopEvent = {
    Records: [
      {
        messageId: '544e3695-ec4c-4a85-b1cb-157f74909bda',
        receiptHandle: 'MessageReceiptHandle',
        body: JSON.stringify({ type: 'noop' }),
        attributes: {
          ApproximateReceiveCount: '1',
          SentTimestamp: Date.now().toString(),
          SenderId: '123456789012',
          ApproximateFirstReceiveTimestamp: Date.now().toString()
        },
        messageAttributes: {},
        md5OfBody: 'd751713988987e9331980363e24189ce',
        eventSource: 'aws:sqs',
        eventSourceARN: 'arn:aws:sqs:us-west-2:123456789012:MyQueue',
        awsRegion: 'us-west-2'
      }
    ]
  };

  try {
    // Test Telegram event
    console.log('Testing with Telegram event...');
    const tgResponse = await lambda.invoke({
      FunctionName: 'ProcessorFunction',
      Payload: JSON.stringify(tgEvent)
    }).promise();
    
    const tgPayload = JSON.parse(tgResponse.Payload as string);
    console.log('TG Response:', tgPayload);

    // Test noop event
    console.log('\nTesting with noop event...');
    const noopResponse = await lambda.invoke({
      FunctionName: 'ProcessorFunction',
      Payload: JSON.stringify(noopEvent)
    }).promise();
    
    const noopPayload = JSON.parse(noopResponse.Payload as string);
    console.log('Noop Response:', noopPayload);
    
    console.log('\nTests completed successfully!');
  } catch (error) {
    console.error('Error running tests:', error);
    process.exit(1);
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testSqsLambdaIntegration();
}