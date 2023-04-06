import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
    @IsNotEmpty()
    @ApiModelProperty()
    public refreshToken: string;
}
