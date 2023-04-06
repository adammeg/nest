import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(75)
    @ApiModelProperty()
    public currentPassword: string;

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(75)
    @ApiModelProperty()
    public newPassword: string;   
}
