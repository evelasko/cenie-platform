# Content Synchronization with Unison

This document describes the bidirectional content synchronization system between the external docs repository and all CENIE application content directories.

## Overview

The sync system uses [Unison](https://www.cis.upenn.edu/~bcpierce/unison/) to maintain bidirectional synchronization between multiple content directories:

### Sync Pairs

| Profile       | External Directory                                | Internal Directory            |
| ------------- | ------------------------------------------------- | ----------------------------- |
| **Hub**       | `../docs/web-content/cenie.org/content`           | `apps/hub/src/contents`       |
| **Academy**   | `../docs/web-content/academy.cenie.org/content`   | `apps/academy/src/contents`   |
| **Agency**    | `../docs/web-content/agency.cenie.org/content`    | `apps/agency/src/contents`    |
| **Editorial** | `../docs/web-content/editorial.cenie.org/content` | `apps/editorial/src/contents` |

All directory pairs maintain identical content, with changes in either location automatically propagating to the other.

## Available Commands

### One-Time Sync Commands

#### Individual Profiles

```bash
npm run sync:once:hub        # Hub content only
npm run sync:once:academy    # Academy content only
npm run sync:once:agency     # Agency content only
npm run sync:once:editorial  # Editorial content only
```

#### Batch Operations

```bash
npm run sync:once:all        # All profiles sequentially
npm run sync:once            # Hub only (legacy compatibility)
```

**Behavior**: Interactive sync with conflict resolution prompts

- Shows all changes before applying them
- Prompts for confirmation on conflicts
- Asks before large deletions
- Logs all operations

### Watch Mode Commands

#### Individual Profile Watching

```bash
npm run sync:watch:hub        # Watch Hub content only
npm run sync:watch:academy    # Watch Academy content only
npm run sync:watch:agency     # Watch Agency content only
npm run sync:watch:editorial  # Watch Editorial content only
```

#### Unified Multi-Profile Watching

```bash
npm run sync:watch:all        # Watch ALL profiles simultaneously
npm run sync:watch            # Hub only (legacy compatibility)
```

**Behavior**: Continuous bidirectional sync

- Runs initial sync automatically for all profiles
- Monitors directories for file changes
- Automatically syncs changes as they occur
- Auto-resolves conflicts by preferring newer files
- Color-coded output by profile
- Press `Ctrl+C` to stop

## Conflict Resolution

### Interactive Mode (`sync:once`)

When conflicts occur during manual sync, you'll see options like:

```bash
file1.md has been updated on both sides
  <M NEWER  file1.md  [f]
Choose: (L)eft, (R)ight, (S)kip, or (?) for help
```

### Automatic Mode (`sync:watch`)

- **Strategy**: Prefer newer files (`prefer = newer`)
- **Logic**: The file with the most recent modification time wins
- **Logging**: All auto-resolutions are logged to `~/.unison/sync-watch.log`

## File Exclusions

The following files are automatically ignored:

### macOS System Files

- `.DS_Store`
- `._.DS_Store`
- `.localized`
- `.Trashes`
- `.fseventsd`
- `.Spotlight-V100`
- `.TemporaryItems`

### Editor Temporary Files

- `*.tmp`
- `*.swp`
- `*~`
- `.#*`

## Configuration Files

### Unison Profile

- **Location**: `~/.unison/cenie-content.prf`
- **Purpose**: Defines sync behavior, exclusions, and conflict resolution
- **Customization**: Edit this file to modify sync behavior

### Log Files

- **Sync Log**: `~/.unison/cenie-content.log`
- **Watch Log**: `~/.unison/sync-watch.log`

## Troubleshooting

### Common Issues

#### "Profile not found" error

```bash
# Ensure the profile exists
ls -la ~/.unison/cenie-content.prf

# If missing, re-run the setup or check the profile path
```

#### Watch mode not detecting changes

```bash
# Check if fswatch is installed
which fswatch

# Install if missing (should already be available)
brew install fswatch
```

#### Sync conflicts

```bash
# Use interactive mode to resolve conflicts manually
npm run sync:once

# Check logs for details
tail -f ~/.unison/cenie-content.log
```

#### Permission issues

```bash
# Ensure directories are readable/writable
ls -la ../docs/web-content/cenie.org/content
ls -la apps/hub/src/contents

# Fix permissions if needed
chmod -R u+rw ../docs/web-content/cenie.org/content
chmod -R u+rw apps/hub/src/contents
```

### Checking Sync Status

```bash
# View recent activity for all profiles
tail -20 ~/.unison/sync-watch-all.log

# View activity for specific profile
tail -20 ~/.unison/sync-watch-academy-content.log

# Check if watch processes are running
ps aux | grep sync-watch

# Manual sync to check for differences
npm run sync:once:all          # Check all profiles
npm run sync:once:editorial    # Check specific profile
```

## Best Practices

### Development Workflow

#### Option 1: Watch All Profiles (Recommended)

```bash
# Start watching all content directories simultaneously
npm run sync:watch:all
```

#### Option 2: Watch Specific Profiles

```bash
# Watch only the profiles you're working on
npm run sync:watch:hub        # Terminal 1
npm run sync:watch:editorial  # Terminal 2 (if needed)
```

#### Option 3: Manual Sync Workflow

```bash
# Sync all profiles before starting work
npm run sync:once:all

# Work on content...

# Sync specific profiles as needed
npm run sync:once:editorial
```

**During Development**:

- Changes are automatically synced in real-time
- Watch for color-coded sync confirmations in terminal
- Each profile has its own color for easy identification
- Press `Ctrl+C` to stop watching

### Content Management

1. **Large Changes**: Use `sync:once` first to review changes
2. **Conflict Prevention**: Avoid editing the same file simultaneously in both locations
3. **Backup**: The sync system maintains archive files, but consider additional backups for important changes

### Monitoring

- **Watch Output**: Keep the sync:watch terminal visible to monitor sync activity
- **Log Files**: Check logs if sync behavior seems unexpected
- **Regular Checks**: Periodically run `sync:once` to verify sync state

## Technical Details

### Architecture

- **File Watcher**: Uses `fswatch` to monitor filesystem changes
- **Sync Engine**: Unison handles the actual file synchronization
- **Conflict Detection**: Based on file modification times and content hashes
- **Change Detection**: Monitors both directories recursively

### Performance

- **Latency**: ~1 second delay between file change and sync
- **Efficiency**: Only changed files are transferred
- **Resource Usage**: Minimal CPU usage during idle periods
- **Multi-Profile Impact**: 4 profiles running simultaneously use ~4x resources, but still lightweight for content files
- **Unified Watching**: Single `fswatch` process monitors all directories efficiently

### Safety Features

- **Confirmation**: Large deletions require confirmation
- **Logging**: All operations are logged with timestamps
- **Atomic Operations**: Sync operations are atomic (all or nothing)
- **Archive System**: Unison maintains sync state archives

## Migration from Previous System

The old `sync-content` script has been replaced with a comprehensive multi-profile system.

### Key Improvements

| Old System             | New System                                      |
| ---------------------- | ----------------------------------------------- |
| Hub only               | **All 4 CENIE apps supported**                  |
| One-way sync           | **Bidirectional sync**                          |
| Manual execution only  | **Automatic watching**                          |
| No conflict resolution | **Interactive & automatic conflict resolution** |
| Basic exclusions       | **Comprehensive exclusion patterns**            |
| No logging             | **Detailed logging per profile**                |
| Single directory       | **Multi-profile with unified watching**         |

### Migration Commands

| Old Command            | New Command Options                                                               |
| ---------------------- | --------------------------------------------------------------------------------- |
| `npm run sync-content` | `npm run sync:once:all` (all profiles)<br>`npm run sync:once:hub` (hub only)      |
| _(no equivalent)_      | `npm run sync:watch:all` (watch all)<br>`npm run sync:watch:hub` (watch hub only) |

### Backward Compatibility

Legacy commands still work for Hub content:

- `npm run sync:once` → Hub content only
- `npm run sync:watch` → Hub content only

## Quick Reference

### Most Common Commands

```bash
# Start development with all content syncing
npm run sync:watch:all

# Sync all content once before starting work
npm run sync:once:all

# Watch specific profile only
npm run sync:watch:editorial

# Check sync status
tail -f ~/.unison/sync-watch-all.log
```

### Profile Names

- `hub` / `cenie-content` - Main CENIE hub content
- `academy` / `academy-content` - CENIE Academy content
- `agency` / `agency-content` - CENIE Agency content
- `editorial` / `editorial-content` - CENIE Editorial content
