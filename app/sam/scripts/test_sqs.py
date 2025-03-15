#!/usr/bin/env python
import boto3
import json
import time
import sys
import os

# Create a local SQS client
# For local testing, we'll use boto3 with localstack-like endpoint
def test_sqs_lambda_locally():
    # Start the Lambda locally in a separate terminal with:
    # sam local start-lambda
    
    # Create a lambda client pointing to the local endpoint
    lambda_client = boto3.client(
        'lambda',
        region_name='us-east-1',
        endpoint_url='http://127.0.0.1:3001',  # Default port for sam local start-lambda
        use_ssl=False,
        verify=False,
        aws_access_key_id='dummy',
        aws_secret_access_key='dummy'
    )
    
    # Test Telegram message event
    tg_event = {
        "Records": [
            {
                "messageId": "19dd0b57-b21e-4ac1-bd88-01bbb068cb78",
                "receiptHandle": "MessageReceiptHandle",
                "body": json.dumps({
                    "type": "tg", 
                    "bot_token": "YOUR_BOT_TOKEN", 
                    "chat_id": "123456789", 
                    "message": "Hello from SQS test script!"
                }),
                "attributes": {
                    "ApproximateReceiveCount": "1",
                    "SentTimestamp": str(int(time.time() * 1000)),
                    "SenderId": "123456789012",
                    "ApproximateFirstReceiveTimestamp": str(int(time.time() * 1000))
                },
                "messageAttributes": {},
                "md5OfBody": "7b270e59b47ff90a553787216d55d91d",
                "eventSource": "aws:sqs",
                "eventSourceARN": "arn:aws:sqs:us-west-2:123456789012:MyQueue",
                "awsRegion": "us-west-2"
            }
        ]
    }
    
    # Test noop event
    noop_event = {
        "Records": [
            {
                "messageId": "544e3695-ec4c-4a85-b1cb-157f74909bda",
                "receiptHandle": "MessageReceiptHandle",
                "body": json.dumps({"type": "noop"}),
                "attributes": {
                    "ApproximateReceiveCount": "1",
                    "SentTimestamp": str(int(time.time() * 1000)),
                    "SenderId": "123456789012",
                    "ApproximateFirstReceiveTimestamp": str(int(time.time() * 1000))
                },
                "messageAttributes": {},
                "md5OfBody": "d751713988987e9331980363e24189ce",
                "eventSource": "aws:sqs",
                "eventSourceARN": "arn:aws:sqs:us-west-2:123456789012:MyQueue",
                "awsRegion": "us-west-2"
            }
        ]
    }
    
    # Invoke the Lambda function with the TG event
    print("Testing with Telegram event...")
    tg_response = lambda_client.invoke(
        FunctionName='ProcessorFunction',
        Payload=json.dumps(tg_event)
    )
    
    tg_payload = json.loads(tg_response['Payload'].read().decode('utf-8'))
    print("TG Response:", tg_payload)
    
    # Invoke with noop event
    print("\nTesting with noop event...")
    noop_response = lambda_client.invoke(
        FunctionName='ProcessorFunction',
        Payload=json.dumps(noop_event)
    )
    
    noop_payload = json.loads(noop_response['Payload'].read().decode('utf-8'))
    print("Noop Response:", noop_payload)

if __name__ == "__main__":
    test_sqs_lambda_locally()