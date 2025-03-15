# SQS Event Processor

A serverless application that processes events from an SQS queue and performs actions based on the event type.

## Features

- SQS queue for receiving events
- Lambda function triggered by SQS messages
- Handles different event types:
  - `noop`: No operation performed
  - `tg`: Sends a Telegram message

## Event Format

Events are JSON objects with a discriminated union pattern:

```json
{
  "type": "noop"|"tg",
  // Additional fields depending on type
}
```

### Telegram Event

```json
{
  "type": "tg",
  "bot_token": "YOUR_BOT_TOKEN",
  "chat_id": "123456789",
  "message": "Message to send"
}
```

## Development

### Prerequisites

- AWS SAM CLI
- Python 3.9
- AWS account and credentials configured

### Local Testing

```bash
# Install dependencies
pip install -r requirements.txt

# Test the function locally with a sample event
sam local invoke ProcessorFunction -e events/sqs-event.json
```

### Deployment

```bash
# Build the application
sam build

# Deploy the application
sam deploy --guided
```
