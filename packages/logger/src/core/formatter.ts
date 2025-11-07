import chalk from 'chalk'

import { safeJsonStringify } from '../utils/serializer'

import type { LogEntry, LogLevelName } from './types'

/**
 * Color map for log levels
 */
const LEVEL_COLORS: Record<LogLevelName, (text: string) => string> = {
  trace: chalk.gray,
  debug: chalk.cyan,
  info: chalk.green,
  warn: chalk.yellow,
  error: chalk.red,
  fatal: chalk.bgRed.white,
}

/**
 * Format log entry as pretty-printed console output
 */
export function formatPretty(entry: LogEntry): string {
  const { timestamp, level, message, context, error, metadata } = entry

  const colorFn = LEVEL_COLORS[level] || chalk.white
  const levelStr = colorFn(level.toUpperCase().padEnd(5))
  const timeStr = chalk.gray(new Date(timestamp).toISOString())

  let output = `${timeStr} ${levelStr} [${chalk.blue(context.app)}] ${message}`

  // Add request ID if available
  if (context.requestId) {
    output += chalk.gray(` (${context.requestId.substring(0, 8)})`)
  }

  // Add metadata if present
  if (metadata && Object.keys(metadata).length > 0) {
    output += '\n' + chalk.gray(safeJsonStringify(metadata, 2))
  }

  // Add error details if present
  if (error) {
    output += '\n' + formatError(error)
  }

  return output
}

/**
 * Format log entry as JSON
 */
export function formatJson(entry: LogEntry): string {
  return safeJsonStringify(entry)
}

/**
 * Format error for pretty printing
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatError(error: any): string {
  let output = chalk.red(`  ${error.name}: ${error.message}`)

  if (error.code) {
    output += chalk.gray(` [${error.code}]`)
  }

  if (error.stack) {
    // Format stack trace with indentation
    const stackLines = error.stack.split('\n').slice(1) // Skip first line (already shown)
    output += '\n' + stackLines.map((line: string) => chalk.gray('    ' + line.trim())).join('\n')
  }

  if (error.cause) {
    output += '\n' + chalk.gray('  Caused by:')
    output += '\n' + formatError(error.cause)
  }

  return output
}

/**
 * Format log entry based on environment
 */
export function formatLog(entry: LogEntry, prettyPrint: boolean): string {
  return prettyPrint ? formatPretty(entry) : formatJson(entry)
}
