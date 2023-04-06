import { Brackets, EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { Note } from '../models';
import { NotesFilter } from '../notes.filter';

@EntityRepository(Note)
export class NoteRepository extends Repository<Note> {

    /**
     * Find notes query builder
     * 
     * @param {NotesFilter} filter 
     * @returns {SelectQueryBuilder<Note>}
     */
    public findNotesQueryBuilder(filter: NotesFilter): SelectQueryBuilder<Note> {
        const queryBuilder = this.createQueryBuilder('n');

        queryBuilder
            .leftJoinAndSelect('n.author', 'a')
            .andWhere(new Brackets(sqb => {
                sqb.where('n.shared = TRUE');
                sqb.orWhere('a.id = :userId', { userId: filter.user.id });
            }))


        return queryBuilder;
    }

    /**
     * Find notes with filter query builder
     * 
     * @param {NotesFilter} filter 
     * @returns {Promise<Note[]>}
     */
    public findNotesWithFilterQueryBuilder(filter: NotesFilter): Promise<Note[]> {

        const notes = this.findNotesQueryBuilder(filter)
            .orderBy('n.createdDate', filter.order)
            .offset(filter.start)
            .limit(filter.limit)
            .getMany()

        return notes;
    }
}
