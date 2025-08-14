#!/bin/bash

# Deploy Hub app to Vercel with proper monorepo configuration
echo "Deploying Hub app to Vercel..."

# Set the root directory and build settings via environment variables
vercel \
  --prod \
  --yes \
  --scope evelasko-projects \
  --name cenie-hub \
  --build-env ROOT_DIRECTORY="apps/hub" \
  --env ROOT_DIRECTORY="apps/hub" \
  --local-config apps/hub/vercel.json \
  apps/hub