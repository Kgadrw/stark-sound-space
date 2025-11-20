import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a URL-safe slug from a title
 */
export const createSlug = (title: string): string => {
  return encodeURIComponent(
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  );
};

/**
 * Sanitizes error messages to hide sensitive data
 */
export const sanitizeError = (error: unknown): string => {
  if (error instanceof Error) {
    const message = error.message;
    // Hide API endpoints, IDs, tokens, etc.
    return message
      .replace(/\/api\/[^\s]+/g, '/api/***')
      .replace(/\/admin\/[^\s]+/g, '/admin/***')
      .replace(/[a-f0-9]{24}/gi, '***') // MongoDB IDs
      .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '***') // UUIDs
      .replace(/token=[^\s&]+/gi, 'token=***')
      .replace(/key=[^\s&]+/gi, 'key=***')
      .replace(/api_key=[^\s&]+/gi, 'api_key=***');
  }
  return 'An error occurred';
};

/**
 * Sanitizes console logs to hide sensitive data
 */
export const safeConsole = {
  log: (...args: unknown[]) => {
    if (process.env.NODE_ENV === 'development') {
      const sanitized = args.map(arg => {
        if (typeof arg === 'string') {
          return arg
            .replace(/\/api\/[^\s]+/g, '/api/***')
            .replace(/\/admin\/[^\s]+/g, '/admin/***')
            .replace(/[a-f0-9]{24}/gi, '***')
            .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '***');
        }
        if (arg && typeof arg === 'object') {
          try {
            const str = JSON.stringify(arg);
            return JSON.parse(str
              .replace(/\/api\/[^"]+/g, '/api/***')
              .replace(/\/admin\/[^"]+/g, '/admin/***')
              .replace(/[a-f0-9]{24}/gi, '***')
              .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '***'));
          } catch {
            return arg;
          }
        }
        return arg;
      });
      console.log(...sanitized);
    }
  },
  error: (...args: unknown[]) => {
    const sanitized = args.map(arg => {
      if (arg instanceof Error) {
        return new Error(sanitizeError(arg));
      }
      if (typeof arg === 'string') {
        return arg
          .replace(/\/api\/[^\s]+/g, '/api/***')
          .replace(/\/admin\/[^\s]+/g, '/admin/***')
          .replace(/[a-f0-9]{24}/gi, '***')
          .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '***');
      }
      return arg;
    });
    console.error(...sanitized);
  },
  warn: (...args: unknown[]) => {
    const sanitized = args.map(arg => {
      if (typeof arg === 'string') {
        return arg
          .replace(/\/api\/[^\s]+/g, '/api/***')
          .replace(/\/admin\/[^\s]+/g, '/admin/***')
          .replace(/[a-f0-9]{24}/gi, '***')
          .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '***');
      }
      return arg;
    });
    console.warn(...sanitized);
  },
};
