#!/bin/bash

# Setup Firebase Environment Variables
# This script helps you configure Firebase environment variables for the CENIE platform

echo "Firebase Environment Setup for CENIE Platform"
echo "============================================="
echo ""
echo "This script will help you set up the required Firebase environment variables."
echo "You'll need to have your Firebase project configuration ready."
echo ""
echo "You can find these values in your Firebase Console:"
echo "1. Go to https://console.firebase.google.com"
echo "2. Select your project"
echo "3. Click the gear icon ⚙️ → Project settings"
echo "4. Scroll down to 'Your apps' section"
echo "5. Select your web app or create one if needed"
echo ""
read -p "Press Enter to continue..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

echo ""
echo "Please enter your Firebase configuration values:"
echo ""

# Client-side configuration
read -p "Firebase API Key: " API_KEY
read -p "Firebase Auth Domain: " AUTH_DOMAIN
read -p "Firebase Project ID: " PROJECT_ID
read -p "Firebase Storage Bucket: " STORAGE_BUCKET
read -p "Firebase Messaging Sender ID: " MESSAGING_SENDER_ID
read -p "Firebase App ID: " APP_ID
read -p "Firebase Measurement ID (optional, press Enter to skip): " MEASUREMENT_ID

echo ""
echo "For server-side operations, you'll need a service account:"
echo "1. Go to Firebase Console → Project settings → Service accounts"
echo "2. Click 'Generate new private key'"
echo "3. Open the downloaded JSON file"
echo ""
read -p "Press Enter when you have the service account JSON ready..."

read -p "Service Account Client Email: " CLIENT_EMAIL
echo "Service Account Private Key (paste the private key, including \\n characters):"
read -p "" PRIVATE_KEY

# Update .env file
echo "" >> .env
echo "# Firebase Configuration (added by setup script)" >> .env
echo "# Client-side (public) configuration" >> .env
echo "NEXT_PUBLIC_FIREBASE_API_KEY=\"$API_KEY\"" >> .env
echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=\"$AUTH_DOMAIN\"" >> .env
echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=\"$PROJECT_ID\"" >> .env
echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=\"$STORAGE_BUCKET\"" >> .env
echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=\"$MESSAGING_SENDER_ID\"" >> .env
echo "NEXT_PUBLIC_FIREBASE_APP_ID=\"$APP_ID\"" >> .env

if [ ! -z "$MEASUREMENT_ID" ]; then
    echo "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=\"$MEASUREMENT_ID\"" >> .env
fi

echo "" >> .env
echo "# Server-side configuration (Firebase Admin SDK)" >> .env
echo "FIREBASE_PROJECT_ID=\"$PROJECT_ID\"" >> .env
echo "FIREBASE_CLIENT_EMAIL=\"$CLIENT_EMAIL\"" >> .env
echo "FIREBASE_PRIVATE_KEY=\"$PRIVATE_KEY\"" >> .env

echo ""
echo "✅ Firebase environment variables have been added to .env"
echo ""
echo "Next steps:"
echo "1. Restart your development server (pnpm dev)"
echo "2. Enable Firestore in Firebase Console if not already enabled"
echo "3. Set up Authentication methods in Firebase Console"
echo ""
echo "To verify your configuration, you can run:"
echo "  pnpm dev --filter=@cenie/hub"
echo "  Then visit http://localhost:3000/api/auth/signup to test the API"