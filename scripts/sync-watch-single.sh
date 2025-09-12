#!/bin/bash

# Single profile bidirectional sync watcher script for CENIE content
# Usage: ./sync-watch-single.sh <profile-name>

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check arguments
if [ $# -ne 1 ]; then
    echo -e "${RED}Error: Profile name required${NC}"
    echo "Usage: $0 <profile-name>"
    echo "Available profiles: cenie-content, academy-content, agency-content, editorial-content"
    exit 1
fi

PROFILE="$1"
LOGFILE="$HOME/.unison/sync-watch-$PROFILE.log"

# Define profile directories
case "$PROFILE" in
    "cenie-content")
        DIR1="../docs/web-content/cenie.org/content"
        DIR2="apps/hub/src/contents"
        DISPLAY_NAME="Hub"
        ;;
    "academy-content")
        DIR1="../docs/web-content/academy.cenie.org/content"
        DIR2="apps/academy/src/contents"
        DISPLAY_NAME="Academy"
        ;;
    "agency-content")
        DIR1="../docs/web-content/agency.cenie.org/content"
        DIR2="apps/agency/src/contents"
        DISPLAY_NAME="Agency"
        ;;
    "editorial-content")
        DIR1="../docs/web-content/editorial.cenie.org/content"
        DIR2="apps/editorial/src/contents"
        DISPLAY_NAME="Editorial"
        ;;
    *)
        echo -e "${RED}Error: Unknown profile '$PROFILE'${NC}"
        echo "Available profiles: cenie-content, academy-content, agency-content, editorial-content"
        exit 1
        ;;
esac

echo -e "${BLUE}CENIE $DISPLAY_NAME Content Sync Watcher${NC}"
echo -e "${BLUE}$(printf '=%.0s' {1..40})${NC}"
echo -e "Profile:    ${YELLOW}$PROFILE${NC}"
echo -e "External:   ${YELLOW}$DIR1${NC}"
echo -e "Internal:   ${YELLOW}$DIR2${NC}"
echo -e "Log file:   ${YELLOW}$LOGFILE${NC}"
echo ""

# Function to run sync
sync_files() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} Change detected, syncing..."
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Sync triggered" >> "$LOGFILE"
    
    if unison "$PROFILE" -batch -auto 2>> "$LOGFILE"; then
        echo -e "${GREEN}[$(date '+%H:%M:%S')]${NC} Sync completed successfully"
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Sync completed successfully" >> "$LOGFILE"
    else
        echo -e "${RED}[$(date '+%H:%M:%S')]${NC} Sync failed - check log: $LOGFILE"
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Sync failed" >> "$LOGFILE"
    fi
    echo ""
}

# Function to handle cleanup
cleanup() {
    echo -e "\n${YELLOW}Stopping $DISPLAY_NAME sync watcher...${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT SIGTERM

# Initial sync
echo -e "${BLUE}Running initial sync...${NC}"
if unison "$PROFILE" -batch -auto 2>> "$LOGFILE"; then
    echo -e "${GREEN}Initial sync completed${NC}"
else
    echo -e "${RED}Initial sync failed - check log: $LOGFILE${NC}"
    exit 1
fi
echo ""

# Start watching both directories
echo -e "${GREEN}Starting file watcher...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""

# Use fswatch to monitor both directories
fswatch -r -l 1 \
    --exclude='\.DS_Store' \
    --exclude='\._.DS_Store' \
    --exclude='\.localized' \
    --exclude='\.Trashes' \
    --exclude='\.fseventsd' \
    --exclude='\.Spotlight-V100' \
    --exclude='\.TemporaryItems' \
    --exclude='.*\.tmp' \
    --exclude='.*\.swp' \
    --exclude='.*~' \
    --exclude='\.#.*' \
    "$DIR1" "$DIR2" | while read file; do
    sync_files
done
