import { fixtureCreator, one } from 'typeorm-fixtures';
import * as faker from 'faker';

import { Note } from 'note/models';
import { User } from 'user/models';

export const createNotesFixture = fixtureCreator<Note>(Note, function(entity, index) {
    let note = new Note();

    note.title = faker.lorem.sentence();
    note.body = faker.lorem.paragraphs(10, '\n\n');
    note.shared = faker.random.boolean();
    note.createdDate = new Date();
    note = { ...note, ...entity };
    note.author = one(this, User, { id: Math.floor(Math.random() * 10) + 1 });

    return note;
});
