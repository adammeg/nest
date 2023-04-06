import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { forIn } from 'lodash';

import { ApiException } from '../errors';

@Catch(ApiException)
export class ApiExceptionFilter implements ExceptionFilter {
    catch(exception: ApiException, host: ArgumentsHost) {
        host.switchToHttp()
            .getResponse()
            .status(exception.getStatus())
            .json({
                statusCode: exception.getStatus(),
                status: 'error',
                code: exception.code,
                message: exception.message,
                data: exception.data.length ? exception.data : undefined,
            });
    }
}
