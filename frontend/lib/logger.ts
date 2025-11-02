/**
 * Frontend logging utility for Speed-Run application.
 * Provides console logging with colors and file-based logging to localStorage.
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

interface LogEntry {
  timestamp: string
  level: LogLevel
  component: string
  message: string
  data?: any
}

class Logger {
  private static instance: Logger
  private logs: LogEntry[] = []
  private readonly MAX_LOGS = 1000
  private readonly STORAGE_KEY = 'speedrun_frontend_logs'
  private sessionId: string

  // Color codes for console
  private readonly colors = {
    DEBUG: '#6B7280',    // Gray
    INFO: '#10B981',     // Green
    WARN: '#F59E0B',     // Orange
    ERROR: '#EF4444',    // Red
  }

  private readonly emojis = {
    DEBUG: '=',
    INFO: '',
    WARN: ' ',
    ERROR: 'L',
  }

  private constructor() {
    this.sessionId = this.generateSessionId()
    this.loadLogsFromStorage()

    // Log session start
    this.info('Logger', 'Frontend logging session started', { sessionId: this.sessionId })
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private generateSessionId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    return `session_${timestamp}_${random}`
  }

  private loadLogsFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        this.logs = JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to load logs from storage:', error)
    }
  }

  private saveLogsToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      // Keep only the most recent logs
      const recentLogs = this.logs.slice(-this.MAX_LOGS)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentLogs))
    } catch (error) {
      console.warn('Failed to save logs to storage:', error)
    }
  }

  private log(level: LogLevel, component: string, message: string, data?: any): void {
    const timestamp = new Date().toISOString()
    const entry: LogEntry = {
      timestamp,
      level,
      component,
      message,
      data,
    }

    // Add to logs array
    this.logs.push(entry)

    // Save to localStorage
    this.saveLogsToStorage()

    // Console output with colors
    this.consoleLog(entry)
  }

  private consoleLog(entry: LogEntry): void {
    const emoji = this.emojis[entry.level]
    const color = this.colors[entry.level]
    const time = new Date(entry.timestamp).toLocaleTimeString()

    const message = `${emoji} [${entry.level}] ${time} [${entry.component}] ${entry.message}`

    // Use appropriate console method
    switch (entry.level) {
      case 'DEBUG':
        console.debug(`%c${message}`, `color: ${color}`, entry.data || '')
        break
      case 'INFO':
        console.log(`%c${message}`, `color: ${color}`, entry.data || '')
        break
      case 'WARN':
        console.warn(`%c${message}`, `color: ${color}`, entry.data || '')
        break
      case 'ERROR':
        console.error(`%c${message}`, `color: ${color}`, entry.data || '')
        break
    }
  }

  // Public logging methods
  public debug(component: string, message: string, data?: any): void {
    this.log('DEBUG', component, message, data)
  }

  public info(component: string, message: string, data?: any): void {
    this.log('INFO', component, message, data)
  }

  public warn(component: string, message: string, data?: any): void {
    this.log('WARN', component, message, data)
  }

  public error(component: string, message: string, data?: any): void {
    this.log('ERROR', component, message, data)
  }

  // Utility methods
  public getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level)
    }
    return this.logs
  }

  public clearLogs(): void {
    this.logs = []
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY)
    }
    this.info('Logger', 'Logs cleared')
  }

  public downloadLogs(): void {
    if (typeof window === 'undefined') return

    const timestamp = Date.now()
    const logsText = this.logs.map(log =>
      `[${log.timestamp}] [${log.level}] [${log.component}] ${log.message}${log.data ? ' | Data: ' + JSON.stringify(log.data) : ''}`
    ).join('\n')

    const blob = new Blob([logsText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `speedrun-frontend-logs-${timestamp}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    this.info('Logger', 'Logs downloaded')
  }

  public getSessionId(): string {
    return this.sessionId
  }
}

// Export singleton instance
export const logger = Logger.getInstance()

// Export class for testing
export { Logger }
export type { LogLevel, LogEntry }
