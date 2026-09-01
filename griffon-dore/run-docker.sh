#!/bin/bash

# Check if container is running
echo "Checking if container is running..."
if [ "$(docker ps -q -f name=griffon-dore)" ]; then
    echo "Container is running. Stopping and removing..."
    docker kill griffon-dore && docker rm griffon-dore
fi

# Build Angular App
echo "Building Angular App..."
npm run build

# build and run
echo "Building and running container..."
docker build -t griffon-dore .
docker run -p 4000:4000 --name griffon-dore -d griffon-dore