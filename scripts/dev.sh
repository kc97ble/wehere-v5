#!/bin/bash

while [ ! -f "yarn.lock" ]; do
    cd ..
    pwd
done

commands=(
    "dotenvx run -f .env/dev.env -- yarn workspace cli run start-bot"
    "PORT=5120 dotenvx run -f .env/dev.env -- yarn workspace web run dev"
)

concurrently "${commands[@]}"
