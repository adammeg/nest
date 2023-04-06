import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ErrorCodes } from '../errors';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const status = exception.getStatus();

        host.switchToHttp()
            .getResponse()
            .status(status)
            .json({
                statusCode: status,
                status: 'error',
                code: status,
                message: ErrorCodes.STATUS_TEXTS[status] ? ErrorCodes.STATUS_TEXTS[status] : '',
            });
    }
}