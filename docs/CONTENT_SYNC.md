# Content Synchronization with Unison

This document describes the bidirectional content synchronization system between the external docs repository and the hub contents directory.

## Overview

The sync system uses [Unison](https://www.cis.upenn.edu/~bcpierce/unison/) to maintain bidirectional synchronization between:

- **External Directory**: `../docs/web-content/cenie.org/content`
- **Hub Directory**: `apps/hub/src/contents`

Both directories will always contain identical content, with changes in either location automatically propagating to the other.

## Available Commands

### `npm run sync:once`

Runs a one-time synchronization with interactive conflict resolution.

- **Use case**: Initial sync, manual sync, or when you want to review conflicts
- **Behavior**:
  - Shows all changes before applying them
  - Prompts for confirmation on conflicts
  - Asks before large deletions
  - Logs all operations

```bash
npm run sync:once
```

### `npm run sync:watch`

Starts continuous bidirectional file watching and automatic synchronization.

- **Use case**: During development when you want real-time sync
- **Behavior**:
  - Runs initial sync automatically
  - Monitors both directories for file changes
  - Automatically syncs changes as they occur
  - Auto-resolves conflicts by preferring newer files
  - Runs in foreground with colored output
  - Press `Ctrl+C` to stop

```bash
npm run sync:watch
```

## Conflict Resolution

### Interactive Mode (`sync:once`)

When conflicts occur during manual sync, you'll see options like:

```
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
# View recent sync activity
tail -20 ~/.unison/sync-watch.log

# Check if watch process is running
ps aux | grep sync-watch

# Manual sync to check for differences
npm run sync:once
```

## Best Practices

### Development Workflow

1. **Start Development Session**:

   ```bash
   npm run sync:watch
   ```

2. **Edit Files**: Make changes in either directory
   - Changes are automatically synced
   - Watch for sync confirmations in terminal

3. **End Session**: Press `Ctrl+C` to stop watching

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

### Safety Features

- **Confirmation**: Large deletions require confirmation
- **Logging**: All operations are logged with timestamps
- **Atomic Operations**: Sync operations are atomic (all or nothing)
- **Archive System**: Unison maintains sync state archives

## Migration from Previous System

The old `sync-content` script has been replaced. Key differences:

| Old System             | New System                                      |
| ---------------------- | ----------------------------------------------- |
| One-way sync           | **Bidirectional sync**                          |
| Manual execution only  | **Automatic watching**                          |
| No conflict resolution | **Interactive & automatic conflict resolution** |
| Basic exclusions       | **Comprehensive exclusion patterns**            |
| No logging             | **Detailed logging**                            |

To migrate, simply use the new commands:

- Replace `npm run sync-content` with `npm run sync:once`
- Use `npm run sync:watch` for continuous sync during development
