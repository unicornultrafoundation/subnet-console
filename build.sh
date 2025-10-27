#!/bin/sh

# Exit on error
set -e

# Get version from package.json
VERSION=1.0.3

# Define Docker image name (adjust this to match your Docker registry/repository)
IMAGE_NAME="depinnode/subnet-console"

# Build the Docker image
docker build -t "$IMAGE_NAME:$VERSION" .

# Tag the latest version (optional)
docker tag "$IMAGE_NAME:$VERSION" "$IMAGE_NAME:latest"

# Push the versioned image
docker push "$IMAGE_NAME:$VERSION"

# Push the 'latest' tag (optional)
docker push "$IMAGE_NAME:latest"

echo "Docker image $IMAGE_NAME:$VERSION and $IMAGE_NAME:latest pushed successfully."
