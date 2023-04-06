import { ApiModelProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiModelProperty()
    public password: string;
}
