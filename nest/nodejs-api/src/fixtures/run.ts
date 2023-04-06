import { createUsersFixture } from './create-users.fixture';
import { TypeormFixtures } from 'typeorm-fixtures';
import { Logger } from 'common/services';
import { createNotesFixture } from './create-notes.fixture';
import { User } from '../user/models';

Logger.log('Loading fixtures ...');

const typeormFixtures = new TypeormFixtures();

typeormFixtures
    .addFixture(createUsersFixture([{ username: 'admin', enabled: true }, ...Array(10).fill({})]))
    .findEntities({}, User)
    .addFixture(createNotesFixture(Array(30).fill({})));


typeormFixtures.loadFixtures().then(() => {
    Logger.log('Fixtures loaded');
    process.exit(0);
}).catch(error => {
    Logger.error('Fixture loading failed : ' + error.message, error.stack);
    process.exit(1);
});