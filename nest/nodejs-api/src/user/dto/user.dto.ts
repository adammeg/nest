import { ApiModelProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

import { IsUnique } from 'common/validations';

import { User } from '../models';

export class UserDto {

    public id: string;

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
    @IsUnique('User')
    public email: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @IsUnique('User')
    @Matches(/^[a-zA-Z0-9 -.]*$/)
    public username: string;

    @ApiModelProperty()
    @IsNotEmpty()
    @MinLength(7)
    @MaxLength(75)
    public password: string;

    public toUser(): User {
        const user = plainToClass(User, this);
        user.plainPassword = this.password;

        return user;
    }
}