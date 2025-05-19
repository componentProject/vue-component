/**
 * 日志工具
 * 提供统一的日志记录功能，便于追踪错误和调试
 */

/**
 * 日志级别枚举
 */
export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug'
}

/**
 * 日志条目接口
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
}

/**
 * 日志历史记录
 */
const logHistory: LogEntry[] = [];

/**
 * 是否开启调试模式（生产环境将关闭）
 */
const isDebugMode = process.env.NODE_ENV !== 'production';

/**
 * 格式化日志输出
 * @param entry 日志条目
 * @returns 格式化后的日志字符串
 */
const formatLogEntry = (entry: LogEntry): string => {
  try {
    const timestamp = entry.timestamp.toISOString();
    const dataStr = entry.data ? ` | ${JSON.stringify(entry.data)}` : '';
    return `[${timestamp}] [${entry.level.toUpperCase()}] ${entry.message}${dataStr}`;
  } catch (error) {
    console.error('Error formatting log entry:', error);
    return `[ERROR] Failed to format log entry`;
  }
};

/**
 * 创建日志条目
 * @param level 日志级别
 * @param message 日志消息
 * @param data 附加数据
 * @returns 日志条目对象
 */
const createLogEntry = (level: LogLevel, message: string, data?: any): LogEntry => {
  try {
    const entry = {
      level,
      message,
      data,
      timestamp: new Date()
    };
    logHistory.push(entry);
    
    // 限制历史记录长度，避免内存泄漏
    if (logHistory.length > 1000) {
      logHistory.shift();
    }
    
    return entry;
  } catch (error) {
    console.error('Error creating log entry:', error);
    return {
      level: LogLevel.ERROR,
      message: 'Failed to create log entry',
      timestamp: new Date()
    };
  }
};

/**
 * 记录信息日志
 * @param message 日志消息
 * @param data 附加数据
 */
export const logInfo = (message: string, data?: any): void => {
  try {
    const entry = createLogEntry(LogLevel.INFO, message, data);
    if (isDebugMode) {
      console.info(formatLogEntry(entry));
    }
  } catch (error) {
    console.error('Error logging info:', error);
  }
};

/**
 * 记录警告日志
 * @param message 日志消息
 * @param data 附加数据
 */
export const logWarn = (message: string, data?: any): void => {
  try {
    const entry = createLogEntry(LogLevel.WARN, message, data);
    if (isDebugMode) {
      console.warn(formatLogEntry(entry));
    }
  } catch (error) {
    console.error('Error logging warning:', error);
  }
};

/**
 * 记录错误日志
 * @param message 日志消息
 * @param error 错误对象
 * @param data 附加数据
 */
export const logError = (message: string, error?: any, data?: any): void => {
  try {
    const errorData = error ? { 
      message: error.message, 
      stack: error.stack,
      ...data 
    } : data;
    
    const entry = createLogEntry(LogLevel.ERROR, message, errorData);
    console.error(formatLogEntry(entry));
  } catch (err) {
    console.error('Error logging error:', err);
  }
};

/**
 * 记录调试日志
 * @param message 日志消息
 * @param data 附加数据
 */
export const logDebug = (message: string, data?: any): void => {
  try {
    if (!isDebugMode) return;
    
    const entry = createLogEntry(LogLevel.DEBUG, message, data);
    console.debug(formatLogEntry(entry));
  } catch (error) {
    console.error('Error logging debug:', error);
  }
};

/**
 * 获取日志历史记录
 * @returns 日志历史记录数组
 */
export const getLogHistory = (): LogEntry[] => {
  try {
    return [...logHistory];
  } catch (error) {
    console.error('Error getting log history:', error);
    return [];
  }
};

/**
 * 清除日志历史记录
 */
export const clearLogHistory = (): void => {
  try {
    logHistory.length = 0;
  } catch (error) {
    console.error('Error clearing log history:', error);
  }
}; 