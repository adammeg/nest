import { BadRequestException, Injectable } from '@nestjs/common';
import { Validator, ValidatorOptions } from 'class-validator';

@Injectable()
export class ValidatorService extends Validator {
    /* tslint:disable */
    async validateOrReject(object: Object, options?: ValidatorOptions): Promise<void> {
        try {
            await super.validateOrReject(object);
        } catch (errors) {
            throw new BadRequestException(errors);
        }
    }
}