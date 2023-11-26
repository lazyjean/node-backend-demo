import winston, {transports, format} from "winston";
import {Request, Response, NextFunction} from "express";

const {combine, timestamp, align, printf, colorize} = format

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        colorize({ all: false }),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [new transports.Console()],
});

export const expressMiddlewareLogger = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        logger.info(`[${req.method}] ${req.url}`);
        next();
    }
}
