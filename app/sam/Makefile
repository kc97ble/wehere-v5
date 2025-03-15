.PHONY: build test clean deploy local

# Project variables
STACK_NAME ?= sqs-processor
REGION ?= us-east-1
PYTHON := python
PIP := pip

# Setup venv
venv:
	$(PYTHON) -m venv .venv
	source .venv/bin/activate && \
	$(PIP) install -r lambda_function/requirements.txt && \
	$(PIP) install -U aws-sam-cli pytest pytest-mock coverage

# Install dependencies
install:
	$(PIP) install -r lambda_function/requirements.txt
	$(PIP) install -U pytest pytest-mock coverage

# Build the SAM application
build:
	sam build

# Run unit tests
test:
	PYTHONPATH=. pytest -v tests/

# Run with test coverage
coverage:
	PYTHONPATH=. coverage run -m pytest tests/
	coverage report
	coverage html

# Deploy the application to AWS
deploy:
	sam deploy --stack-name $(STACK_NAME) --region $(REGION) --guided

# Invoke function locally
local:
	sam local invoke ProcessorFunction -e events/sqs-event.json

# Clean build artifacts
clean:
	rm -rf .aws-sam
	rm -rf htmlcov
	rm -rf .pytest_cache
	rm -rf .coverage
	find . -type d -name __pycache__ -exec rm -rf {} +