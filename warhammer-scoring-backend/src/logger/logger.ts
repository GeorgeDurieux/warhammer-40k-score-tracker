import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import path from 'path'

// Directory where logs will be stored
const logDir = path.join(__dirname, '../logs') 

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`
    })
  ),
  transports: [
    // Console logs
    new transports.Console(),

    // Error logs (monthly rotation)
    new DailyRotateFile({
      dirname: logDir,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM', // monthly
      level: 'error',
      zippedArchive: true, // compress old logs
      maxSize: '20m', // each file max 20MB
      maxFiles: '12m' // keep 12 months
    }),

    // Combined logs (monthly rotation)
    new DailyRotateFile({
      dirname: logDir,
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '12m'
    })
  ]
})

export default logger
