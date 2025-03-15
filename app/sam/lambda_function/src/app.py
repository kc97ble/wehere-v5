import json
import logging
import requests
from typing import Dict, Any, List

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def process_tg_event(event: Dict[str, Any]) -> None:
    """
    Process a Telegram event by sending a message
    """
    bot_token = event.get("bot_token")
    chat_id = event.get("chat_id")
    message = event.get("message")
    
    if not all([bot_token, chat_id, message]):
        logger.error("Missing required fields for Telegram message")
        return
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML"
    }
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        logger.info(f"Successfully sent Telegram message to {chat_id}")
    except Exception as e:
        logger.error(f"Failed to send Telegram message: {str(e)}")

def process_event(event: Dict[str, Any]) -> None:
    """
    Process an event based on its type
    """
    event_type = event.get("type")
    
    if event_type == "noop":
        logger.info("Received noop event, doing nothing")
        return
    
    if event_type == "tg":
        logger.info("Processing Telegram event")
        process_tg_event(event)
        return
    
    logger.warning(f"Unknown event type: {event_type}")

def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda handler for processing SQS events
    """
    logger.info(f"Received event: {json.dumps(event)}")
    
    if "Records" not in event:
        logger.error("No SQS records found in event")
        return {"statusCode": 400, "body": "No SQS records found"}
    
    for record in event["Records"]:
        try:
            body = json.loads(record["body"])
            process_event(body)
        except json.JSONDecodeError:
            logger.error(f"Failed to parse SQS message body: {record['body']}")
        except Exception as e:
            logger.error(f"Error processing event: {str(e)}")
    
    return {"statusCode": 200, "body": "Processing complete"}
