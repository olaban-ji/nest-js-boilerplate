import winston from 'winston';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import util from 'util';

dayjs.extend(utc);

export function createWinstonLogger(): winston.Logger {
  return winston.createLogger({
    level: 'silly',
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.colorize({ all: true }),
          winston.format.metadata({
            fillExcept: ['timestamp', 'level', 'message', 'label'],
          }),
          winston.format.printf(({ timestamp, level, message, metadata }) => {
            const utcTimeStamp = dayjs(timestamp as string)
              .utc()
              .format();

            const metaString = Object.keys(metadata).length
              ? `\n${util.inspect(metadata, { colors: true, depth: 5 })}`
              : '';

            return `${utcTimeStamp} [${level}]: ${message} ${metaString}`;
          }),
        ),
      }),
    ],
  });
}
