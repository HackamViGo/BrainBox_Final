/**
 * BrainBox V2 Unified Logger
 * Standardizes log format for both Client and Server.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  id: string; // Task ID or Component name
  phase?: string;
}

class Logger {
  private format(level: LogLevel, context: LogContext | string, message: string, data?: any) {
    const ctx = typeof context === 'string' ? { id: context } : context;
    const timestamp = new Date().toISOString();
    
    // In production, this would go to Sentry or a logging service
    const output = {
      timestamp,
      level: level.toUpperCase(),
      context: ctx.id,
      phase: ctx.phase,
      message,
      ...(data && { data }),
    };

    if (level === 'error') {
      console.error(JSON.stringify(output, null, 2));
    } else {
      console.log(JSON.stringify(output, null, 2));
    }
  }

  info(context: LogContext | string, message: string, data?: any) {
    this.format('info', context, message, data);
  }

  warn(context: LogContext | string, message: string, data?: any) {
    this.format('warn', context, message, data);
  }

  error(context: LogContext | string, message: any, data?: any) {
    const errorMsg = message instanceof Error ? message.message : message;
    const errorStack = message instanceof Error ? message.stack : undefined;
    this.format('error', context, errorMsg, { ...data, stack: errorStack });
  }

  debug(context: LogContext | string, message: string, data?: any) {
    if (process.env.NODE_ENV !== 'production') {
      this.format('debug', context, message, data);
    }
  }
}

export const logger = new Logger();
