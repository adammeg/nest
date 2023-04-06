import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { IsEntity } from 'common/validations';

export class ForgotPasswordDto {
    @IsNotEmpty()
    @IsEntity('User', 'email')
    @ApiModelProperty()
    public email: string;
}
