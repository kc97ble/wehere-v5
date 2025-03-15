import json
import unittest
from unittest.mock import patch, MagicMock

import sys
import os

# Add lambda source directory to path
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(__file__))))

from lambda_function.src.app import lambda_handler, process_event, process_tg_event


class TestApp(unittest.TestCase):
    def test_process_noop_event(self):
        # Test that noop event is handled correctly
        with patch('lambda_function.src.app.logger') as mock_logger:
            event = {"type": "noop"}
            process_event(event)
            mock_logger.info.assert_called_with("Received noop event, doing nothing")

    @patch('lambda_function.src.app.requests.post')
    def test_process_tg_event(self, mock_post):
        # Setup mock response
        mock_response = MagicMock()
        mock_response.raise_for_status.return_value = None
        mock_post.return_value = mock_response

        # Test successful Telegram message
        with patch('lambda_function.src.app.logger') as mock_logger:
            event = {
                "type": "tg",
                "bot_token": "test_token",
                "chat_id": "123456",
                "message": "Hello, world!"
            }
            process_tg_event(event)
            
            # Check if requests.post was called with correct arguments
            mock_post.assert_called_once()
            call_args = mock_post.call_args[0][0]
            self.assertEqual(call_args, "https://api.telegram.org/bottest_token/sendMessage")
            
            # Check payload
            payload = mock_post.call_args[1]['json']
            self.assertEqual(payload["chat_id"], "123456")
            self.assertEqual(payload["text"], "Hello, world!")
            self.assertEqual(payload["parse_mode"], "HTML")
            
            # Check logger
            mock_logger.info.assert_called_with("Successfully sent Telegram message to 123456")

    def test_lambda_handler(self):
        # Test that lambda handler processes events correctly
        with patch('lambda_function.src.app.process_event') as mock_process_event:
            event = {
                "Records": [
                    {
                        "body": json.dumps({"type": "noop"})
                    },
                    {
                        "body": json.dumps({"type": "tg", "bot_token": "token", "chat_id": "123", "message": "test"})
                    }
                ]
            }
            
            response = lambda_handler(event, {})
            
            # Check that process_event was called twice (once for each record)
            self.assertEqual(mock_process_event.call_count, 2)
            
            # Check response
            self.assertEqual(response["statusCode"], 200)
            self.assertEqual(response["body"], "Processing complete")


if __name__ == '__main__':
    unittest.main()