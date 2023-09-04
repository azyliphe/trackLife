import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

const LOG_FORMAT = winston.format.combine(
	winston.format.timestamp({
		format: 'YYYY-MM-DD HH:mm:ss'
	}),
	winston.format.printf(({ timestamp, level, message }) => {
		return `${timestamp} [${level.toUpperCase()}] [${process.pid}] ${message}`;
	})
);

const logger = winston.createLogger({
	level: 'info',
	transports: [
		//Scrivi i log su file
		new DailyRotateFile({
			filename: path.join(process.env.LOG_FILE_PATH, 'trackLife-%DATE%.log'),
			datePattern: 'YYYY_MM',
			zippedArchive: true,
			maxSize: '20m',
			maxFiles: '31d',
			format: LOG_FORMAT
		}),
		//Scrivi i log su console in dev
		new winston.transports.Console({
			format: LOG_FORMAT,
			level: 'debug',
		}),
	],
});

//Restituisci l'ultimo file di log nel messaggio di risposta
logger.getLastLogFile = () => {
	const files = fs.readdirSync(process.env.LOG_FILE_PATH);
	const lastFile = files.filter(file => path.extname(file) === '.log').sort().reverse()[0];
	return lastFile;
}

export default logger;