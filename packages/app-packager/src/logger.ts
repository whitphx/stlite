/**
 * Minimal structured-logging interface app-packager calls into. The desktop
 * bin wraps its winston instance in this shape; the CLI uses the console
 * default below. Keeping the interface tiny so consumers don't need to drag
 * in winston.
 */
export interface Logger {
  debug: (message: string, ...meta: unknown[]) => void;
  info: (message: string, ...meta: unknown[]) => void;
  warn: (message: string, ...meta: unknown[]) => void;
  error: (message: string, ...meta: unknown[]) => void;
}

export const consoleLogger: Logger = {
  debug: (msg, ...meta) => console.debug(msg, ...meta),
  info: (msg, ...meta) => console.info(msg, ...meta),
  warn: (msg, ...meta) => console.warn(msg, ...meta),
  error: (msg, ...meta) => console.error(msg, ...meta),
};
