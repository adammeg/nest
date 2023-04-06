import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CredentialsDto {
    @ApiModelProperty()
    @IsNotEmpty()
    public _username: string;

    @ApiModelProperty()
    @IsNotEmpty()
    public _password: string;

    get username() {
        return this._username;
    }

    get password() {
        return this._password;
    }
}
