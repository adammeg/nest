import { ApiModelProperty } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { IsBoolean, IsNotEmpty, MaxLength } from 'class-validator';

import { Note } from '../models';

export class NoteDto {

    @ApiModelProperty()
    @IsNotEmpty()
    @MaxLength(250)
    public title: string;

    @ApiModelProperty()
    @IsNotEmpty()
    public body: string;

    @ApiModelProperty()
    @IsBoolean()
    public shared: boolean;

    public toNote(): Note {
        return plainToClass(Note, this);
    }
}