#!/bin/bash

# Bidirectional sync watcher script for CENIE content
# Uses fswatch to monitor both directories and trigger Unison sync

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directories to watch
DIR1="../docs/web-content/cenie.org/content"
DIR2="apps/hub/src/contents"
PROFILE="cenie-content"

# Log file
LOGFILE="$HOME/.unison/sync-watch.log"

echo -e "${BLUE}CENIE Content Sync Watcher${NC}"
echo -e "${BLUE}===========================${NC}"
echo -e "Watching directories:"
echo -e "  External: ${YELLOW}$DIR1${NC}"
echo -e "  Hub:      ${YELLOW}$DIR2${NC}"
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
    echo -e "\n${YELLOW}Stopping sync watcher...${NC}"
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
# -r = recursive, -l = latency, -e = exclude patterns
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
