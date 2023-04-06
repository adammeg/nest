import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class EditProfileDto {    
    @ApiModelProperty()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(75)
    public firstName: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(75)
    public lastName: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @IsEmail()
    public email: string;
}