import winston from 'winston';

const { printf, combine, colorize } = winston.format;

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize({ colors: { info: 'blue', error: 'red' } }),
                printf(info => `[${new Date().toISOString()}] ${info.level}: ${info.message}`),
            ),
        }),
    ],
});

export default logger;
