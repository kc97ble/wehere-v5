# SQS Event Processor (TypeScript)

A serverless application that processes events from an SQS queue and performs actions based on the event type.

## Features

- SQS queue for receiving events
- Lambda function (TypeScript) triggered by SQS messages
- Handles different event types:
  - `noop`: No operation performed
  - `tg`: Sends a Telegram message

## Event Format

Events are JSON objects with a discriminated union pattern:

```typescript
type Event = NoopEvent | TelegramEvent;

interface NoopEvent {
  type: 'noop';
}

interface TelegramEvent {
  type: 'tg';
  bot_token: string;
  chat_id: string;
  message: string;
}
```

## Project Structure

```
.
├── .aws-sam/             # SAM build artifacts (gitignored)
├── dist/                 # Compiled JavaScript (gitignored)
├── events/               # Sample events for local testing
│   └── sqs-event.json    # Sample SQS event
├── scripts/              # Utility scripts
│   ├── publish-to-sqs.ts # Script to publish messages to SQS
│   └── test-sqs.ts       # Script to test SQS to Lambda integration
├── src/                  # Source code
│   ├── app.ts            # Lambda handler
│   ├── telegram.ts       # Telegram API integration
│   └── types.ts          # Type definitions
├── tests/                # Unit tests
│   └── app.test.ts       # Tests for Lambda handler
├── .gitignore            # Git ignore file
├── jest.config.js        # Jest configuration
├── package.json          # Package configuration
├── template.yaml         # SAM template
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Development

### Prerequisites

- Node.js (>= 14.x)
- Yarn
- AWS SAM CLI
- AWS CLI (configured with credentials)

### Setup

```bash
# Install dependencies
yarn install

# Build TypeScript code
yarn build

# Run tests
yarn test
```

### Local Testing

```bash
# Build the SAM application
yarn sam:build

# Test the function locally with a sample event
yarn sam:local

# Start local Lambda endpoint for integration testing
yarn sam:start-lambda

# In another terminal, run the test script
npx ts-node scripts/test-sqs.ts
```

### Testing with AWS Resources

After deployment, you can send messages to your SQS queue to test the full integration:

```bash
# Get the queue URL from the stack outputs
QUEUE_URL=$(aws cloudformation describe-stacks --stack-name sqs-processor --query "Stacks[0].Outputs[?OutputKey=='EventQueue'].OutputValue" --output text)

# Send a noop event
npx ts-node scripts/publish-to-sqs.ts --queue-url $QUEUE_URL --type noop

# Send a Telegram message event
npx ts-node scripts/publish-to-sqs.ts --queue-url $QUEUE_URL --type tg --bot-token YOUR_BOT_TOKEN --chat-id YOUR_CHAT_ID --message "Hello from SQS!"
```

### Deployment

```bash
# Build and deploy
yarn sam:build && yarn sam:deploy
```