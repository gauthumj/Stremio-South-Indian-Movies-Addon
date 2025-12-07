// Simple structured logger with LOG_LEVEL control
const LOG_LEVEL = (process.env.LOG_LEVEL || "info").toLowerCase();
const levels = { error: 0, warn: 1, info: 2, debug: 3 };

function shouldLog(level) {
  return (levels[level] || 0) <= (levels[LOG_LEVEL] || 2);
}

function formatMessage(level, message, meta) {
  const ts = new Date().toISOString();
  let out = `[${ts}] ${level.toUpperCase()}: ${message}`;
  if (meta !== undefined) {
    try {
      const serialized = typeof meta === "string" ? meta : JSON.stringify(meta);
      out += ` ${serialized}`;
    } catch (e) {
      out += ` [unserializable meta]`;
    }
  }
  return out;
}

function debug(message, meta) {
  if (shouldLog("debug")) console.debug(formatMessage("debug", message, meta));
}
function info(message, meta) {
  if (shouldLog("info")) console.log(formatMessage("info", message, meta));
}
function warn(message, meta) {
  if (shouldLog("warn")) console.warn(formatMessage("warn", message, meta));
}
function error(message, meta) {
  if (shouldLog("error")) console.error(formatMessage("error", message, meta));
}

module.exports = {
  debug,
  info,
  warn,
  error,
};
