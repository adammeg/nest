import { HttpException } from '@nestjs/common';

import { ErrorCodes } from './error-codes';

export class ApiException extends HttpException {

    constructor(public code: number, public data: any[] = [], status: string = 'error') {
        super(ErrorCodes.STATUS_TEXTS[code], +code.toString().substring(0, 3));
    }
}
