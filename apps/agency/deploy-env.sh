#!/bin/bash

#> Load Root .env Variables

# Check if root .env file exists
if [ ! -f ../../.env ]; then
    echo "Error: root .env file not found in current directory"
    exit 1
fi

# Read .env file and add each variable to Vercel production environment
while IFS= read -r line; do
    # Skip empty lines and comments
    if [[ -n "$line" && ! "$line" =~ ^[[:space:]]*# ]]; then
        # Extract variable name and value
        name=$(echo "$line" | cut -d'=' -f1)
        value=$(echo "$line" | cut -d'=' -f2-)
        
        # Remove quotes if present
        value=$(echo "$value" | sed 's/^"//;s/"$//;s/^'"'"'//;s/'"'"'$//')
        
        echo "Adding $name to production environment..."
        echo "$value" | vercel env add "$name" production --force
    fi
done < ../../.env

#> Load Local .env.local Variables

# Check if local .env.local file exists
if [ ! -f .env.local ]; then
    echo "Error: local .env.local file not found in current directory"
    exit 1
fi

# Read .env file and add each variable to Vercel production environment
while IFS= read -r line; do
    # Skip empty lines and comments
    if [[ -n "$line" && ! "$line" =~ ^[[:space:]]*# ]]; then
        # Extract variable name and value
        name=$(echo "$line" | cut -d'=' -f1)
        value=$(echo "$line" | cut -d'=' -f2-)
        
        # Remove quotes if present
        value=$(echo "$value" | sed 's/^"//;s/"$//;s/^'"'"'//;s/'"'"'$//')
        
        echo "Adding $name to production environment..."
        echo "$value" | vercel env add "$name" production --force
    fi
done < .env.local

echo "Environment variables deployment completed!"