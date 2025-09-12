#!/bin/bash

# Unified bidirectional sync watcher script for all CENIE content
# Uses fswatch to monitor all directories and trigger appropriate Unison sync
# Compatible with bash 3.2+ (macOS default)

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Profile definitions (using arrays instead of associative arrays for bash 3.2 compatibility)
PROFILES=(
    "cenie-content"
    "academy-content" 
    "agency-content"
    "editorial-content"
)

PROFILE_DIRS=(
    "../docs/web-content/cenie.org/content,apps/hub/src/contents"
    "../docs/web-content/academy.cenie.org/content,apps/academy/src/contents"
    "../docs/web-content/agency.cenie.org/content,apps/agency/src/contents"
    "../docs/web-content/editorial.cenie.org/content,apps/editorial/src/contents"
)

PROFILE_COLORS=(
    "${BLUE}"
    "${GREEN}"
    "${MAGENTA}"
    "${CYAN}"
)

# Log file
LOGFILE="$HOME/.unison/sync-watch-all.log"

echo -e "${YELLOW}CENIE Multi-Profile Content Sync Watcher${NC}"
echo -e "${YELLOW}==========================================${NC}"
echo ""

# Function to get profile index from directory path
get_profile_from_path() {
    local changed_path="$1"
    local i=0
    
    for profile in "${PROFILES[@]}"; do
        IFS=',' read -r external internal <<< "${PROFILE_DIRS[$i]}"
        
        # Convert relative paths to absolute for comparison
        if [ -d "$external" ] && [ -d "$internal" ]; then
            external_abs=$(cd "$(dirname "$external")" && pwd)/$(basename "$external")
            internal_abs=$(cd "$(dirname "$internal")" && pwd)/$(basename "$internal")
            
            if [[ "$changed_path" == "$external_abs"* ]] || [[ "$changed_path" == "$internal_abs"* ]]; then
                echo "$i"
                return 0
            fi
        fi
        
        i=$((i + 1))
    done
    echo "-1"
}

# Function to run sync for a specific profile
sync_profile() {
    local profile_index="$1"
    local profile="${PROFILES[$profile_index]}"
    local color="${PROFILE_COLORS[$profile_index]}"
    local timestamp=$(date '+%H:%M:%S')
    
    echo -e "${color}[$timestamp]${NC} ${profile}: Change detected, syncing..."
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $profile: Sync triggered" >> "$LOGFILE"
    
    if unison "$profile" -batch -auto 2>> "$LOGFILE"; then
        echo -e "${color}[$timestamp]${NC} ${profile}: ${GREEN}Sync completed successfully${NC}"
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] $profile: Sync completed successfully" >> "$LOGFILE"
    else
        echo -e "${color}[$timestamp]${NC} ${profile}: ${RED}Sync failed${NC} - check log: $LOGFILE"
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] $profile: Sync failed" >> "$LOGFILE"
    fi
    echo ""
}

# Function to handle cleanup
cleanup() {
    echo -e "\n${YELLOW}Stopping multi-profile sync watcher...${NC}"
    exit 0
}

# Trap Ctrl+C
trap cleanup SIGINT SIGTERM

# Display profiles and directories
echo "Monitoring profiles:"
for i in "${!PROFILES[@]}"; do
    profile="${PROFILES[$i]}"
    IFS=',' read -r external internal <<< "${PROFILE_DIRS[$i]}"
    color="${PROFILE_COLORS[$i]}"
    echo -e "  ${color}$profile${NC}:"
    echo -e "    External: ${YELLOW}$external${NC}"
    echo -e "    Internal: ${YELLOW}$internal${NC}"
done
echo -e "Log file: ${YELLOW}$LOGFILE${NC}"
echo ""

# Initial sync for all profiles
echo -e "${BLUE}Running initial sync for all profiles...${NC}"
for i in "${!PROFILES[@]}"; do
    profile="${PROFILES[$i]}"
    color="${PROFILE_COLORS[$i]}"
    echo -e "${color}Syncing $profile...${NC}"
    if unison "$profile" -batch -auto 2>> "$LOGFILE"; then
        echo -e "${color}$profile: ${GREEN}Initial sync completed${NC}"
    else
        echo -e "${color}$profile: ${RED}Initial sync failed${NC} - check log: $LOGFILE"
    fi
done
echo ""

# Collect all directories to watch
WATCH_DIRS=()
for i in "${!PROFILES[@]}"; do
    IFS=',' read -r external internal <<< "${PROFILE_DIRS[$i]}"
    if [ -d "$external" ]; then
        WATCH_DIRS+=("$external")
    fi
    if [ -d "$internal" ]; then
        WATCH_DIRS+=("$internal")
    fi
done

# Start watching all directories
echo -e "${GREEN}Starting unified file watcher for all profiles...${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop${NC}"
echo ""

# Use fswatch to monitor all directories
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
    "${WATCH_DIRS[@]}" | while read changed_path; do
    
    # Determine which profile to sync based on the changed path
    profile_index=$(get_profile_from_path "$changed_path")
    
    if [ "$profile_index" -ge 0 ]; then
        sync_profile "$profile_index"
    else
        echo -e "${RED}[$(date '+%H:%M:%S')]${NC} Warning: Could not determine profile for: $changed_path"
    fi
done