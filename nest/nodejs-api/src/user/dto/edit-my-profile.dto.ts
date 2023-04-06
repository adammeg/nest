import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { EditProfileDto } from './edit-profile.dto';

export class EditMyProfileDto extends EditProfileDto {    
    @ApiModelProperty()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(75)
    public currentPassword: string;
}