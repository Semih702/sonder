type LogLevel = "info" | "warn" | "error";

type LogPayload = Record<string, unknown>;

function write(level: LogLevel, message: string, payload: LogPayload = {}) {
  const body = JSON.stringify({
    level,
    message,
    ...payload,
    timestamp: new Date().toISOString()
  });

  if (level === "error") {
    console.error(body);
    return;
  }

  if (level === "warn") {
    console.warn(body);
    return;
  }

  console.info(body);
}

export const logger = {
  info: (message: string, payload?: LogPayload) => write("info", message, payload),
  warn: (message: string, payload?: LogPayload) => write("warn", message, payload),
  error: (message: string, payload?: LogPayload) => write("error", message, payload)
};

