import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { forIn } from 'lodash';

import { ErrorCodes } from '../errors';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const errors = {};

        const validationErrors = exception.message.message;

        if (validationErrors !== undefined) {
            validationErrors.forEach((validationError: ValidationError) => {
                forIn(validationError.constraints, (value, key) => {
                    // Get one message
                    errors[validationError.property] = value;
                    // TODO Embedded objects
                });
            });
        }

        response
            .status(status)
            .json({
                statusCode: status,
                status: 'error',
                code: ErrorCodes.FAILED_DATA_VALIDATION,
                data: {errors},
            });
    }
}
