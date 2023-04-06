import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from 'common/services';
import { User } from 'user/models';
import { Note } from '../models';
import { NotesFilter } from '../notes.filter';
import { NoteRepository } from '../repositories';

@Injectable()
export class NoteService {

    /**
     * Note service constructor
     * 
     * @param {NoteRepository} noteRepository 
     * @param {Logger} logger 
     */
    constructor(@InjectRepository(NoteRepository)
    private noteRepository: NoteRepository,
        private logger: Logger) {
    }

    /**
     * Find note service
     * 
     * @param id 
     * @returns {Promise<Note | undefined>}
     */
    public findNote(id: number): Promise<Note | undefined> {
        this.logger.log('Find note by id: ' + id);

        return this.noteRepository.findOne({ id });
    }

    /**
     * Find notes service
     * 
     * @param {NotesFilter} filter 
     * @returns {Promise<Note[]>}
     */
    public async findNotes(filter: NotesFilter): Promise<{ notes: Note[], totalCount: number, totalPages: number }> {
        this.logger.log('Find notes');

        const notes = await this.noteRepository.findNotesWithFilterQueryBuilder(filter)
        const totalCount = await this.noteRepository.findNotesQueryBuilder(filter).getCount()

        return { notes, totalCount, totalPages: Math.ceil(totalCount / filter.limit) };
    }

    /**
     * Create note service
     * 
     * @param {Note} note 
     * @param {User} user 
     * @returns {Promise<Note>}
     */
    public async createNote(newNote: Note, user: User): Promise<Note> {
        this.logger.log('create note');

        const note = new Note()

        const { title, body, shared } = newNote;

        note.title = title;
        note.body = body;
        note.shared = shared
        note.author_id = user.id

        await this.noteRepository.save(note)

        return note;
    }

    /**
     * Update note service
     * 
     * @param {Note} note 
     * @param {number} id 
     * @returns {Promise<Note>}
     */
    public async updateNote(newNote: Note, note: Note): Promise<Note> {
        this.logger.log('update note: ' + note.id);

        const { title, body, shared } = newNote

        note.title = title;
        note.body = body;
        note.shared = shared;

        await this.noteRepository.save(note)

        return note

    }

    /**
     * Delete note service
     * 
     * @param {number} id 
     * @returns {Promise<any>}
     */
    public async deleteNote(id: number): Promise<any> {
        this.logger.log('delete note: ' + id);

        return await this.noteRepository.delete(id)
    }

}
