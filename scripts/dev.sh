#!/bin/bash

while [ ! -f "yarn.lock" ]; do
    cd ..
    pwd
done

commands=(
    "dotenvx run -f .env/dev.env -- yarn workspace cli run start-bot"
    "yarn workspace web run dev"
)

concurrently "${commands[@]}"
