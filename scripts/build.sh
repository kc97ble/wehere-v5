#!/bin/bash

while [ ! -f "yarn.lock" ]; do
  cd ..
  pwd
done

dotenvx run -f .env/dev.env -- yarn workspace web run build
