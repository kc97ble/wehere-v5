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

## Project Structure

```
.
├── .venv/                      # Python virtual environment (gitignored)
├── .aws-sam/                   # SAM build artifacts (gitignored)
├── events/                     # Sample events for local testing
│   └── sqs-event.json          # Sample SQS event
├── lambda_function/            # Lambda function code
│   ├── requirements.txt        # Python dependencies
│   └── src/                    # Source code
│       └── app.py              # Lambda handler
├── tests/                      # Unit tests
│   └── test_app.py             # Test cases for Lambda handler
├── Makefile                    # Project automation
├── template.yaml               # SAM template
└── README.md                   # This file
```

## Development

### Prerequisites

- AWS SAM CLI
- Python 3.9
- AWS account and credentials configured

### Setup Environment

```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install development dependencies
pip install -r lambda_function/requirements.txt
pip install aws-sam-cli
```

### Local Testing

```bash
# Build the application
sam build

# Test the function locally with a sample event
sam local invoke ProcessorFunction -e events/sqs-event.json
```

### Testing SQS Integration Locally

You can test the SQS to Lambda integration using the provided scripts:

1. **Start a local Lambda endpoint in one terminal**:

```bash
sam local start-lambda
```

2. **Run the test script in another terminal**:

```bash
# Make sure boto3 is installed
pip install boto3

# Run the test script
python scripts/test_sqs.py
```

### Testing with AWS Resources

After deployment, you can send messages to your SQS queue to test the full integration:

```bash
# Get the queue URL from the stack outputs (after deployment)
QUEUE_URL=$(aws cloudformation describe-stacks --stack-name sqs-processor --query "Stacks[0].Outputs[?OutputKey=='EventQueue'].OutputValue" --output text)

# Send a noop event
python scripts/publish_to_sqs.py --queue-url $QUEUE_URL --type noop

# Send a Telegram message event
python scripts/publish_to_sqs.py --queue-url $QUEUE_URL --type tg --bot-token YOUR_BOT_TOKEN --chat-id YOUR_CHAT_ID --message "Hello from SQS!"
```

### Deployment

```bash
# Build the application
sam build

# Deploy the application
sam deploy --guided
```
