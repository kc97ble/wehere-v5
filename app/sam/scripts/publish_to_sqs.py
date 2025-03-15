#!/usr/bin/env python
import boto3
import json
import argparse
import uuid

def publish_message_to_sqs(queue_url, message_type, bot_token=None, chat_id=None, message=None):
    """
    Publish a message to the SQS queue
    """
    # Create SQS client
    sqs = boto3.client('sqs')
    
    # Create message body based on type
    if message_type == 'noop':
        message_body = {'type': 'noop'}
    elif message_type == 'tg':
        if not all([bot_token, chat_id, message]):
            raise ValueError("For telegram messages, bot_token, chat_id, and message are required")
        
        message_body = {
            'type': 'tg',
            'bot_token': bot_token,
            'chat_id': chat_id,
            'message': message
        }
    else:
        raise ValueError(f"Unknown message type: {message_type}")
    
    # Send message to SQS
    response = sqs.send_message(
        QueueUrl=queue_url,
        MessageBody=json.dumps(message_body),
        MessageDeduplicationId=str(uuid.uuid4()),  # Only needed for FIFO queues
        MessageGroupId='messageGroup1'             # Only needed for FIFO queues
    )
    
    print(f"Message sent! MessageId: {response['MessageId']}")
    return response

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Publish messages to SQS queue')
    parser.add_argument('--queue-url', required=True, help='SQS Queue URL')
    parser.add_argument('--type', required=True, choices=['noop', 'tg'], help='Message type')
    parser.add_argument('--bot-token', help='Telegram bot token (required for tg messages)')
    parser.add_argument('--chat-id', help='Telegram chat ID (required for tg messages)')
    parser.add_argument('--message', help='Message text (required for tg messages)')
    
    args = parser.parse_args()
    
    try:
        publish_message_to_sqs(
            args.queue_url, 
            args.type, 
            args.bot_token, 
            args.chat_id, 
            args.message
        )
    except Exception as e:
        print(f"Error: {str(e)}")