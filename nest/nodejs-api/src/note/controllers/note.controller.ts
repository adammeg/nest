import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

import { CurrentUser } from 'common/decorators';
import { ApiException, ErrorCodes } from 'common/errors';
import { Logger } from 'common/services';
import { NoteDto } from 'note/dto';
import { RolesGuard } from 'user/guards';
import { User } from 'user/models';
import { Note } from '../models';
import { NotesFilter } from '../notes.filter';
import { NoteService } from '../services';

@ApiBearerAuth()
@ApiUseTags('Note')
@UseGuards(RolesGuard)
@Controller('notes')
export class NoteController {

    /**
     * Note controller constructor
     * 
     * @param {Logger} logger 
     * @param {NoteService} noteService 
     */
    constructor(private logger: Logger, private noteService: NoteService) {
    }

    /**
     * Get notes controller
     * 
     * @param {User} user 
     * @param {NotesFilter} filter 
     * @returns {Note[]}
     */
    @Get()
    public async all(@CurrentUser() user: User, @Query() filter: NotesFilter): Promise<{ notes: Note[], totalCount: number, totalPages: number }> {
        this.logger.log('Load notes');

        filter.user = user;

        return await this.noteService.findNotes(filter);
    }

    /**
     * Get note controller
     * 
     * @param {User} user 
     * @param {number} id 
     * @returns {Promise<{ note: Note }>}
     */
    @Get(':id')
    public async one(@CurrentUser() user: User, @Param('id') id: number): Promise<{ note: Note }> {
        this.logger.log('Load note by id: ' + id);

        const note = await this.noteService.findNote(id);

        if (note === undefined) {
            throw new ApiException(ErrorCodes.NOTE_NOT_FOUND);
        }

        if (!note.shared && note.author.id !== user.id) {
            throw new ApiException(ErrorCodes.DENIED_VIEW_NOTE);
        }

        return { note };
    }

    /**
     * Create note controller
     * 
     * @param {NoteDto} noteDto 
     * @param {User} user 
     * @returns {Promise<Note>}
     */
    @Post()
    public async create(@Body() noteDto: NoteDto, @CurrentUser() user: User): Promise<{ note: Note }> {
        this.logger.log('post note');

        const note = await this.noteService.createNote(noteDto.toNote(), user)

        return { note };
    }

    /**
     * Edit note controller
     * 
     * @param {User} user 
     * @param {NoteDto} noteDto 
     * @param {number} id 
     * @returns {Promise<{ note: Note | any }}
     */
    @Put(':id')
    public async update(@CurrentUser() user: User, @Body() noteDto: NoteDto, @Param('id') id: number): Promise<{ note: Note }> {
        this.logger.log('put note: ' + id);

        const oldNote = await this.noteService.findNote(id)

        if (oldNote === undefined) {
            throw new ApiException(ErrorCodes.NOTE_NOT_FOUND);
        }

        if (oldNote.author.id !== user.id && !user.isAdmin(user.roles)) {
            throw new ApiException(ErrorCodes.DENIED_EDIT_NOTE);
        }

        const note = await this.noteService.updateNote(noteDto.toNote(), oldNote)

        return { note }

    }

    /**
     * Delete note controller
     * 
     * @param {User} user 
     * @param {number} id 
     * @returns {Promise<Response>}
     */
    @Delete(':id')
    public async delete(@CurrentUser() user: User, @Param('id') id: number): Promise<Response> {
        this.logger.log('Delete note: ' + id);

        const note = await this.noteService.findNote(id)

        if (note === undefined) {
            throw new ApiException(ErrorCodes.NOTE_NOT_FOUND);
        }

        if (note.author.id !== user.id && !user.isAdmin(user.roles)) {
            throw new ApiException(ErrorCodes.DENIED_EDIT_NOTE);
        }

        return await this.noteService.deleteNote(id)
    }

}