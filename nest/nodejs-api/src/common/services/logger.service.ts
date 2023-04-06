import { Logger as NestLogger, LoggerService } from '@nestjs/common';

import { config } from '../config';

export class Logger implements LoggerService {
    public log = Logger.log;
    public error = Logger.error;
    public warn = Logger.warn;

    public static log(message): void {
        if (!config.isProdEnv()) {
            NestLogger.log(message, Logger.getContext());
        }
    }

    public static error(message, trace = '') {
        NestLogger.error(message, trace, Logger.getContext());

    }

    public static warn(message) {
        NestLogger.warn(message, Logger.getContext());
    }

    private static getContext(): string {
        const stackLine = new Error().stack.split('\n')[3].trim();
        return stackLine.split('at ')[1].split('.')[0].concat(':', stackLine.split(':')[1]);
    }
}